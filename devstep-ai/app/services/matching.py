"""
DevStep AI — RAG 기반 AI 매칭 서비스 (Supabase Sync & Onboarding 활용)

Harness 아키텍처 기반:
  1. Input Hook: Onboarding Survey 연동 + Gemini 정규화
  2. Embeddings: Google 3072차원 벡터 생성
  3. Search: pgvector 1차 후보군 조회
  4. Final Inference: Gemini Pro 심층 매칭
  5. Output Hook: 검증 및 정렬
"""

from __future__ import annotations

import logging
import json
import time

from google import genai
from google.genai.types import HttpOptions, EmbedContentConfig
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.activity import Activity
from app.models.onboarding import OnboardingSurvey
from app.services.matching_hooks import preprocess_query, inject_variables, postprocess_match

logger = logging.getLogger(__name__)

settings = get_settings()

class MatchResult:
    def __init__(self, normalized_skills: list[str], matches: list[dict]):
        self.normalized_skills = normalized_skills
        self.matches = matches

class MatchingService:
    """
    Supabase 온보딩 데이터와 연동되는 AI 매칭 서비스
    """
    def __init__(self) -> None:
        # Task 5: Vertex AI 마이그레이션 (환경 변수 기반 자동 초기화)
        self._client = genai.Client(http_options=HttpOptions(api_version="v1"))
        self._norm_model = "gemini-3-flash-preview"
        # Task 1: 모델 경량화 (Pro -> Flash)
        self._eval_model = "gemini-3-flash-preview"
        self._embed_model = "gemini-embedding-001"
        self._dim = 3072

    async def _get_survey_skills(self, db: AsyncSession, user_id: str) -> list[str]:
        """
        Supabase의 onboarding_surveys 테이블에서 유저의 현재 기술 스택을 가져옵니다.
        """
        stmt = select(OnboardingSurvey).where(OnboardingSurvey.user_id == user_id)
        result = await db.execute(stmt)
        survey = result.scalar_one_or_none()

        if not survey or not survey.survey_data:
            return []
        
        # JSON 구조: { point_a: { current_skills: [...] } }
        point_a = survey.survey_data.get("point_a", {})
        return point_a.get("current_skills", [])

    async def _get_embedding(self, text: str) -> list[float]:
        try:
            result = await self._client.aio.models.embed_content(
                model=self._embed_model,
                contents=text,
                config=EmbedContentConfig(output_dimensionality=self._dim)
            )
            return result.embeddings[0].values
        except Exception as e:
            logger.error(f"Embedding 생성 실패: {e}")
            raise

    async def _fetch_candidates(self, db: AsyncSession, query_vector: list[float], top_k: int = 20) -> list[dict]:
        distance = Activity.skill_embedding.cosine_distance(query_vector)
        stmt = (
            select(
                Activity.activity_id,
                Activity.title,
                Activity.required_skills,
                Activity.description,
            )
            .where(Activity.skill_embedding.is_not(None))
            .order_by(distance)
            .limit(top_k)
        )
        result = await db.execute(stmt)
        rows = result.all()
        return [
            {
                "activity_id": r.activity_id,
                "title": r.title,
                "required_skills": r.required_skills,
                "description": r.description,
            }
            for r in rows
        ]

    async def match(
        self,
        db_factory, # Task 1: 커넥션 고갈 방지를 위해 세션 팩토리를 주입받음
        user_id: str,
        target_job: str,
        manual_skills: list[str] | None = None,
        top_k: int = 5,
    ) -> MatchResult:
        """
        Supabase 설문 기반 RAG 매칭 파이프라인 (DB Connection Starvation Fix Ver.)
        """
        start_total = time.time()
        
        # 1. 기술 스택 결정
        if manual_skills:
            skills_to_use = manual_skills
        else:
            logger.info(f"유저({user_id})의 온보딩 설문 데이터를 조회합니다.")
            # [DB Step 1] 유저 스킬 조회 (단기 세션)
            async with db_factory() as db:
                skills_to_use = await self._get_survey_skills(db, user_id)
            
        if not skills_to_use:
            logger.warning(f"유저({user_id})의 기술 스택 정보가 없습니다.")
            return MatchResult(normalized_skills=[], matches=[])

        # 2. 정규화 (Input Hook) - [AI Step 1] (DB 커넥션 미사용)
        start_step1 = time.time()
        logger.info("파이프라인 Step 1: 기술 스택 정규화 시작")
        normalized = await preprocess_query(skills_to_use, self._client)
        logger.info(f"파이프라인 Step 1 완료 (소요시간: {time.time() - start_step1:.4f}s)")
        
        # 3. 임베딩 및 검색
        start_step2 = time.time()
        logger.info(f"파이프라인 Step 2: {self._dim}차원 임베딩 및 DB 검색 (top_k=10)")
        combined_text = ", ".join(normalized)
        # [AI Step 2] 임베딩 생성 (DB 커넥션 미사용)
        vector = await self._get_embedding(combined_text)
        
        # [DB Step 2] 후보군 검색 (단기 세션)
        async with db_factory() as db:
            candidates = await self._fetch_candidates(db, vector, top_k=10)
        logger.info(f"파이프라인 Step 2 완료 (소요시간: {time.time() - start_step2:.4f}s)")
        
        if not candidates:
            return MatchResult(normalized_skills=normalized, matches=[])

        # 4. AI 심층 평가 (Prompt Injection)
        start_step3 = time.time()
        logger.info("파이프라인 Step 3: AI 심층 평가 시작 (Payload optimization)")
        
        # Task 3: 프롬프트 페이로드 다이어트 (Description 제외)
        light_candidates = [
            {
                "activity_id": c["activity_id"],
                "title": c["title"],
                "required_skills": c["required_skills"]
            }
            for c in candidates
        ]
        
        variables = {
            "target_job": target_job,
            "skills": normalized,
            "activities": light_candidates
        }
        prompt = inject_variables("app/prompts/matching_template.txt", variables)
        
        response = await self._client.aio.models.generate_content(
            model=self._eval_model,
            contents=prompt
        )
        logger.info(f"파이프라인 Step 3 완료 (소요시간: {time.time() - start_step3:.4f}s)")
        
        # 5. 후처리 (Output Hook)
        logger.info("파이프라인 Step 5: 결과 검증 및 후처리")
        final_matches = postprocess_match(response.text)
        
        logger.info(f"전체 매칭 파이프라인 완료 (총 소요시간: {time.time() - start_total:.4f}s)")
        
        return MatchResult(
            normalized_skills=normalized,
            matches=final_matches[:top_k]
        )

    async def save_user_bookmark(self, db: AsyncSession, user_id: str, activity_id: int):
        """북마크 실제 저장 로직 (선택 사항)"""
        pass

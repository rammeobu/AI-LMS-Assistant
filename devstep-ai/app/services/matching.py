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

from google import genai
from google.genai import types
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
        self._client = genai.Client(api_key=settings.GOOGLE_AI_API_KEY)
        self._norm_model = "gemini-3.1-flash-lite-preview"
        self._eval_model = "gemini-3.1-pro-preview"
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
                config=types.EmbedContentConfig(output_dimensionality=self._dim)
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
        db: AsyncSession,
        user_id: str,
        target_job: str,
        manual_skills: list[str] | None = None,
        top_k: int = 5,
    ) -> MatchResult:
        """
        Supabase 설문 기반 RAG 매칭 파이프라인
        """
        # 1. 기술 스택 결정 (수동 입력이 없으면 설문 데이터 사용)
        if manual_skills:
            skills_to_use = manual_skills
        else:
            logger.info(f"유저({user_id})의 온보딩 설문 데이터를 조회합니다.")
            skills_to_use = await self._get_survey_skills(db, user_id)
            
        if not skills_to_use:
            logger.warning(f"유저({user_id})의 기술 스택 정보가 없습니다.")
            return MatchResult(normalized_skills=[], matches=[])

        # 2. 정규화 (Input Hook)
        logger.info("파이프라인 Step 1: 기술 스택 정규화")
        normalized = await preprocess_query(skills_to_use, self._client)
        
        # 3. 임베딩 및 검색
        logger.info(f"파이프라인 Step 2: {self._dim}차원 임베딩 및 DB 검색")
        combined_text = ", ".join(normalized)
        vector = await self._get_embedding(combined_text)
        candidates = await self._fetch_candidates(db, vector, top_k=20)
        
        if not candidates:
            return MatchResult(normalized_skills=normalized, matches=[])

        # 4. AI 심층 평가 (Prompt Injection)
        logger.info("파이프라인 Step 3: AI 심층 평가")
        variables = {
            "target_job": target_job,
            "skills": normalized,
            "activities": candidates
        }
        prompt = inject_variables("app/prompts/matching_template.txt", variables)
        
        response = await self._client.aio.models.generate_content(
            model=self._eval_model,
            contents=prompt
        )
        
        # 5. 후처리 (Output Hook)
        logger.info("파이프라인 Step 5: 결과 검증 및 후처리")
        final_matches = postprocess_match(response.text)
        
        return MatchResult(
            normalized_skills=normalized,
            matches=final_matches[:top_k]
        )

    async def save_user_bookmark(self, db: AsyncSession, user_id: str, activity_id: int):
        """북마크 실제 저장 로직 (선택 사항)"""
        pass

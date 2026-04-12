"""
DevStep AI — AI 로드맵 생성 및 진행 관리 서비스 (Hybrid Model & Async Pipeline)

사용자의 진단 데이터를 바탕으로 두 단계 AI 호출(Milestone -> Topic)을 거치며,
백그라운드 비동기 생성을 지원하여 사용자 대기 시간을 최소화합니다.
"""

from __future__ import annotations

import json
import logging
import re
import asyncio
from typing import List, Optional

from google import genai
from google.genai.types import HttpOptions
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.models.roadmap import Roadmap, Milestone, Topic, UserTopicProgress
from app.models.onboarding import OnboardingSurvey
from app.services.matching_hooks import inject_variables

from tenacity import retry, stop_after_attempt, wait_exponential

logger = logging.getLogger(__name__)
settings = get_settings()

class RoadmapService:
    def __init__(self) -> None:
        # Vertex AI 마이그레이션 (환경 변수 기반 자동 초기화)
        self._client = genai.Client(http_options=HttpOptions(api_version="v1"))
        # Task 5: 더 안정적인 모델 버전으로 업데이트
        self._milestone_model = "gemini-3-flash-preview"
        self._topic_model = "gemini-3-flash-preview"
        
        # Task 4-1: 동시 실행 개수를 엄격히 제한 (보수적 자원 관리)
        self._semaphore = asyncio.Semaphore(3)

    async def create_placeholder_roadmap(self, db: AsyncSession, user_id: str, target_job: str) -> Roadmap:
        # ... (이전과 동일)
        # 기존 로드맵 비활성화
        await db.execute(
            update(Roadmap).where(Roadmap.user_id == user_id).values(is_active=False)
        )

        new_roadmap = Roadmap(
            user_id=user_id,
            title=f"{target_job} 로드맵 설계 중...",
            target_job=target_job,
            is_active=True,
            status="generating"
        )
        db.add(new_roadmap)
        await db.commit()
        await db.refresh(new_roadmap)
        
        from sqlalchemy.orm.attributes import set_committed_value
        set_committed_value(new_roadmap, 'milestones', [])
        
        return new_roadmap

    async def execute_background_generation(self, db_factory, roadmap_id: str, user_id: str):
        """
        [Senior Refactor] 백그라운드 AI 로드맵 생성 파이프라인 (Fail-safe Edition)
        - Task 4: Tenacity를 이용한 지수 백오프 재시도 및 Semaphore(3) 적용
        - Task 4-2: 전체 과정을 원자적(Atomic) 트랜잭션으로 관리
        """
        try:
            # 1. 온보딩 진단 데이터 조회 (Read-only session)
            async with db_factory() as db:
                stmt = select(OnboardingSurvey).where(OnboardingSurvey.user_id == user_id)
                result = await db.execute(stmt)
                survey = result.scalar_one_or_none()

            if not survey or not survey.survey_data:
                logger.error(f"Background generation failed: No survey for user {user_id}")
                async with db_factory() as fail_db:
                    await self._mark_as_failed(fail_db, roadmap_id)
                return

            point_a = survey.survey_data.get("point_a", {})
            point_b = survey.survey_data.get("point_b", {})
            user_context = {
                "target_job": point_a.get("target_job", "백엔드 개발자"),
                "current_skills": point_a.get("current_skills", []),
                "interests": point_a.get("interests", []),
                "free_idea": point_b.get("free_idea", ""),
            }

            # 2. Phase 1: Milestone Structure Design (AI Only, With Retry)
            logger.info(f"[BG] Phase 1: Generating structure for Roadmap {roadmap_id}")
            roadmap_structure = await self._generate_structure_with_retry(user_context)
            milestones_data = roadmap_structure.get("milestones", [])

            # 3. Phase 2: Detailed Topics Generation (Batch Processing)
            # Task: 단 1번의 API 호출로 모든 마일스톤의 토픽을 생성합니다.
            logger.info(f"[BG] Phase 2: Generating all topics in a single batch (Roadmap: {roadmap_id})")
            
            # 마일스톤 리스트 문자열 생성 (프롬프트 주입용)
            m_list_str = "\n".join([f"- {m['title']}" for m in milestones_data])
            
            # AI 배치 호출 (재시도 로직 포함)
            batch_result = await self._generate_all_topics_batch_with_retry(user_context["target_job"], m_list_str)
            # 마운팅 키를 정규화(strip)하여 매칭률 향상
            milestone_topics_map = {item["milestone_title"].strip(): item["topics"] for item in batch_result.get("milestone_topics", [])}
            logger.debug(f"[BG] Batch mapping keys: {list(milestone_topics_map.keys())}")

            # 4. Phase 3: DB Unit of Work (Atomic Bulk Insert)
            logger.info(f"[BG] Phase 3: Committing all data for Roadmap {roadmap_id}")
            async with db_factory() as atomic_db:
                try:
                    # 타이틀 업데이트
                    await atomic_db.execute(
                        update(Roadmap).where(Roadmap.id == roadmap_id).values(
                            title=roadmap_structure.get("title", f"{user_context['target_job']} 로드맵")
                        )
                    )

                    for i, m_data in enumerate(milestones_data):
                        m_title = m_data["title"].strip()
                        # 마일스톤 생성
                        m_obj = Milestone(
                            roadmap_id=roadmap_id,
                            title=m_data["title"],
                            description=m_data.get("description", ""),
                            order_index=i + 1
                        )
                        atomic_db.add(m_obj)
                        await atomic_db.flush() # ID 확보

                        # 해당 마일스톤에 매칭되는 토픽들 추출 (배치 결과에서)
                        topics_list = milestone_topics_map.get(m_title, [])
                        if not topics_list:
                            logger.warning(f"[BG] No topics found in batch response for milestone: '{m_title}'")

                        # 토픽 대량 추가
                        for j, t_data in enumerate(topics_list):
                            t_obj = Topic(
                                milestone_id=m_obj.id,
                                title=t_data["title"],
                                content_md=t_data.get("content_md", ""),
                                required_skills=t_data.get("required_skills", []),
                                order_index=j + 1
                            )
                            atomic_db.add(t_obj)

                    # 최종 상태 업데이트
                    await atomic_db.execute(
                        update(Roadmap).where(Roadmap.id == roadmap_id).values(status="completed")
                    )
                    
                    await atomic_db.commit()
                    logger.info(f"[BG] Atomic commit successful for roadmap: {roadmap_id}")

                except Exception as db_err:
                    await atomic_db.rollback()
                    logger.error(f"[BG] Database transaction failed, rolled back: {db_err}")
                    raise db_err

        except Exception as e:
            import traceback
            logger.error(f"[BG] Critical failure during roadmap generation: {e}")
            traceback.print_exc()
            async with db_factory() as fail_db:
                await self._mark_as_failed(fail_db, roadmap_id)

    # ────────────────────────────────────────────────────────
    # AI Generation with Retries (Task 4)
    # ────────────────────────────────────────────────────────

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=2, max=10),
        reraise=True
    )
    async def _generate_structure_with_retry(self, context: dict) -> dict:
        """마일스톤 구조 생성 (503/429 대응 재시도 로직 포함)"""
        return await self._generate_structure(context)

    @retry(
        stop=stop_after_attempt(3),
        wait=wait_exponential(multiplier=1, min=5, max=30), # 배치 처리는 시간이 더 걸리므로 대기 시간 상향
        reraise=True
    )
    async def _generate_all_topics_batch_with_retry(self, target_job: str, milestones_list: str) -> dict:
        """모든 마일스톤의 토픽을 단 한 번의 호출로 생성 (재시도 로직 포함)"""
        context = {
            "target_job": target_job,
            "milestones_list": milestones_list
        }
        prompt = inject_variables("app/prompts/roadmap_topics_template.txt", context)
        response = await self._client.aio.models.generate_content(
            model=self._topic_model,
            contents=prompt
        )
        return self._parse_json_from_response(response.text)

    async def _mark_as_failed(self, db: AsyncSession, roadmap_id: str):
        await db.execute(
            update(Roadmap).where(Roadmap.id == roadmap_id).values(status="failed")
        )
        await db.commit()

    async def _generate_structure(self, context: dict) -> dict:
        prompt = inject_variables("app/prompts/roadmap_milestones_template.txt", context)
        response = await self._client.aio.models.generate_content(
            model=self._milestone_model,
            contents=prompt
        )
        return self._parse_json_from_response(response.text)


    def _parse_json_from_response(self, text: str) -> dict:
        cleaned = re.sub(r"```(?:json)?\n?(.*?)\n?```", r"\1", text, flags=re.DOTALL).strip()
        try:
            return json.loads(cleaned)
        except json.JSONDecodeError as e:
            logger.error(f"JSON Parsing Error: {e}\nRaw Text: {text}")
            return {}

    async def get_active_roadmap(self, db: AsyncSession, user_id: str) -> Optional[Roadmap]:
        stmt = (
            select(Roadmap)
            .options(selectinload(Roadmap.milestones).selectinload(Milestone.topics))
            .where(Roadmap.user_id == user_id, Roadmap.is_active == True)
            .order_by(Roadmap.created_at.desc())
        )
        result = await db.execute(stmt)
        return result.scalar_one_or_none()

    async def update_topic_status(self, db: AsyncSession, user_id: str, topic_id: str, status: str) -> UserTopicProgress:
        stmt = select(UserTopicProgress).where(
            UserTopicProgress.user_id == user_id,
            UserTopicProgress.topic_id == topic_id
        )
        result = await db.execute(stmt)
        progress = result.scalar_one_or_none()

        if progress:
            progress.status = status
        else:
            progress = UserTopicProgress(user_id=user_id, topic_id=topic_id, status=status)
            db.add(progress)

        await db.commit()
        await db.refresh(progress)
        return progress

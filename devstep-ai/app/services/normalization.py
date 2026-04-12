import logging
import json
import re
from pathlib import Path

from google import genai
from google.genai.types import HttpOptions
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import get_settings
from app.models.crawled import CrawledData
from app.models.ai_processed import AIProcessedData
from app.models.activity import Activity
from app.services.matching_hooks import inject_variables

logger = logging.getLogger(__name__)
settings = get_settings()

class NormalizationService:
    """
    CrawledData와 AIProcessedData를 결합하여 정규화된 Activity로 변환하는 서비스
    """
    def __init__(self) -> None:
        # Vertex AI 마이그레이션 (환경 변수 기반 자동 초기화)
        self._client = genai.Client(http_options=HttpOptions(api_version="v1"))
        self._norm_model = "gemini-3-flash-preview"
        self._embed_model = "gemini-embedding-001"
        self._dim = 3072

    def _parse_tags(self, tag_data: list[str] | str | None) -> list[str]:
        """태그 데이터를 리스트로 파싱 (PostgreSQL ARRAY 또는 JSON 문자열 지원)"""
        if not tag_data:
            return []
        if isinstance(tag_data, list):
            return tag_data
        try:
            # 문자열 형태의 JSON인 경우 처리
            return json.loads(tag_data)
        except (json.JSONDecodeError, TypeError):
            # 쉼표로 구분된 문자열인 경우 처리
            return [t.strip() for t in str(tag_data).split(",") if t.strip()]

    async def normalize_and_sync(self, db: AsyncSession, crawled_id: int):
        """
        단일 항목 정규화 및 activities 테이블 저장 (원천 데이터 + AI 분석 태그 결합)
        """
        # 1. 두 테이블 조인하여 데이터 조회
        stmt = (
            select(CrawledData, AIProcessedData)
            .join(AIProcessedData, CrawledData.id == AIProcessedData.crawling_id)
            .where(CrawledData.id == crawled_id)
        )
        result = await db.execute(stmt)
        row = result.first()
        
        if not row:
            logger.error(f"Crawled record or AI processed data for ID {crawled_id} not found.")
            return
            
        record, ai_record = row

        logger.info(f"Processing record {crawled_id}: {record.title}")

        try:
            # 2. AI 정규화 (LLM) - 설명 보강 및 기술 스택 추출
            variables = {
                "title": record.title or "Unknown",
                "organization": record.organization or "Unknown",
                "description": record.description or "No description",
                "homepage": record.homepage or "N/A",
                "subject": record.subject or "N/A"
            }
            prompt = inject_variables("app/prompts/normalize_activity.txt", variables)
            
            response = await self._client.aio.models.generate_content(
                model=self._norm_model,
                contents=prompt
            )

            # JSON 파싱
            cleaned = re.sub(r"```(?:json)?\n?(.*?)\n?```", r"\1", response.text, flags=re.DOTALL).strip()
            norm_data = json.loads(cleaned)

            # 3. 임베딩 생성 (태그 정보 결합)
            domain_tags = self._parse_tags(ai_record.domain_tags)
            activity_types = self._parse_tags(ai_record.activity_types)
            benefit_tags = self._parse_tags(ai_record.benefit_tags)
            
            # 풍부한 맥락을 위한 텍스트 조합 (상세 내용은 제외하고 태그와 키워드 중심)
            all_keywords = self._parse_tags(ai_record.all_keywords)
            
            context_parts = [
                f"제목: {norm_data['title']}",
                f"주최: {record.organization}",
                f"분야: {', '.join(domain_tags)}" if domain_tags else "",
                f"활동 형태: {', '.join(activity_types)}" if activity_types else "",
                f"주요 혜택: {', '.join(benefit_tags)}" if benefit_tags else "",
                f"요구 역량: {', '.join(norm_data['required_skills'])}",
                f"핵심 키워드: {', '.join(all_keywords)}" if all_keywords else ""
            ]
            embedding_text = "\n".join([p for p in context_parts if p])
            
            logger.info(f"Generating 3072-dim embedding for: {norm_data['title']}")
            embed_res = await self._client.aio.models.embed_content(
                model=self._embed_model,
                contents=embedding_text,
                config={'output_dimensionality': self._dim}
            )
            vector = embed_res.embeddings[0].values

            # 4. Activity 생성 및 저장
            new_activity = Activity(
                title=norm_data["title"],
                category=norm_data["category"],
                source_type=norm_data["source_type"],
                status=norm_data.get("status", "모집중"),
                deadline=None,  # DateTime 파싱 생략
                required_skills=norm_data["required_skills"],
                skill_embedding=vector,
                source_url=record.homepage,
                description=norm_data["description"]
            )
            db.add(new_activity)
            
            # 마킹
            record.is_processed = True
            record.last_error = None
            
            await db.commit()
            logger.info(f"Successfully normalized and synced: {norm_data['title']}")

        except Exception as e:
            logger.error(f"Normalization failed for {crawled_id}: {e}")
            record.last_error = str(e)
            await db.commit()
            raise

    async def get_unprocessed_ids(self, db: AsyncSession, limit: int = 10):
        # AIProcessedData가 존재하는 항목만 가져옴
        stmt = (
            select(CrawledData.id)
            .join(AIProcessedData, CrawledData.id == AIProcessedData.crawling_id)
            .where(CrawledData.is_processed == False)
            .limit(limit)
        )
        result = await db.execute(stmt)
        return result.scalars().all()

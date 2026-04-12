import logging
import json
import re
from pathlib import Path

from google import genai
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import get_settings
from app.models.crawled import CrawledData
from app.models.activity import Activity
from app.services.matching_hooks import inject_variables

logger = logging.getLogger(__name__)
settings = get_settings()

class NormalizationService:
    """
    CrawledData를 분석하여 정규화된 Activity로 변환하는 서비스
    """
    def __init__(self) -> None:
        self._client = genai.Client(api_key=settings.GOOGLE_AI_API_KEY)
        self._norm_model = "gemini-3.1-flash-lite-preview"
        self._embed_model = "gemini-embedding-001"
        self._dim = 3072

    async def normalize_and_sync(self, db: AsyncSession, crawled_id: int):
        """
        단일 항목 정규화 및 activities 테이블 저장
        """
        # 1. 원천 데이터 조회
        stmt = select(CrawledData).where(CrawledData.id == crawled_id)
        result = await db.execute(stmt)
        record = result.scalar_one_or_none()
        
        if not record:
            logger.error(f"Crawled record {crawled_id} not found.")
            return

        logger.info(f"Processing record {crawled_id}: {record.title}")

        try:
            # 2. AI 정규화 (LLM)
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

            # 3. 임베딩 생성
            embedding_text = f"Title: {norm_data['title']}\nSkills: {', '.join(norm_data['required_skills'])}\nDescription: {norm_data['description']}"
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
                deadline=None,  # DateTime 파싱 생략 (필요 시 추가)
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
        stmt = select(CrawledData.id).where(CrawledData.is_processed == False).limit(limit)
        result = await db.execute(stmt)
        return result.scalars().all()

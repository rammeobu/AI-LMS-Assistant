import asyncio
import logging
from app.worker.celery_app import celery_app
from app.core.database import async_session_factory
from app.services.normalization import NormalizationService

logger = logging.getLogger(__name__)

@celery_app.task(name="devstep.ping")
def ping() -> str:
    """Celery 연결 테스트용 태스크"""
    return "pong"

@celery_app.task(name="devstep.sync_crawled_data")
def sync_crawled_data(batch_size: int = 5):
    """
    미처리된 크롤링 데이터를 AI 정규화하여 활동(Activities) 테이블로 동기화합니다.
    """
    async def _run():
        service = NormalizationService()
        async with async_session_factory() as db:
            unprocessed_ids = await service.get_unprocessed_ids(db, limit=batch_size)
            
            if not unprocessed_ids:
                logger.info("No unprocessed crawling data found.")
                return 0
                
            count = 0
            for record_id in unprocessed_ids:
                try:
                    await service.normalize_and_sync(db, record_id)
                    count += 1
                except Exception as e:
                    logger.error(f"Task failed for record {record_id}: {e}")
                    continue
            
            return count

    # 동기 환경(Celery)에서 비동기 로직 실행
    loop = asyncio.get_event_loop()
    processed_count = loop.run_until_complete(_run())
    return f"Processed {processed_count} records."

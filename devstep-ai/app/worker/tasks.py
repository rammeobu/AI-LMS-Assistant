import asyncio
import logging
from app.worker.celery_app import celery_app
from app.core.database import async_session_factory
from app.services.normalization import NormalizationService
from app.services.github_analysis import GitHubAnalysisService

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
@celery_app.task(name="devstep.generate_roadmap")
def generate_roadmap_task(roadmap_id: str, user_id: str):
    """
    백그라운드에서 AI 로드맵 생성을 수행합니다.
    """
    async def _run():
        from app.services.roadmap import RoadmapService
        service = RoadmapService()
        await service.execute_background_generation(async_session_factory, roadmap_id, user_id)

    loop = asyncio.get_event_loop()
    loop.run_until_complete(_run())
    return f"Roadmap generation task completed for {roadmap_id}"

@celery_app.task(name="devstep.analyze_github_stack")
def analyze_github_stack_task(user_id: str, github_token: str):
    """
    백그라운드에서 GitHub 레포지토리를 분석하여 기술 스택을 추출합니다.
    """
    async def _run():
        service = GitHubAnalysisService()
        skills = await service.analyze_stack(github_token)
        
        if skills:
            from app.models.onboarding import Portfolio
            from sqlalchemy import select
            async with async_session_factory() as db:
                # 포트폴리오 테이블에 기술 스택 저장 (Upsert 스타일)
                stmt = select(Portfolio).where(Portfolio.user_id == user_id)
                result = await db.execute(stmt)
                portfolio = result.scalar_one_or_none()
                
                if portfolio:
                    portfolio.tech_stacks = list(set((portfolio.tech_stacks or []) + skills))
                else:
                    new_portfolio = Portfolio(user_id=user_id, tech_stacks=skills)
                    db.add(new_portfolio)
                
                await db.commit()
                logger.info(f"GitHub Stack Analysis saved for user {user_id}")
        
        return skills

    loop = asyncio.get_event_loop()
    result = loop.run_until_complete(_run())
    return f"Analysis complete for {user_id}: {result}"

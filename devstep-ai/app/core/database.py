"""
DevStep AI — Database Connection (SQLAlchemy 2.0)

PostgreSQL 엔진, 세션 팩토리, 그리고 FastAPI 의존성 주입용 제너레이터를 제공합니다.
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import (
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

from app.core.config import get_settings

settings = get_settings()

# ── DATABASE_URL 프로토콜 변환 ──
# 일반 postgresql:// URL을 asyncpg 드라이버용으로 변환
_database_url = settings.DATABASE_URL
if _database_url.startswith("postgresql://"):
    _database_url = _database_url.replace("postgresql://", "postgresql+asyncpg://", 1)

# ── 비동기 엔진 생성 ──
engine = create_async_engine(
    _database_url,
    echo=False,          # True로 변경 시 SQL 로그 출력
    pool_size=10,
    max_overflow=20,
    pool_pre_ping=True,  # 커넥션 풀 유효성 검사
)

# ── 세션 팩토리 ──
async_session_factory = async_sessionmaker(
    bind=engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """
    FastAPI Depends()에서 사용할 DB 세션 제너레이터.

    Usage:
        @router.get("/items")
        async def list_items(db: AsyncSession = Depends(get_db)):
            ...
    """
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()

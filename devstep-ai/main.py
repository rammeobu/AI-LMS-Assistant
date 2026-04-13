"""
DevStep AI Worker API — Application Entry Point

모듈형 아키텍처로 리팩토링된 FastAPI 진입점.
라우터 등록, CORS, 그리고 Lifespan 이벤트를 관리합니다.

실행:
    uvicorn main:app --host 0.0.0.0 --port 8000 --reload
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import get_settings
from app.api.endpoints import health, match, roadmaps, extract

settings = get_settings()


# ── Lifespan (startup / shutdown 이벤트) ──
@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 시작/종료 시 실행되는 이벤트"""
    # Startup
    print(f"{settings.APP_TITLE} v{settings.APP_VERSION} starting...")
    yield
    # Shutdown
    print("Shutting down DevStep AI Worker...")


# ── FastAPI 인스턴스 생성 ──
app = FastAPI(
    title=settings.APP_TITLE,
    description="Microservice for handling RAG, Vector Search, and Background Crawling for DevStep.",
    version=settings.APP_VERSION,
    lifespan=lifespan,
)

# ── CORS 설정 (기존과 동일) ──
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── 라우터 등록 ──
app.include_router(health.router)
app.include_router(match.router, prefix="/api/v1/match", tags=["Matching"])
app.include_router(roadmaps.router, prefix="/api/v1/roadmaps", tags=["Roadmap & LMS"])
app.include_router(extract.router, prefix="/api/v1/extract", tags=["GitHub Extraction"])

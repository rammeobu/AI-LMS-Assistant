"""
DevStep AI — Application Configuration

pydantic-settings 기반 환경 변수 관리.
.env 파일 또는 시스템 환경 변수에서 자동으로 값을 로드합니다.
"""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """전역 설정 — 환경 변수에서 자동 바인딩"""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",  # .env에 정의된 기타 변수 무시
    )

    # ── Database (PostgreSQL / Supabase) ──
    DATABASE_URL: str = "postgresql://devstep:devstep_local_2026@db:5432/devstep_db"

    # ── Supabase Cloud ──
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    # ── OpenAI / AI Engine ──
    OPENAI_API_KEY: str = ""
    GOOGLE_AI_API_KEY: str = ""

    # ── Redis (Celery broker) ──
    REDIS_URL: str = "redis://redis:6379/0"

    # ── CORS ──
    CORS_ORIGINS: str = "http://localhost:3000"

    # ── App Metadata ──
    APP_TITLE: str = "DevStep AI Worker API"
    APP_VERSION: str = "1.0.0"

    @property
    def cors_origin_list(self) -> list[str]:
        """쉼표로 구분된 CORS_ORIGINS 문자열을 리스트로 변환"""
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]


@lru_cache
def get_settings() -> Settings:
    """싱글톤 Settings 인스턴스를 반환 (캐시)"""
    return Settings()

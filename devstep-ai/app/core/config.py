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

    # ── Database Strategy ──
    DB_MODE: str = "local" # local | supabase
    LOCAL_DATABASE_URL: str = "postgresql://devstep:devstep_local_2026@db:5432/devstep_db"
    SUPABASE_DATABASE_URL: str = ""

    @property
    def DATABASE_URL(self) -> str:
        """DB_MODE에 따라 적절한 데이터베이스 URL을 반환합니디."""
        if self.DB_MODE.lower() == "supabase":
            return self.SUPABASE_DATABASE_URL
        return self.LOCAL_DATABASE_URL

    # ── Supabase Cloud ──
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""

    # ── OpenAI / AI Engine ──
    OPENAI_API_KEY: str = ""
    GOOGLE_API_KEY: str = ""

    # ── Google Cloud / Vertex AI ──
    GOOGLE_CLOUD_PROJECT: str = ""
    GOOGLE_CLOUD_LOCATION: str = "asia-northeast3"
    GOOGLE_GENAI_USE_VERTEXAI: bool = True
    GOOGLE_APPLICATION_CREDENTIALS: str = ""

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
    s = Settings()
    # SDK 자동 감지를 위해 환경 변수 주입
    import os
    if s.GOOGLE_API_KEY:
        os.environ["GOOGLE_API_KEY"] = s.GOOGLE_API_KEY
    if s.GOOGLE_CLOUD_PROJECT:
        os.environ["GOOGLE_CLOUD_PROJECT"] = s.GOOGLE_CLOUD_PROJECT
    if s.GOOGLE_CLOUD_LOCATION:
        os.environ["GOOGLE_CLOUD_LOCATION"] = s.GOOGLE_CLOUD_LOCATION
    if s.GOOGLE_APPLICATION_CREDENTIALS:
        os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = s.GOOGLE_APPLICATION_CREDENTIALS
    os.environ["GOOGLE_GENAI_USE_VERTEXAI"] = str(s.GOOGLE_GENAI_USE_VERTEXAI)
    return s

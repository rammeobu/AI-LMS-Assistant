"""
DevStep AI — Crawled Data ORM Model

Supabase의 `crawling_data` 테이블을 SQLAlchemy로 매핑합니다.
이 데이터는 AI 매칭을 위한 원천 데이터(Source)로 활용됩니다.
"""

from datetime import datetime
from sqlalchemy import Integer, String, Text, DateTime, func, Boolean
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base

class CrawledData(Base):
    """외부 크롤링 원천 데이터 모델"""

    __tablename__ = "crawling_data"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    collected_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    organization: Mapped[str | None] = mapped_column(String(255))
    title: Mapped[str | None] = mapped_column(String(255))
    subject: Mapped[str | None] = mapped_column(String(255))
    start_date: Mapped[str | None] = mapped_column(String(20))
    end_date: Mapped[str | None] = mapped_column(String(20))
    target: Mapped[str | None] = mapped_column(String(100))
    homepage: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    # ── 처리 상태 관리 ──
    is_processed: Mapped[bool] = mapped_column(Boolean, default=False)
    last_error: Mapped[str | None] = mapped_column(Text)

    def __repr__(self) -> str:
        return f"<CrawledData(id={self.id}, title={self.title!r}, is_processed={self.is_processed})>"

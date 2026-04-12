"""
DevStep AI — Activity ORM Model

init.sql의 `activities` 테이블을 SQLAlchemy 2.0 + pgvector로 매핑합니다.
"""

from datetime import datetime

from pgvector.sqlalchemy import Vector, HALFVEC
from sqlalchemy import Integer, String, Text, DateTime, func, ForeignKey, PrimaryKeyConstraint
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base


class Activity(Base):
    """외부 대외활동/공모전/인턴십 모델"""

    __tablename__ = "activities"

    activity_id: Mapped[int] = mapped_column(
        Integer, primary_key=True, autoincrement=True
    )
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    category: Mapped[str | None] = mapped_column(String(50))
    source_type: Mapped[str | None] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(
        String(20), default="모집중"
    )
    deadline: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    required_skills: Mapped[dict | None] = mapped_column(
        JSONB, default=list
    )

    # ── pgvector: 요구 역량 벡터 (코사인 유사도 검색용) ──
    skill_embedding = mapped_column(
        HALFVEC(3072), nullable=True, comment="요구 역량 벡터 (Google gemini-embedding, 3072차원, halfvec)"
    )

    source_url: Mapped[str | None] = mapped_column(Text)
    thumbnail_url: Mapped[str | None] = mapped_column(Text)
    description: Mapped[str | None] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<Activity(id={self.activity_id}, title={self.title!r})>"

class UserBookmark(Base):
    """사용자 찜하기 (N:M)"""
    __tablename__ = "user_bookmarks"

    user_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True
    )
    activity_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("activities.activity_id", ondelete="CASCADE"), primary_key=True
    )
    bookmarked_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    __table_args__ = (
        PrimaryKeyConstraint("user_id", "activity_id"),
    )

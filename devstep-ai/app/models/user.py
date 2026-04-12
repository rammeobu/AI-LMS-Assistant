"""
DevStep AI — User 모델 (Supabase Sync)

프론트엔드 및 Supabase Auth와 완벽하게 동기화된 유저 모델입니다.
PK는 'id' (UUID)를 사용합니다.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import Boolean, String, Text, DateTime, func
from sqlalchemy.dialects.postgresql import UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.onboarding import OnboardingSurvey
    from app.models.onboarding import Portfolio
    from app.models.roadmap import Roadmap

class User(Base):
    """
    Supabase 'public.users' 테이블과 매핑되는 모델
    """
    __tablename__ = "users"

    # Supabase Auth UID와 일치하는 UUID PK (as_uuid=False로 문자열 취급)
    id: Mapped[str] = mapped_column(PG_UUID(as_uuid=False), primary_key=True, comment="Supabase Auth ID")
    
    email: Mapped[str | None] = mapped_column(String(255), unique=True)
    name: Mapped[str | None] = mapped_column(String(100))
    avatar_url: Mapped[str | None] = mapped_column(Text)
    
    # 온보딩 완료 여부
    is_onboarded: Mapped[bool] = mapped_column(Boolean, default=False)
    
    # 메타데이터
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationship
    onboarding_survey: Mapped["OnboardingSurvey"] = relationship("OnboardingSurvey", back_populates="user", uselist=False)
    portfolio: Mapped["Portfolio"] = relationship("Portfolio", back_populates="user", uselist=False)
    roadmaps: Mapped[list["Roadmap"]] = relationship("Roadmap", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self) -> str:
        return f"<User(id={self.id}, email={self.email}, name={self.name})>"

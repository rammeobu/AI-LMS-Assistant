"""
DevStep AI — Onboarding & Portfolio 모델 (Supabase Sync)

프론트엔드에서 저장하는 상세 진단 데이터를 매핑합니다.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import String, DateTime, ForeignKey, func, Integer
from sqlalchemy.dialects.postgresql import JSONB, UUID as PG_UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User

class OnboardingSurvey(Base):
    """
    AI 분석의 핵심 소스인 상세 설문 데이터 (Point A & B)
    """
    __tablename__ = "onboarding_surveys"

    survey_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        primary_key=True, 
        server_default=func.uuid_generate_v4()
    )
    
    # users.id 참조
    user_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        unique=True, 
        nullable=False
    )
    
    # 프론트엔드 JSON 구조: { profile: {}, point_a: {}, point_b: {} }
    survey_data: Mapped[dict] = mapped_column(JSONB, nullable=False, server_default='{}')
    
    version: Mapped[int] = mapped_column(Integer, default=1)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="onboarding_survey")


class Portfolio(Base):
    """
    사용자 기술 스택 및 포트폴리오 요약
    """
    __tablename__ = "portfolio"

    portfolio_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        primary_key=True, 
        server_default=func.uuid_generate_v4()
    )
    
    user_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        unique=True, 
        nullable=False
    )
    
    tech_stacks: Mapped[list[str]] = mapped_column(JSONB, server_default='[]')
    certifications: Mapped[list[dict]] = mapped_column(JSONB, server_default='[]')
    activities: Mapped[list[dict]] = mapped_column(JSONB, server_default='[]')
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationship
    user: Mapped["User"] = relationship("User", back_populates="portfolio")

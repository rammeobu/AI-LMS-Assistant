"""
DevStep AI — Roadmap & LMS 모델 (AI-Driven)

사용자의 커리어 로드맵, 마일스톤, 세부 토픽 및 진행 상태를 정의합니다.
이 모델은 Supabase의 'roadmaps', 'milestones', 'topics', 'user_topic_progress' 테이블과 매핑됩니다.
"""

from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING, List, Optional

from sqlalchemy import String, Text, DateTime, ForeignKey, func, Integer, Boolean
from sqlalchemy.dialects.postgresql import UUID as PG_UUID, ARRAY
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.models.base import Base

if TYPE_CHECKING:
    from app.models.user import User


class Roadmap(Base):
    """
    사용자의 커리어 목표를 위한 최상위 로드맵 엔티티
    """
    __tablename__ = "roadmaps"

    id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        primary_key=True, 
        server_default=func.uuid_generate_v4()
    )
    
    user_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    target_job: Mapped[str] = mapped_column(String(100), nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, server_default="true")
    version: Mapped[int] = mapped_column(Integer, default=1)
    
    # status: generating, completed, failed
    status: Mapped[str] = mapped_column(String(20), default="generating", server_default="generating")

    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="roadmaps")
    milestones: Mapped[List["Milestone"]] = relationship(
        "Milestone", back_populates="roadmap", cascade="all, delete-orphan", order_by="Milestone.order_index"
    )


class Milestone(Base):
    """
    로드맵을 구성하는 커다른 학습 단계 (챕터)
    """
    __tablename__ = "milestones"

    id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        primary_key=True, 
        server_default=func.uuid_generate_v4()
    )
    
    roadmap_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        ForeignKey("roadmaps.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    roadmap: Mapped["Roadmap"] = relationship("Roadmap", back_populates="milestones")
    topics: Mapped[List["Topic"]] = relationship(
        "Topic", back_populates="milestone", cascade="all, delete-orphan", order_by="Topic.order_index"
    )


class Topic(Base):
    """
    실제 학습 과제이자 AI 매칭의 기준이 되는 토픽 노드
    """
    __tablename__ = "topics"

    id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        primary_key=True, 
        server_default=func.uuid_generate_v4()
    )
    
    milestone_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        ForeignKey("milestones.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    content_md: Mapped[Optional[str]] = mapped_column(Text)
    required_skills: Mapped[List[str]] = mapped_column(ARRAY(String), server_default='{}')
    order_index: Mapped[int] = mapped_column(Integer, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    milestone: Mapped["Milestone"] = relationship("Milestone", back_populates="topics")
    progress: Mapped[List["UserTopicProgress"]] = relationship("UserTopicProgress", back_populates="topic")


class UserTopicProgress(Base):
    """
    유저별 개별 토픽 학습 진행 상태
    """
    __tablename__ = "user_topic_progress"

    id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        primary_key=True, 
        server_default=func.uuid_generate_v4()
    )
    
    user_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        ForeignKey("users.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    topic_id: Mapped[str] = mapped_column(
        PG_UUID(as_uuid=False), 
        ForeignKey("topics.id", ondelete="CASCADE"), 
        nullable=False,
        index=True
    )
    
    # status: todo, in_progress, completed
    status: Mapped[str] = mapped_column(String(20), server_default="todo", default="todo")
    
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    # Relationships
    topic: Mapped["Topic"] = relationship("Topic", back_populates="progress")

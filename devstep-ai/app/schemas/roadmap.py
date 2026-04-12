from __future__ import annotations

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, ConfigDict, Field

# ─────────────────────────────────────────────
# Topic Schemas
# ─────────────────────────────────────────────

class TopicBase(BaseModel):
    title: str
    content_md: Optional[str] = None
    required_skills: List[str] = []
    order_index: int

class TopicCreate(TopicBase):
    pass

class TopicRead(TopicBase):
    id: str
    milestone_id: str
    created_at: datetime
    
    # 진행 상태 포함 (선택사항)
    status: str = "todo"
    
    model_config = ConfigDict(from_attributes=True)

# ─────────────────────────────────────────────
# Milestone Schemas
# ─────────────────────────────────────────────

class MilestoneBase(BaseModel):
    title: str
    order_index: int
    description: Optional[str] = None

class MilestoneCreate(MilestoneBase):
    pass

class MilestoneRead(MilestoneBase):
    id: str
    roadmap_id: str
    created_at: datetime
    topics: List[TopicRead] = []
    
    model_config = ConfigDict(from_attributes=True)

# ─────────────────────────────────────────────
# Roadmap Schemas
# ─────────────────────────────────────────────

class RoadmapBase(BaseModel):
    title: str
    target_job: str
    is_active: bool = True
    version: int = 1

class RoadmapCreate(RoadmapBase):
    user_id: str

class RoadmapRead(RoadmapBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime
    status: str = "generating"
    milestones: List[MilestoneRead] = []
    
    model_config = ConfigDict(from_attributes=True)

# ─────────────────────────────────────────────
# Request / Response DTOs
# ─────────────────────────────────────────────

class RoadmapGenerateRequest(BaseModel):
    user_id: str
    target_job: str
    # 추가 컨텍스트 (필요 시)
    interests: List[str] = []

class ProgressUpdate(BaseModel):
    status: str = Field(..., pattern="^(todo|in_progress|completed)$")

class RoadmapSummary(BaseModel):
    id: str
    title: str
    target_job: str
    is_active: bool
    updated_at: datetime
    status: str = "generating"
    
    model_config = ConfigDict(from_attributes=True)

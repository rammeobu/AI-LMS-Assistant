"""
DevStep AI — Activity Matching Endpoint (Supabase Sync)

유저의 ID와 목표 직무를 기반으로 AI 매칭 결과를 반환합니다.
유저의 온보딩 설문 데이터를 기본으로 활용하며, 필요 시 수동 스택 입력도 지원합니다.
"""

from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.services.matching import MatchingService

router = APIRouter()

# ─────────────────────────────────────────────
# Request / Response Schemas
# ─────────────────────────────────────────────
class MatchRequest(BaseModel):
    """매칭 요청 DTO (Supabase ID 기반)"""
    user_id: str = Field(
        ...,
        example="a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
        description="Supabase 유저 고유 ID (UUID)",
    )
    target_job: str = Field(
        ...,
        example="백엔드 개발자",
        description="유저의 목표 직무",
    )
    skills: list[str] | None = Field(
        default=None,
        examples=[["리액트", "파이썬"]],
        description="수동 입력 기술 스택 (미입력 시 온보딩 데이터 활용)",
    )
    top_k: int = Field(
        default=5,
        ge=1,
        le=20,
        description="반환할 최대 결과 수",
    )

class ActivityScoreResponse(BaseModel):
    activity_id: int
    title: str
    score: int
    reason: str

class MatchResponse(BaseModel):
    normalized_skills: list[str]
    matches: list[ActivityScoreResponse]

# ─────────────────────────────────────────────
# Service Instance
# ─────────────────────────────────────────────
_matching_service = MatchingService()

# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────
@router.post(
    "/activities",
    response_model=MatchResponse,
    summary="AI 기술 스택 매칭 (Supabase 연동)",
)
async def match_activities(
    body: MatchRequest,
    db: AsyncSession = Depends(get_db),
) -> MatchResponse:
    try:
        result = await _matching_service.match(
            db=db,
            user_id=body.user_id,
            target_job=body.target_job,
            manual_skills=body.skills,
            top_k=body.top_k,
        )
        
        return MatchResponse(
            normalized_skills=result.normalized_skills,
            matches=[ActivityScoreResponse(**activity) for activity in result.matches],
        )
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=500,
            detail=f"AI 매칭 프로세스 중 오류 발생: {str(e)}",
        )

@router.post("/bookmarks")
async def create_bookmark(
    user_id: str,
    activity_id: int,
    db: AsyncSession = Depends(get_db),
):
    await _matching_service.save_user_bookmark(db, user_id, activity_id)
    return {"status": "ok"}

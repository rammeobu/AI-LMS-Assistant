"""
DevStep AI — Roadmap & LMS Endpoints

AI 기반 로드맵 생성, 조회 및 개별 토픽의 학습 상태를 관리하는 API를 제공합니다.
"""

from __future__ import annotations

import logging
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional

from app.core.database import get_db, async_session_factory
from app.schemas.roadmap import (
    RoadmapRead, 
    RoadmapGenerateRequest, 
    ProgressUpdate,
    RoadmapSummary
)
from app.services.roadmap import RoadmapService
from app.worker.tasks import generate_roadmap_task

logger = logging.getLogger(__name__)
router = APIRouter()

# ─────────────────────────────────────────────
# Service Instance
# ─────────────────────────────────────────────
_roadmap_service = RoadmapService()

# ─────────────────────────────────────────────
# Endpoints
# ─────────────────────────────────────────────

@router.post(
    "/generate", 
    response_model=RoadmapRead,
    status_code=202,
    summary="AI 기반 맞춤형 로드맵 생성 (비동기)",
    description="생성 요청을 즉시 수락하고 백그라운드에서 AI 로드맵 설계를 시작합니다."
)
async def generate_user_roadmap(
    body: RoadmapGenerateRequest,
    db: AsyncSession = Depends(get_db)
):
    try:
        # 1. 플레이스홀더 생성 (ID 확보 및 유저 리다이렉용)
        logger.info(f"Roadmap generation requested for user {body.user_id}")
        roadmap = await _roadmap_service.create_placeholder_roadmap(
            db, body.user_id, body.target_job
        )

        # 2. 백그라운드 태스크 등록 (Task 3: Celery에 완전 위임)
        generate_roadmap_task.delay(roadmap_id=str(roadmap.id), user_id=body.user_id)

        return roadmap
    except Exception as e:
        import traceback
        # Task 1: 시니어 개발자를 위한 상세 에러 로깅 및 가시성 확보
        logger.error(f"Failed to start roadmap generation for user {body.user_id}: {e}")
        traceback.print_exc() 
        
        # 실제 내부 에러 메시지를 detail에 포함하여 프론트엔드/디버깅 단계에서 즉시 파악 가능하도록 함
        raise HTTPException(
            status_code=500, 
            detail=f"로드맵 생성 시작 실패: {str(e)}"
        )


@router.get(
    "/active", 
    response_model=Optional[RoadmapRead],
    summary="활성 로드맵 조회",
    description="현재 유저에게 활성화된(is_active=True) 최신 로드맵을 트리 구조로 반환합니다."
)
async def get_active_roadmap(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    roadmap = await _roadmap_service.get_active_roadmap(db, user_id)
    if not roadmap:
        return None
    return roadmap


@router.patch(
    "/topics/{topic_id}/status",
    summary="토픽 학습 상태 업데이트",
    description="특정 학습 토픽의 진행 상태(todo, in_progress, completed)를 변경합니다."
)
async def update_topic_progress(
    topic_id: str,
    user_id: str,
    body: ProgressUpdate,
    db: AsyncSession = Depends(get_db)
):
    try:
        progress = await _roadmap_service.update_topic_status(
            db, user_id, topic_id, body.status
        )
        return {"status": "success", "progress_id": progress.id, "current_status": progress.status}
    except Exception as e:
        logger.error(f"Progress update failed: {e}")
        raise HTTPException(status_code=500, detail="상태 업데이트 중 오류가 발생했습니다.")

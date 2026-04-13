from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
from typing import List, Optional

from app.core.database import get_db
from app.models.user import User
from app.models.onboarding import Portfolio
from app.worker.tasks import analyze_github_stack_task

router = APIRouter()

class ExtractRequest(BaseModel):
    user_id: str
    github_token: str

class ExtractStatusResponse(BaseModel):
    status: str
    skills: List[str] = []

@router.post("/github", status_code=202)
async def trigger_github_extraction(
    request: ExtractRequest,
    db: AsyncSession = Depends(get_db)
):
    """
    사용자의 GitHub 기술 스택 추출을 비동기로 시작합니다.
    """
    # 유저 확인
    stmt = select(User).where(User.id == request.user_id)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # DB에 토큰 저장 (추후 재사용 및 데이터 보존을 위함)
    user.github_token = request.github_token
    await db.commit()

    # Celery 작업 트리거
    task = analyze_github_stack_task.delay(request.user_id, request.github_token)
    
    return {"task_id": task.id, "message": "Extraction started"}

@router.get("/github/status/{user_id}", response_model=ExtractStatusResponse)
async def get_extraction_status(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """
    추출된 기술 스택 상태를 조회합니다. 
    (현재는 단순 DB 조회로 처리하며, 추후 Celery 상태와 연동 가능)
    """
    stmt = select(Portfolio).where(Portfolio.user_id == user_id)
    result = await db.execute(stmt)
    portfolio = result.scalar_one_or_none()
    
    if not portfolio:
        return {"status": "pending", "skills": []}
    
    return {
        "status": "completed" if portfolio.tech_stacks else "processing",
        "skills": portfolio.tech_stacks or []
    }

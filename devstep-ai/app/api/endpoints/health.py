"""
DevStep AI — Health Check Endpoints

기존 main.py에 있던 루트(/) 및 /health 엔드포인트를 APIRouter로 분리.
"""

from fastapi import APIRouter

router = APIRouter(tags=["Health"])


@router.get("/", summary="Root — 서비스 상태 확인")
def read_root():
    return {"status": "ok", "message": "DevStep AI Worker API is running"}


@router.get("/health", summary="Health Check")
def health_check():
    return {"status": "healthy"}

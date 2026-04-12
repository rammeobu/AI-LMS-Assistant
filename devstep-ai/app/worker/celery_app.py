"""
DevStep AI — Celery Application

비동기 백그라운드 작업(크롤링, 임베딩 생성 등)을 처리하는 Celery 인스턴스.
"""

from celery import Celery

from app.core.config import get_settings

settings = get_settings()

celery_app = Celery(
    "devstep_worker",
    broker=settings.REDIS_URL,
    backend=settings.REDIS_URL,
)

celery_app.conf.update(
    task_serializer="json",
    result_serializer="json",
    accept_content=["json"],
    timezone="Asia/Seoul",
    enable_utc=True,
    task_track_started=True,
    # 자동으로 app/worker/ 내부의 태스크 모듈을 검색
    imports=["app.worker.tasks"],
)

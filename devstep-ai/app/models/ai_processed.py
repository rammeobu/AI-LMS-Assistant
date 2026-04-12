"""
DevStep AI — AI Processed Data ORM Model

crawling_data 테이블의 결과로 생성된 태그 정보를 담는 
`ai_processed_data` 테이블을 SQLAlchemy로 매핑합니다.
"""

from datetime import datetime
from sqlalchemy import String, DateTime, func, ForeignKey, BigInteger
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base

class AIProcessedData(Base):
    """AI 분석 결과 태그 데이터 모델"""

    __tablename__ = "ai_processed_data"

    crawling_id: Mapped[int] = mapped_column(
        BigInteger, ForeignKey("crawling_data.id", ondelete="CASCADE"), primary_key=True
    )
    
    # 태그 정보 (PostgreSQL ARRAY 형식)
    domain_tags: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    activity_types: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    benefit_tags: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    all_keywords: Mapped[list[str] | None] = mapped_column(ARRAY(String))
    
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )

    def __repr__(self) -> str:
        return f"<AIProcessedData(crawling_id={self.crawling_id})>"

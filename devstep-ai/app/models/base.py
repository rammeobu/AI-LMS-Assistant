"""
DevStep AI — SQLAlchemy Declarative Base

모든 ORM 모델이 상속할 Base 클래스를 정의합니다.
"""

from sqlalchemy.orm import DeclarativeBase


class Base(DeclarativeBase):
    """모든 SQLAlchemy ORM 모델의 공통 베이스 클래스"""
    pass

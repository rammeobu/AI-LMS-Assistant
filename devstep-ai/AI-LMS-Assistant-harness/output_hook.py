"""
input_hook.py
입력 전처리 훅 - 사용자 데이터를 정제하고 프롬프트 변수에 주입
"""

from typing import Any


def preprocess_portfolio(user_data: dict) -> dict:
    """
    포트폴리오 분석용 입력 전처리
    - 빈 값 기본값 처리
    - 리스트 데이터를 문자열로 변환 (토큰 절감)
    - 불필요한 공백/특수문자 제거
    """
    def clean(value: Any, default: str = "없음") -> str:
        if not value:
            return default
        if isinstance(value, list):
            return ", ".join(str(v).strip() for v in value if v)
        return str(value).strip()

    return {
        "target_job": clean(user_data.get("target_job"), "미설정"),
        "skills": clean(user_data.get("skills"), "없음"),
        "projects": clean(user_data.get("projects"), "없음"),
        "activities": clean(user_data.get("activities"), "없음"),
        "certifications": clean(user_data.get("certifications"), "없음"),
    }


def preprocess_activity(user_data: dict, analysis_result: dict) -> dict:
    """
    활동 추천용 입력 전처리
    - 분석 결과의 부족 역량을 추출하여 주입
    """
    def clean(value: Any, default: str = "없음") -> str:
        if not value:
            return default
        if isinstance(value, list):
            return ", ".join(str(v).strip() for v in value if v)
        return str(value).strip()

    return {
        "target_job": clean(user_data.get("target_job"), "미설정"),
        "missing_skills": clean(analysis_result.get("missing_skills"), "없음"),
        "certifications": clean(user_data.get("certifications"), "없음"),
        "activities": clean(user_data.get("activities"), "없음"),
    }


def preprocess_roadmap(user_data: dict, analysis_result: dict) -> dict:
    """
    로드맵 추천용 입력 전처리
    """
    def clean(value: Any, default: str = "없음") -> str:
        if not value:
            return default
        if isinstance(value, list):
            return ", ".join(str(v).strip() for v in value if v)
        return str(value).strip()

    return {
        "target_job": clean(user_data.get("target_job"), "미설정"),
        "skills": clean(user_data.get("skills"), "없음"),
        "missing_skills": clean(analysis_result.get("missing_skills"), "없음"),
        "overall_score": str(analysis_result.get("overall_score", 0)),
    }


def inject_variables(template: str, variables: dict) -> str:
    """
    프롬프트 템플릿의 {{변수명}} 슬롯에 실제 값을 주입
    """
    for key, value in variables.items():
        template = template.replace(f"{{{{{key}}}}}", value)
    return template

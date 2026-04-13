"""
DevStep AI — Activity Matching Hooks (Google GenAI Native)

입력 전처리(Input Hook) 및 출력 후처리(Output Hook) 모듈.
Google GenAI SDK를 사용하여 고속 정규화 및 데이터 검증을 수행합니다.
"""

import asyncio
import logging
import json
import re
from pathlib import Path

from pydantic import BaseModel, ValidationError, Field

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────
# Pydantic Schemas for Validation
# ─────────────────────────────────────────────
class ActivityScore(BaseModel):
    activity_id: int
    title: str
    score: int = Field(ge=0, le=100)
    reason: str


# ─────────────────────────────────────────────
# Helpers for Thread Delegation
# ─────────────────────────────────────────────
def _read_file_sync(path: Path) -> str:
    return path.read_text(encoding="utf-8")

def _parse_json_from_ai_response(raw_text: str) -> dict:
    """
    AI 응답에서 JSON을 추출하고 파싱하는 CPU 집약적 작업
    """
    # 마크다운 제거
    cleaned = re.sub(r"```(?:json)?\n?(.*?)\n?```", r"\1", raw_text, flags=re.DOTALL).strip()
    # JSON 시작/끝 탐색 (안정성 강화)
    start_idx = cleaned.find("{")
    end_idx = cleaned.rfind("}") + 1
    if start_idx != -1 and end_idx != 0:
        cleaned = cleaned[start_idx:end_idx]
    
    return json.loads(cleaned)


# ─────────────────────────────────────────────
# Input Hook (전처리)
# ─────────────────────────────────────────────
async def preprocess_query(raw_skills: list[str], client, template_override: str | None = None) -> list[str]:
    """
    유저의 파편화된 기술 스택 목록을 Google GenAI를 이용해 정규화.
    [Root Cause Fix] 모든 블로킹 I/O 및 CPU 작업을 스레드로 위임.
    """
    if template_override is not None: # 빈 문자열 허용 및 None 체크 정밀화
        template_str = template_override
    else:
        prompt_path = Path("app/prompts/normalize_skills.txt")
        # [Root Cause Fix] 파일 존재 확인 및 읽기를 별도 스레드에서 수행
        exists = await asyncio.to_thread(prompt_path.exists)
        if not exists:
            logger.warning("정규화 프롬프트를 찾을 수 없습니다.")
            return raw_skills
        template_str = await asyncio.to_thread(_read_file_sync, prompt_path)
        
    skills_str = ", ".join(str(s).strip() for s in raw_skills if s)
    
    # 템플릿 변환 (간단한 치환이나 대량일 경우 CPU 점유 가능성 고려)
    prompt = template_str.replace("{{skills}}", skills_str)
    
    try:
        # Google GenAI Native SDK 호출 (비동기)
        response = await client.aio.models.generate_content(
            model="gemini-3-flash-preview",
            contents=prompt,
        )
        
        # [Root Cause Fix] JSON 추출 및 파싱(CPU-bound)을 스레드로 위임
        parsed = await asyncio.to_thread(_parse_json_from_ai_response, response.text)
        
        normalized = parsed.get("normalized", [])
        return normalized if normalized else raw_skills
    except Exception as e:
        logger.error(f"기술 스택 정규화 실패: {e}")
        return raw_skills


def inject_variables(template_path: str, variables: dict) -> str:
    """
    텍스트 파일 템플릿의 {{변수명}} 슬롯을 치환
    """
    path = Path(template_path)
    if not path.exists():
        raise FileNotFoundError(f"프롬프트 파일을 찾을 수 없습니다: {template_path}")
    template = path.read_text(encoding="utf-8")
    return inject_variables_from_str(template, variables)

def inject_variables_from_str(template: str, variables: dict) -> str:
    """
    문자열 템플릿의 {{변수명}} 슬롯을 치환 (메모리 캐시용)
    """
    for key, value in variables.items():
        if isinstance(value, (list, dict)):
            value = json.dumps(value, ensure_ascii=False)
        template = template.replace(f"{{{{{key}}}}}", str(value))
            
    return template


# ─────────────────────────────────────────────
# Output Hook (후처리 및 검증)
# ─────────────────────────────────────────────
def postprocess_match(raw_response: str) -> list[dict]:
    """
    AI 응답 텍스트를 파싱하고 Pydantic으로 스키마 준수 여부 및 점수 범위를 검증합니다.
    """
    # 마크다운 코드블록 제거
    cleaned = re.sub(r"```(?:json)?\n?(.*?)\n?```", r"\1", raw_response, flags=re.DOTALL).strip()
    
    try:
        # 가끔 앞뒤에 남는 불필요한 텍스트 제거를 위해 JSON 시작점 탐색
        start_idx = cleaned.find("[")
        end_idx = cleaned.rfind("]") + 1
        if start_idx != -1 and end_idx != 0:
            cleaned = cleaned[start_idx:end_idx]
            
        # [Root Cause Fix] 대량 데이터 파싱 시 루프 정지 방지를 위해 
        # 이 함수는 이미 서비스 레벨에서 asyncio.to_thread로 호출됨을 보장함
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        logger.error(f"JSON 파싱 에러: {e}\n원본 텍스트: {cleaned}")
        raise ValueError("AI가 기술적으로 올바른 JSON 리스트를 생성하지 못했습니다.")

    if not isinstance(data, list):
        raise ValueError("AI 추천 결과가 JSON 배열 형식이 아닙니다.")

    validated = []
    for item in data:
        try:
            valid_item = ActivityScore(**item)
            validated.append(valid_item.model_dump())
        except ValidationError as e:
            logger.warning(f"검증 실패 항목 스킵: {e}")
            continue

    # 점수 내림차순 정렬
    validated.sort(key=lambda x: x["score"], reverse=True)
    return validated

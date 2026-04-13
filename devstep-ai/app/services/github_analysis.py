import logging
import json
import re
import httpx
from typing import List, Dict, Any
from google import genai
from google.genai.types import HttpOptions

from app.core.config import get_settings
from app.services.matching_hooks import inject_variables
from app.services.normalization import NormalizationService

logger = logging.getLogger(__name__)
settings = get_settings()

class GitHubAnalysisService:
    def __init__(self):
        self._client = genai.Client(http_options=HttpOptions(api_version="v1"))
        self._model_name = "gemini-3-flash-preview"
        self._norm_service = NormalizationService()

    async def fetch_github_repos(self, token: str) -> List[Dict[str, Any]]:
        """사용자의 공개 레포지토리 목록을 가져옵니다."""
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3+json"
        }
        async with httpx.AsyncClient() as client:
            # 최근 업데이트 순으로 10개만 조회 (성능 및 타임아웃 고려)
            params = {"sort": "updated", "per_page": 10, "type": "public"}
            response = await client.get("https://api.github.com/user/repos", headers=headers, params=params)
            
            if response.status_code != 200:
                logger.error(f"GitHub API Error: {response.status_code} - {response.text}")
                return []
            
            return response.json()

    async def fetch_readme(self, token: str, owner: str, repo: str) -> str:
        """특정 레포지토리의 README 내용을 가져옵니다."""
        headers = {
            "Authorization": f"token {token}",
            "Accept": "application/vnd.github.v3.raw"
        }
        async with httpx.AsyncClient() as client:
            url = f"https://api.github.com/repos/{owner}/{repo}/readme"
            response = await client.get(url, headers=headers)
            
            if response.status_code != 200:
                return ""
            
            # 너무 긴 README는 모델 컨텍스트 제한을 위해 자름
            return response.text[:1000]

    async def analyze_stack(self, token: str) -> List[str]:
        """GitHub 데이터를 분석하여 기술 스택을 추출하고 정규화합니다."""
        repos = await self.fetch_github_repos(token)
        if not repos:
            return []

        repo_contexts = []
        all_repo_summary = []

        for repo in repos:
            name = repo["name"]
            lang = repo.get("language", "Unknown")
            desc = repo.get("description", "") or ""
            owner = repo["owner"]["login"]
            
            all_repo_summary.append(f"{name}({lang})")
            
            readme = await self.fetch_readme(token, owner, name)
            context = f"Project: {name} | Lang: {lang} | Desc: {desc}\nREADME: {readme}\n"
            repo_contexts.append(context)

        # AI 프롬프트 구성
        prompt = f"""
        당신은 개발자의 GitHub 활동을 분석하여 기술 스택을 식별하는 전문가입니다.
        사용자의 전체 공개 레포지토리 리스트: {", ".join(all_repo_summary)}

        특히 다음 주요 프로젝트들의 상세 내용입니다:
        {"-"*20}
        {"\n\n".join(repo_contexts)}
        {"-"*20}

        위 정보를 종합하여 이 개발자가 실무적으로 가장 많이 활용하고 전문성을 가진 기술 스택을 추출하세요.
        응답은 반드시 ["React", "TypeScript", "Node.js", ...]와 같은 JSON 문자열 배열 형식으로만 대답해 주세요.
        정규화되지 않은 이름이라도 괜찮습니다. 이후 단계에서 정규화할 예정입니다.
        """

        try:
            response = await self._client.aio.models.generate_content(
                model=self._model_name,
                contents=prompt
            )
            
            # JSON 추출
            text = response.text
            match = re.search(r"\[[\s\S]*\]", text)
            if not match:
                logger.warning(f"Failed to find JSON array in AI response: {text}")
                return []
            
            raw_skills = json.loads(match.group(0))
            logger.info(f"Raw skills extracted: {raw_skills}")

            # 여기서 정규화 서비스는 필요에 따라 추가 호출 가능하나, 
            # 현재 NormalizationService는 Activity 기반이므로 간단한 정규화 로직이나 
            # 향후 확장성을 위해 그대로 두거나 간단히 중복 제거 처리.
            return list(set(raw_skills))

        except Exception as e:
            logger.error(f"AI Stack Analysis failed: {e}")
            return []

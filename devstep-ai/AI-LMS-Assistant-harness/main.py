{
  "portfolio_analysis": {
    "description": "포트폴리오 분석 프롬프트에 주입되는 변수 스키마",
    "variables": {
      "target_job": {
        "type": "string",
        "required": true,
        "max_length": 50,
        "description": "사용자의 목표 직무 (예: 백엔드 엔지니어)",
        "default": "미설정"
      },
      "skills": {
        "type": "array|string",
        "required": true,
        "max_items": 20,
        "description": "보유 기술 스택 리스트 (예: [Java, Spring Boot, MySQL])",
        "default": "없음"
      },
      "projects": {
        "type": "array|string",
        "required": false,
        "max_items": 5,
        "description": "프로젝트 경험 목록",
        "default": "없음"
      },
      "activities": {
        "type": "array|string",
        "required": false,
        "max_items": 10,
        "description": "대외활동 이력 목록",
        "default": "없음"
      },
      "certifications": {
        "type": "array|string",
        "required": false,
        "max_items": 10,
        "description": "보유 자격증 목록",
        "default": "없음"
      }
    }
  },
  "recommend_activity": {
    "description": "활동 추천 프롬프트에 주입되는 변수 스키마",
    "variables": {
      "target_job": {
        "type": "string",
        "required": true,
        "max_length": 50,
        "description": "사용자의 목표 직무"
      },
      "missing_skills": {
        "type": "array|string",
        "required": true,
        "description": "포트폴리오 분석 결과에서 도출된 부족 역량"
      },
      "certifications": {
        "type": "array|string",
        "required": false,
        "description": "현재 보유 자격증"
      },
      "activities": {
        "type": "array|string",
        "required": false,
        "description": "현재 대외활동 이력"
      }
    }
  },
  "recommend_roadmap": {
    "description": "로드맵 추천 프롬프트에 주입되는 변수 스키마",
    "variables": {
      "target_job": {
        "type": "string",
        "required": true,
        "max_length": 50,
        "description": "사용자의 목표 직무"
      },
      "skills": {
        "type": "array|string",
        "required": true,
        "description": "현재 보유 기술 스택"
      },
      "missing_skills": {
        "type": "array|string",
        "required": true,
        "description": "포트폴리오 분석 결과에서 도출된 부족 역량"
      },
      "overall_score": {
        "type": "integer",
        "required": true,
        "min": 0,
        "max": 100,
        "description": "포트폴리오 종합 점수"
      }
    }
  }
}

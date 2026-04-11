# DevStep AI Worker — 하네스(Harness) 기법 가이드

## 개요

이 서비스는 **하네스(Harness) 기법**을 적용하여 Gemini AI 프롬프트를 운용합니다.
하네스 기법이란 고정된 시스템 프롬프트(템플릿)와 가변적인 사용자 입력(변수)을 분리하여,
매번 새로운 프롬프트를 작성하는 대신 입력값만 교체해 일관된 결과를 도출하는 전략입니다.

---

## 디렉토리 구조

```
devstep-ai/
├── main.py                       # FastAPI 앱 + 하네스 흐름 진입점
├── prompts/                      # 프롬프트 템플릿 (고정 영역)
│   ├── portfolio_analysis.txt    # 포트폴리오 분석용
│   ├── recommend_activity.txt    # 활동 추천용
│   └── recommend_roadmap.txt     # 로드맵 추천용
├── hooks/                        # 전처리 / 후처리 훅
│   ├── input_hook.py             # 입력 데이터 정제 및 변수 주입
│   └── output_hook.py            # AI 응답 파싱 및 검증
├── schema/
│   └── variables.json            # 변수 스키마 정의 (타입, 필수 여부, 최대 길이)
└── tests/
    ├── test_input.json           # 샘플 입력값
    └── test_output.json          # 기대 출력값 (재현성 검증용)
```

---

## 하네스 흐름

```
사용자 입력
    ↓
[input_hook.py]   — 빈 값 처리, 리스트→문자열 변환, 토큰 절감
    ↓
[prompts/*.txt]   — 템플릿 로드 + {{변수명}} 슬롯에 값 주입
    ↓
[Gemini API]      — 완성된 프롬프트로 AI 호출
    ↓
[output_hook.py]  — JSON 파싱, 필수 키 검증, 이상 출력 감지
    ↓
클라이언트 응답
```

---

## 프롬프트 변수 목록

### portfolio_analysis.txt
| 변수명 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `{{target_job}}` | string | ✅ | 목표 직무 |
| `{{skills}}` | string | ✅ | 보유 기술 스택 |
| `{{projects}}` | string | ❌ | 프로젝트 경험 |
| `{{activities}}` | string | ❌ | 대외활동 이력 |
| `{{certifications}}` | string | ❌ | 보유 자격증 |

### recommend_activity.txt
| 변수명 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `{{target_job}}` | string | ✅ | 목표 직무 |
| `{{missing_skills}}` | string | ✅ | 분석 결과 부족 역량 |
| `{{certifications}}` | string | ❌ | 현재 보유 자격증 |
| `{{activities}}` | string | ❌ | 현재 대외활동 이력 |

### recommend_roadmap.txt
| 변수명 | 타입 | 필수 | 설명 |
|---|---|---|---|
| `{{target_job}}` | string | ✅ | 목표 직무 |
| `{{skills}}` | string | ✅ | 현재 기술 스택 |
| `{{missing_skills}}` | string | ✅ | 부족 역량 |
| `{{overall_score}}` | integer | ✅ | 종합 역량 점수 |

---

## API 엔드포인트

| 메서드 | 경로 | 설명 |
|---|---|---|
| POST | `/api/analyze/portfolio` | 포트폴리오 역량 분석 |
| POST | `/api/recommend/activity` | 맞춤 활동 추천 |
| POST | `/api/recommend/roadmap` | 단계별 로드맵 추천 |

---

## 환경 변수 설정

```bash
# .env
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 재현성 검증

`tests/test_input.json`의 샘플 입력을 사용하면 `tests/test_output.json`과
유사한 결과가 출력되어야 합니다. 이를 통해 프롬프트 변경 시 품질 회귀를 빠르게 감지할 수 있습니다.

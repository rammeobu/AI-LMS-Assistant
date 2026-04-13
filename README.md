<p align="center">
  <img src="https://img.shields.io/badge/DevStep-AI%20Career%20Navigator-2563EB?style=for-the-badge&logo=rocket&logoColor=white" alt="DevStep Badge" />
</p>

<h1 align="center">🚀 DevStep — AI Career Navigator</h1>

<p align="center">
  <strong>데이터로 설계하고 AI로 가이드하는 전공 맞춤형 커리어 로드맵 플랫폼</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=nextdotjs" alt="Next.js" />
  <img src="https://img.shields.io/badge/FastAPI-0.109+-009688?logo=fastapi" alt="FastAPI" />
  <img src="https://img.shields.io/badge/Gemini-AI-4285F4?logo=google" alt="Gemini AI" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3FCF8E?logo=supabase" alt="Supabase" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?logo=opensourceinitiative" alt="License" />
</p>

---

## 📋 목차

- [프로젝트 소개](#-프로젝트-소개)
- [주요 기능](#-주요-기능)
- [기술 스택](#-기술-스택)
- [시스템 아키텍처](#-시스템-아키텍처)
- [프로젝트 구조](#-프로젝트-구조)
- [시작하기](#-시작하기)
- [환경 변수 설정](#-환경-변수-설정)
- [API 레퍼런스](#-api-레퍼런스)
- [데이터베이스 스키마](#-데이터베이스-스키마)
- [개발 가이드](#-개발-가이드)
- [라이선스](#-라이선스)

---

## 🎯 프로젝트 소개

**DevStep**은 대학생을 위한 AI 기반 올인원 커리어 성장 플랫폼입니다.

현재 대학생들은 인턴십, 대외활동, 자격증, 공모전 등 무수히 많은 커리어 요소들을 준비해야 하지만, 정보의 과잉 속에서 자신에게 어떤 역량이 부족한지, 무엇부터 해야 할지 판단하기 어렵습니다.

DevStep은 **AI가 사용자의 포트폴리오를 정밀 분석**하여 역량 격차를 진단하고, **개인화된 학습 로드맵과 대외활동을 추천**함으로써 체계적이고 효율적인 커리어 성장을 지원합니다.

### 핵심 가치

| 가치 | 설명 |
|---|---|
| 🔍 **역량 격차 진단** | AI가 목표 직무 대비 현재 역량을 객관적으로 분석 |
| 🗺️ **맞춤형 로드맵** | Gemini Pro 기반 개인화된 단계별 학습 경로 생성 |
| 🎯 **시맨틱 매칭** | pgvector 벡터 검색으로 최적 대외활동·자격증 추천 |
| 📅 **통합 일정 관리** | 추천 활동과 개인 일정을 캘린더에서 통합 관리 |
| 👥 **팀 빌딩** | 동일 활동에 관심 있는 사용자 간 매칭 및 협업 지원 |

---

## ✨ 주요 기능

### 1. 온보딩 진단 (Career Diagnostic)
- **Point A 진단**: 현재 보유 역량·경험·기술 스택 수집
- **Point B 진단**: 목표 직무·도메인·리소스·정성적 목표 설정
- **GitHub 연동**: 레포지토리 분석을 통한 기술 스택 자동 추출

### 2. AI 대시보드 (Dashboard Overview)
- 6축 레이더 차트 기반 역량 시각화
- 강·약점 분석 코멘트 자동 생성
- 목표 달성률 실시간 트래킹
- 출석 체크 및 To-do 관리

### 3. 합격자 패스파인더 (Roadmap Pathfinder)
- **메가 메뉴 직무 검색**: 대분류/소분류 드롭다운에서 직무를 검색하고 변경
- **동적 압축 뷰**: 과거/현재/미래 3개 노드 중심의 타임라인 (현재 1.5x Scale-up)
- **클릭 확장 애니메이션**: 중앙 노드 클릭 시 전체 마일스톤이 동적으로 펼쳐짐
- **인라인 AI 추천 피드**: 마감 임박 강의·스터디·자격증 카드 + 캘린더 추가 버튼
- **토픽 학습 관리**: todo → in_progress → completed 상태 추적

### 4. 디스커버리 피드 (Discovery Feed)
- AI 매칭 기반 대외활동·공모전 그리드 피드
- 크롤링 데이터 + activities 테이블 이중 소스 지원
- 북마크(찜하기) 기능
- 상세 정보 Drawer UI

### 5. 캘린더 싱크 (Calendar Sync)
- 월간/주간 캘린더 뷰
- AI 추천 활동 자동 동기화
- 실시간 커스텀 이벤트 기반 UI 갱신
- 드래그 앤 드롭 일정 관리

### 6. 팀업 보드 (Team-up Board)
- 팀빌딩 매칭 점수 뱃지 시스템
- 인라인 지원 모달 UI
- 역할(leader/member) 및 상태(pending/accepted/rejected) 관리

---

## 🛠️ 기술 스택

### Frontend (`devstep-web`)

| 기술 | 버전 | 용도 |
|---|---|---|
| **Next.js** | 16 (App Router) | 풀스택 React 프레임워크 |
| **React** | 19 | UI 라이브러리 |
| **TypeScript** | 5+ | 타입 안전성 |
| **Tailwind CSS** | 4 | 유틸리티 CSS 프레임워크 |
| **shadcn/ui** | 4+ | UI 컴포넌트 라이브러리 |
| **Framer Motion** | 12 | 애니메이션 엔진 |
| **Zustand** | 5 | 클라이언트 상태 관리 |
| **Recharts** | 3.8 | 데이터 시각화 (레이더 차트) |
| **Supabase SSR** | 0.10+ | 서버사이드 인증 |
| **Octokit** | 5 | GitHub API 연동 |

### Backend (`devstep-ai`)

| 기술 | 버전 | 용도 |
|---|---|---|
| **FastAPI** | 0.109+ | 고성능 비동기 API 프레임워크 |
| **Python** | 3.12+ | 백엔드 언어 |
| **Google GenAI SDK** | 0.1+ | Gemini AI 모델 연동 |
| **SQLAlchemy** | 2.0+ (Async) | 비동기 ORM |
| **Celery** | 5.3+ | 분산 비동기 태스크 큐 |
| **Pydantic** | 2.5+ | 데이터 검증 및 직렬화 |
| **pgvector** | 0.2+ | 벡터 유사도 검색 |
| **LangChain** | 0.1+ | LLM 체인 오케스트레이션 |
| **Tenacity** | 9+ | 재시도 로직 |

### AI 모델

| 모델 | 용도 |
|---|---|
| `gemini-3.1-flash-lite-preview` | 기술 스택 정규화, 데이터 정제 (Fast Worker) |
| `gemini-embedding-001` | 3072차원 고정밀 임베딩 생성 |
| `gemini-3.1-pro-preview` | 상세 로드맵 생성, 최종 추천 (High Reasoning) |

### Infrastructure

| 기술 | 용도 |
|---|---|
| **Docker Compose** | 멀티 컨테이너 오케스트레이션 |
| **PostgreSQL 16 + pgvector** | 벡터 지원 관계형 DB |
| **Redis 7** | Celery 메시지 브로커 |
| **Supabase** | 클라우드 DB + Auth |
| **uv** | Python 의존성 관리 (빌드 최적화) |

---

## 🏗️ 시스템 아키텍처

```
┌──────────────────────────────────────────────────────────────────┐
│                        Client (Browser)                          │
│                    Next.js 16 (App Router)                       │
│  ┌────────────┬──────────────┬─────────────┬──────────────────┐  │
│  │ Dashboard  │  Pathfinder  │  Discovery  │  Calendar Sync   │  │
│  │  Overview  │  (Roadmap)   │    Feed     │  (V2 Calendar)   │  │
│  └────────────┴──────────────┴─────────────┴──────────────────┘  │
│            │                                         │           │
│  ┌─────────┴──────────────────────────┐    ┌────────┴────────┐  │
│  │     Server Actions (BFF Layer)     │    │   Supabase SSR  │  │
│  │  match.ts · roadmap.ts · user.ts   │    │    Auth/CRUD    │  │
│  └─────────────────┬──────────────────┘    └────────┬────────┘  │
└────────────────────┼────────────────────────────────┼────────────┘
                     │ HTTP (JWT)                     │
┌────────────────────┼────────────────────────────────┼────────────┐
│                    ▼                                ▼            │
│  ┌──────────────────────────────┐    ┌──────────────────────┐   │
│  │    FastAPI (devstep-ai)      │    │     Supabase Cloud   │   │
│  │    :8000                     │    │   (PostgreSQL + Auth)│   │
│  │  ┌────────────────────────┐  │    └──────────────────────┘   │
│  │  │  /api/v1/match/*       │  │                               │
│  │  │  /api/v1/roadmaps/*    │  │                               │
│  │  │  /health               │  │                               │
│  │  └──────────┬─────────────┘  │                               │
│  │             │                │                               │
│  │  ┌──────────▼─────────────┐  │    ┌──────────────────────┐   │
│  │  │  Services Layer        │  │    │   Celery Worker      │   │
│  │  │  matching · roadmap    │──┼───▶│   (Background Tasks) │   │
│  │  │  normalization         │  │    │   roadmap generation │   │
│  │  └──────────┬─────────────┘  │    │   data normalization │   │
│  │             │                │    └──────────┬───────────┘   │
│  └─────────────┼────────────────┘               │               │
│                │                                │               │
│  ┌─────────────▼────────────────────────────────▼───────────┐   │
│  │              PostgreSQL 16 + pgvector                     │   │
│  │    users · roadmaps · milestones · topics · activities    │   │
│  │    crawling_data · onboarding_surveys · user_calendar     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                │                                                 │
│  ┌─────────────▼──────────────┐                                 │
│  │        Redis 7 (Broker)    │                                 │
│  └────────────────────────────┘                                 │
│                    Docker Compose Network                        │
└──────────────────────────────────────────────────────────────────┘
```

---

## 📁 프로젝트 구조

```
careermap/
├── 📂 devstep-web/                  # 🌐 프론트엔드 (Next.js 16)
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx           # 루트 레이아웃 (Inter + Outfit 폰트)
│   │   │   ├── page.tsx             # 랜딩 페이지
│   │   │   ├── globals.css          # 글로벌 스타일 & 디자인 토큰
│   │   │   ├── dashboard/           # 메인 대시보드 (SPA 탭 라우팅)
│   │   │   ├── login/               # 로그인 페이지
│   │   │   ├── onboarding/          # 온보딩 설문 (Point A/B)
│   │   │   ├── settings/            # 사용자 설정
│   │   │   ├── setup/               # 초기 프로필 설정
│   │   │   ├── auth/                # OAuth 콜백 핸들러
│   │   │   ├── actions/             # Server Actions (BFF)
│   │   │   │   ├── auth.ts          # 인증 관련 액션
│   │   │   │   ├── user.ts          # 사용자 프로필 CRUD
│   │   │   │   ├── roadmap.ts       # 로드맵 요청/조회
│   │   │   │   ├── github.ts        # GitHub API 연동
│   │   │   │   ├── calendarActions.ts  # 캘린더 CRUD
│   │   │   │   ├── todoActions.ts   # To-do 관리
│   │   │   │   └── attendanceActions.ts # 출석 체크
│   │   │   └── api/match/           # Next.js API Route (프록시)
│   │   ├── components/
│   │   │   ├── DashboardOverview.tsx # 대시보드 메인 뷰
│   │   │   ├── RoadmapPathfinder.tsx # 🌟 AI 로드맵 패스파인더
│   │   │   ├── DiscoveryFeed.tsx     # 대외활동 피드
│   │   │   ├── CalendarSyncV2.tsx    # 캘린더 싱크 V2
│   │   │   ├── TeamUpBoard.tsx       # 팀빌딩 보드
│   │   │   ├── Navbar.tsx            # 네비게이션 바
│   │   │   ├── Sidebar.tsx           # 사이드바 메뉴
│   │   │   ├── RadarChart.tsx        # 역량 레이더 차트
│   │   │   ├── ActivityDetailDrawer.tsx # 활동 상세 Drawer
│   │   │   ├── auth/                 # 인증 관련 컴포넌트
│   │   │   └── ui/                   # shadcn/ui 컴포넌트
│   │   ├── hooks/                    # 커스텀 React 훅
│   │   ├── store/
│   │   │   └── useOnboardingStore.ts # Zustand 온보딩 상태 관리
│   │   ├── types/                    # TypeScript 타입 정의
│   │   ├── lib/                      # 유틸리티 라이브러리
│   │   ├── utils/supabase/           # Supabase 클라이언트 설정
│   │   └── middleware.ts             # 세션 관리 미들웨어
│   ├── Dockerfile                    # 멀티스테이지 빌드
│   ├── package.json
│   └── tsconfig.json
│
├── 📂 devstep-ai/                   # 🤖 AI 백엔드 (FastAPI)
│   ├── main.py                       # FastAPI 진입점
│   ├── app/
│   │   ├── api/endpoints/
│   │   │   ├── health.py             # 헬스체크 (/, /health)
│   │   │   ├── match.py              # 활동 매칭 API
│   │   │   └── roadmaps.py           # 로드맵 생성/조회 API
│   │   ├── core/
│   │   │   ├── config.py             # 환경 변수 관리 (pydantic-settings)
│   │   │   └── database.py           # Async DB 세션 팩토리
│   │   ├── models/                   # SQLAlchemy ORM 모델
│   │   │   ├── user.py               # 사용자 모델
│   │   │   ├── roadmap.py            # 로드맵/마일스톤/토픽 모델
│   │   │   ├── activity.py           # 대외활동 모델 (벡터 컬럼)
│   │   │   ├── onboarding.py         # 온보딩 설문 모델
│   │   │   ├── crawled.py            # 크롤링 데이터 모델
│   │   │   └── ai_processed.py       # AI 처리 결과 모델
│   │   ├── schemas/                  # Pydantic 요청/응답 스키마
│   │   │   └── roadmap.py            # 로드맵 관련 DTO
│   │   ├── services/                 # 비즈니스 로직 레이어
│   │   │   ├── matching.py           # AI 매칭 서비스
│   │   │   ├── matching_hooks.py     # 매칭 후처리 훅
│   │   │   ├── normalization.py      # 기술 스택 정규화
│   │   │   └── roadmap.py            # 로드맵 생성 서비스
│   │   ├── prompts/                  # AI 프롬프트 템플릿
│   │   │   ├── roadmap_template.txt
│   │   │   ├── roadmap_milestones_template.txt
│   │   │   ├── roadmap_topics_template.txt
│   │   │   ├── matching_template.txt
│   │   │   ├── normalize_activity.txt
│   │   │   └── normalize_skills.txt
│   │   └── worker/                   # Celery 비동기 워커
│   │       ├── celery_app.py         # Celery 앱 설정
│   │       └── tasks.py              # 백그라운드 태스크 정의
│   ├── init.sql                      # DB 초기화 스크립트
│   ├── Dockerfile                    # uv 기반 멀티스테이지 빌드
│   ├── pyproject.toml                # Python 의존성 관리
│   └── requirements.txt              # 의존성 목록 (레거시)
│
├── 📂 artifact/                      # 📄 기획 문서
│   ├── final_devstep_prd.md          # 최종 기획안 (PRD)
│   ├── devstep_prd.md                # 초기 기획안
│   ├── backend_api_specification.md  # API 명세서
│   └── ui_ux_integration_report.md   # UI/UX 통합 리포트
│
├── docker-compose.yml                # 🐳 전체 서비스 오케스트레이션
├── .env.example                      # 환경 변수 템플릿
├── supabasedbschema                  # Supabase DB 스키마 덤프
├── PROJECT_CONTEXT.md                # 프로젝트 컨텍스트 문서
├── devstep_project_handover.md       # 인수인계 문서
├── LICENSE                           # MIT 라이선스
└── .gitignore
```

---

## 🚀 시작하기

### 사전 요구사항

- **Docker Desktop** ≥ 4.0 (권장)
- **Node.js** ≥ 20 (로컬 개발 시)
- **Python** ≥ 3.12 + **uv** (로컬 개발 시)
- **Google Cloud** 프로젝트 (Vertex AI / Gemini API 사용)
- **Supabase** 프로젝트 (인증 및 클라우드 DB)

### 방법 1: Docker Compose (권장)

모든 서비스를 한 번에 실행합니다.

```bash
# 1. 저장소 클론
git clone https://github.com/rammeobu/AI-LMS-Assistant.git
cd AI-LMS-Assistant

# 2. 환경 변수 설정
cp .env.example .env
# .env 파일을 열어 필수 값들을 채워 넣으세요

# 3. 전체 서비스 기동
docker compose up --build

# 4. 접속
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000
# API Docs:  http://localhost:8000/docs
```

**실행되는 서비스:**

| 서비스 | 컨테이너 | 포트 | 설명 |
|---|---|---|---|
| `devstep-web` | Next.js Dev Server | `3000` | 프론트엔드 (Hot Reload) |
| `devstep-ai` | FastAPI (Uvicorn) | `8000` | AI 백엔드 API |
| `devstep-worker` | Celery Worker | — | 백그라운드 태스크 |
| `db` | PostgreSQL 16 + pgvector | `5432` | 로컬 데이터베이스 |
| `redis` | Redis 7 Alpine | `6379` | 메시지 브로커 |

### 방법 2: 개별 실행 (로컬 개발)

```bash
# ── 1. 데이터베이스 & Redis 실행 ──
docker compose up -d db redis

# ── 2. AI 백엔드 (FastAPI) ──
cd devstep-ai
uv sync                                    # 의존성 설치
uv run uvicorn main:app --reload --port 8000

# ── 3. Celery Worker (별도 터미널) ──
cd devstep-ai
uv run celery -A app.worker.celery_app worker --loglevel=info

# ── 4. 프론트엔드 (Next.js) ──
cd devstep-web
npm install                                # 의존성 설치
npm run dev                                # http://localhost:3000
```

---

## 🔐 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 아래 변수를 설정하세요.

```env
# ── PostgreSQL (로컬 Docker) ──
POSTGRES_USER=devstep
POSTGRES_PASSWORD=devstep_local_2026
POSTGRES_DB=devstep_db
LOCAL_DATABASE_URL=postgresql://devstep:devstep_local_2026@db:5432/devstep_db

# ── Redis ──
REDIS_URL=redis://redis:6379/0

# ── Supabase Cloud ──
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# ── Google Cloud / Vertex AI ──
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_CLOUD_LOCATION=asia-northeast3
GOOGLE_APPLICATION_CREDENTIALS=/app/google-credentials.json
GOOGLE_GENAI_USE_VERTEXAI=True

# ── FastAPI ──
CORS_ORIGINS=http://localhost:3000
DB_MODE=local   # local | supabase

# ── Next.js ──
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_AI_API_URL=http://devstep-ai:8000
```

### DB 모드 전환

| 모드 | `DB_MODE` | 설명 |
|---|---|---|
| **로컬** | `local` | Docker PostgreSQL 사용 (개발용) |
| **클라우드** | `supabase` | Supabase Cloud PostgreSQL 사용 (운영용) |

---

## 📡 API 레퍼런스

### FastAPI 백엔드 (`devstep-ai` — `:8000`)

> 📖 **Swagger UI**: http://localhost:8000/docs

#### Health Check

| Method | Endpoint | 설명 |
|---|---|---|
| `GET` | `/` | 서비스 상태 확인 |
| `GET` | `/health` | 헬스 체크 |

#### Matching (활동 매칭)

| Method | Endpoint | 설명 |
|---|---|---|
| `POST` | `/api/v1/match/activities` | AI 기술 스택 기반 대외활동 매칭 |
| `POST` | `/api/v1/match/bookmarks` | 활동 북마크(찜하기) 저장 |

<details>
<summary><code>POST /api/v1/match/activities</code> — Request / Response 예시</summary>

**Request:**
```json
{
  "user_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "target_job": "백엔드 개발자",
  "skills": ["리액트", "파이썬"],
  "top_k": 5
}
```

**Response:**
```json
{
  "normalized_skills": ["React", "Python"],
  "matches": [
    {
      "activity_id": 1,
      "title": "카카오 테크 인턴십",
      "score": 92,
      "reason": "Python 및 백엔드 역량 강화에 최적화된 프로그램"
    }
  ]
}
```
</details>

#### Roadmaps (로드맵 & LMS)

| Method | Endpoint | 설명 |
|---|---|---|
| `POST` | `/api/v1/roadmaps/generate` | AI 로드맵 생성 (비동기 202) |
| `GET` | `/api/v1/roadmaps/active?user_id=` | 활성 로드맵 트리 조회 |
| `PATCH` | `/api/v1/roadmaps/topics/{topic_id}/status` | 토픽 학습 상태 업데이트 |

<details>
<summary><code>POST /api/v1/roadmaps/generate</code> — Request / Response 예시</summary>

**Request:**
```json
{
  "user_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
  "target_job": "프론트엔드 개발자"
}
```

**Response (202 Accepted):**
```json
{
  "id": "uuid-roadmap-id",
  "user_id": "...",
  "title": "프론트엔드 개발자 로드맵",
  "target_job": "프론트엔드 개발자",
  "status": "generating",
  "milestones": []
}
```
</details>

### Next.js Server Actions (BFF Layer)

| 파일 | 기능 |
|---|---|
| `actions/auth.ts` | 로그인, 로그아웃, OAuth 처리 |
| `actions/user.ts` | 사용자 프로필 CRUD, 온보딩 저장 |
| `actions/roadmap.ts` | 로드맵 생성 요청, 활성 로드맵 조회 |
| `actions/github.ts` | GitHub 토큰 저장, 레포 분석 |
| `actions/calendarActions.ts` | 캘린더 일정 CRUD |
| `actions/todoActions.ts` | To-do 항목 CRUD |
| `actions/attendanceActions.ts` | 출석 체크 |

---

## 🗄️ 데이터베이스 스키마

Supabase PostgreSQL + pgvector 기반 스키마입니다.

```mermaid
erDiagram
    users ||--o{ onboarding_surveys : has
    users ||--o{ roadmaps : creates
    users ||--o{ portfolio : owns
    users ||--o{ user_bookmarks : bookmarks
    users ||--o{ user_calendar : schedules
    users ||--o{ user_todos : manages
    users ||--o{ user_attendance : tracks
    users ||--o{ user_topic_progress : progresses
    users ||--o{ team_members : joins

    roadmaps ||--|{ milestones : contains
    milestones ||--|{ topics : includes
    topics ||--o{ user_topic_progress : tracked_by

    activities ||--o{ user_bookmarks : bookmarked_by
    crawling_data ||--o{ ai_processed_data : processed_into
    crawling_data ||--o{ team_posts : sourced_by
    team_posts ||--o{ team_members : has

    user_activities ||--o{ user_calendar : added_to

    users {
        uuid id PK
        varchar email UK
        varchar name
        text avatar_url
        boolean is_onboarded
        text github_token
        varchar github_username
        uuid current_roadmap_id
    }

    roadmaps {
        uuid id PK
        uuid user_id FK
        text title
        text target_job
        boolean is_active
        text status
        integer version
    }

    milestones {
        uuid id PK
        uuid roadmap_id FK
        text title
        integer order_index
        text description
    }

    topics {
        uuid id PK
        uuid milestone_id FK
        text title
        text content_md
        text[] required_skills
        integer order_index
    }

    activities {
        integer activity_id PK
        varchar title
        varchar category
        varchar status
        jsonb required_skills
        vector skill_embedding
        text source_url
    }

    crawling_data {
        bigint id PK
        text title
        text organization
        text description
        boolean is_processed
        text last_error
    }

    onboarding_surveys {
        uuid survey_id PK
        uuid user_id FK UK
        jsonb survey_data
        integer version
    }
```

### 주요 테이블 요약

| 테이블 | 역할 | 특징 |
|---|---|---|
| `users` | 사용자 프로필 | Supabase Auth UUID 기반 |
| `onboarding_surveys` | 온보딩 진단 (Point A/B) | JSONB 설문 데이터 |
| `roadmaps` | AI 생성 로드맵 | status: generating → completed/failed |
| `milestones` | 로드맵 마일스톤 | order_index 기반 순서 |
| `topics` | 학습 토픽 (하위 항목) | Markdown 콘텐츠 지원 |
| `user_topic_progress` | 토픽 진행 상태 | todo → in_progress → completed |
| `activities` | 벡터화된 대외활동 | 3072차원 `skill_embedding` |
| `crawling_data` | 원천 크롤링 데이터 | `is_processed` 처리 추적 |
| `ai_processed_data` | AI 정제 메타데이터 | domain/activity/benefit 태그 |
| `portfolio` | 사용자 포트폴리오 | JSONB 기반 기술/자격증/활동 |
| `user_bookmarks` | 활동 찜하기 | N:M 관계 매핑 |
| `user_calendar` | 개인 캘린더 | 활동-일정 연결 |
| `user_todos` | To-do 관리 | 완료 상태 추적 |
| `user_attendance` | 출석 체크 | 일일 출석 기록 |
| `team_posts` | 팀빌딩 모집글 | 크롤링 데이터 연계 |
| `team_members` | 팀원 신청/수락 | leader/member 역할 구분 |

---

## 🧪 개발 가이드

### 프론트엔드 개발

```bash
cd devstep-web

# 개발 서버
npm run dev

# 린트 검사
npm run lint

# 프로덕션 빌드
npm run build
```

**주요 컨벤션:**
- Server Component와 Client Component (`"use client"`)를 명확히 구분
- 상태 관리: Zustand (`/src/store/`)
- 데이터 요청: Server Actions (`/src/app/actions/`)
- UI 컴포넌트: shadcn/ui (`/src/components/ui/`)
- 디자인 테마: Glassmorphism + Point Blue 라이트 모드

### 백엔드 개발

```bash
cd devstep-ai

# 의존성 설치
uv sync

# 개발 서버 (Hot Reload)
uv run uvicorn main:app --reload --port 8000

# Celery Worker
uv run celery -A app.worker.celery_app worker --loglevel=info

# 테스트
uv run python test_roadmap_logic.py
uv run python test_roadmap_real_ai.py
```

**주요 컨벤션:**
- 계층 구조: `endpoints → services → models`
- 비동기 우선: `async/await` 전면 적용
- DB 세션: `async_session_factory` 기반 커넥션 풀
- AI 요청: 재시도 로직 (Tenacity) 적용
- 프롬프트: 외부 텍스트 파일 관리 (`/app/prompts/`)

### 데이터 정규화 워커

크롤링된 원천 데이터를 AI가 표준화하는 백그라운드 프로세스:

```bash
# Celery Worker 실행 후 태스크 트리거
uv run celery -A app.worker.celery_app worker --loglevel=info

# 단일 항목 테스트
uv run python scratch/test_normalization.py
```

### Git 워크플로

```bash
# 현재 브랜치
git branch          # → dev

# 커밋 및 푸시
git add .
git commit -m "feat: 기능 설명"
git push origin dev
```

---

## 📌 개발 현황

### ✅ 완료

- [x] 프론트엔드 프리미엄 UI 퍼블리싱 (Glassmorphism 라이트 모드)
- [x] SPA 탭 라우팅 대시보드 (`/dashboard?tab=...`)
- [x] 온보딩 진단 시스템 (Point A/B + GitHub 연동)
- [x] Supabase Auth 연동 (Google OAuth)
- [x] FastAPI 모듈형 아키텍처 리팩토링
- [x] AI 매칭 엔진 (기술 스택 정규화 + 벡터 매칭)
- [x] AI 로드맵 생성 (Celery 비동기 + Gemini Pro)
- [x] Docker Compose 전체 서비스 오케스트레이션
- [x] 캘린더 실시간 동기화 (커스텀 이벤트)
- [x] 토픽 학습 상태 관리 (LMS)

### 🔄 진행 중

- [ ] 팀업 보드 실제 데이터 연동
- [ ] 포트폴리오 입력/수정 페이지 구현
- [ ] 인턴십 가이드 페이지 구현

### 📋 향후 계획

- [ ] 크롤링 소스 다변화 (어댑터 패턴)
- [ ] 온보딩 변경 시 로드맵 자동 재연산 트리거
- [ ] 모바일 반응형 최적화
- [ ] CI/CD 파이프라인 구축
- [ ] 프로덕션 배포 (Vercel + Cloud Run)

---

## 📄 라이선스

이 프로젝트는 [MIT License](./LICENSE)에 따라 배포됩니다.

```
MIT License — Copyright (c) 2026 _.Cloudhigh
```

---

<p align="center">
  <sub>Built with ❤️ by <strong>DevStep Team</strong> — Powered by <strong>Google Gemini AI</strong></sub>
</p>
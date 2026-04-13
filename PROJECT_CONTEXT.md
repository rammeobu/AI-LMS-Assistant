# 🚀 DevStep AI Backend: Project Context & Handover

이 문서는 현재까지 완료된 **DevStep AI 백엔드 리팩토링 및 프론트엔드 연동** 작업의 핵심 내용을 요약합니다. 새로운 컨텍스트 윈도우에서 작업을 이어갈 때 이 파일을 참조하십시오.

---

## 🏗️ 1. 핵심 아키텍처 및 기술 스택
- **Frontend**: Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, Recharts, shadcn/ui, Zustand
- **Backend Framework**: FastAPI (Python 3.12+, 비동기 전용)
- **AI SDK**: Google GenAI Native SDK (Vertex AI 경유, Gemini 모델군 사용)
- **Database**: Supabase PostgreSQL (pgvector 기반 RAG 시스템) + 로컬 Docker PostgreSQL
- **비동기 워커**: Celery 5.3+ (Redis 브로커)
- **인증**: Supabase Auth (Google OAuth SSO)
- **Models**:
    - `gemini-3.1-flash-lite-preview`: 기술 스택 정규화 및 데이터 정제 (Fast Worker)
    - `gemini-embedding-001`: 3072차원 고정밀 임베딩 생성
    - `gemini-3.1-pro-preview`: 상세 로드맵 생성 및 최종 추천 (High Reasoning)

---

## 📊 2. 데이터베이스 스키마 상태 (Supabase Sync)
모든 유저 연동 테이블은 Supabase Auth의 유저 고유 ID인 `id (UUID)`를 기반으로 정렬되었습니다.

| 테이블명 | 주요 역할 | 특징 |
|---|---|---|
| `users` | 사용자 기본 프로필 | `github_username`, `current_roadmap_id` 포함 |
| `onboarding_surveys` | 온보딩 진단 데이터 (Point A/B) | JSONB 기반 고유 설문 데이터 저장 |
| `activities` | 벡터화된 대외활동 데이터 | 3072차원 벡터 컬럼(`skill_embedding`) 포함 |
| `crawling_data` | 원천 크롤링 데이터 | `is_processed`, `last_error` 컬럼 추가 완료 |
| `ai_processed_data` | AI 정제 메타데이터 | domain/activity/benefit/keyword 태그 |
| `roadmaps` | AI 생성 로드맵 | status: generating → completed/failed |
| `milestones` | 로드맵 마일스톤 | order_index 기반 순서 제어 |
| `topics` | 학습 토픽 (마일스톤 하위) | Markdown 콘텐츠, required_skills 포함 |
| `user_topic_progress` | 토픽 학습 진행 상태 | todo → in_progress → completed |
| `user_bookmarks` | 유저-활동 찜하기 관계 | N:M 관계 매핑 |
| `user_calendar` | 개인 캘린더 일정 | 활동-일정 연결 |
| `user_todos` | To-do 관리 | 완료 상태 추적 |
| `user_attendance` | 일일 출석 체크 | 일자별 기록 |
| `portfolio` | 사용자 포트폴리오 | JSONB 기반 기술/자격증/활동 |
| `team_posts` | 팀빌딩 모집글 | 크롤링 데이터 연계 |
| `team_members` | 팀원 신청/수락 | leader/member 역할 구분 |

---

## 🔗 3. 프론트엔드-백엔드 연동 상세

### Server Actions (BFF Layer — `devstep-web/src/app/actions/`)
| 파일 | 기능 | 연동 대상 |
|---|---|---|
| `auth.ts` | 로그인/로그아웃, OAuth 처리 | Supabase Auth |
| `user.ts` | 프로필 CRUD, 온보딩 저장 | Supabase DB |
| `roadmap.ts` | 로드맵 생성 요청, 활성 조회 | FastAPI `/api/v1/roadmaps/*` |
| `github.ts` | GitHub 토큰 저장, 레포 분석 | GitHub API (Octokit) |
| `calendarActions.ts` | 캘린더 일정 CRUD | Supabase DB |
| `todoActions.ts` | To-do CRUD | Supabase DB |
| `attendanceActions.ts` | 출석 체크 | Supabase DB |

### FastAPI 엔드포인트 (`devstep-ai/app/api/endpoints/`)
| 파일 | 경로 | 기능 |
|---|---|---|
| `health.py` | `GET /`, `GET /health` | 서비스 상태 확인 |
| `match.py` | `POST /api/v1/match/activities` | AI 기술 스택 기반 대외활동 매칭 |
| `match.py` | `POST /api/v1/match/bookmarks` | 활동 북마크 저장 |
| `roadmaps.py` | `POST /api/v1/roadmaps/generate` | AI 로드맵 생성 (비동기 202) |
| `roadmaps.py` | `GET /api/v1/roadmaps/active` | 활성 로드맵 트리 조회 |
| `roadmaps.py` | `PATCH /api/v1/roadmaps/topics/{id}/status` | 토픽 상태 업데이트 |

### UI 컴포넌트 바인딩
| 컴포넌트 | 데이터 소스 | 핵심 기능 |
|---|---|---|
| `DashboardOverview.tsx` | Supabase (users, portfolio) | 레이더 차트, 강약점, 달성률 |
| `RoadmapPathfinder.tsx` | FastAPI (roadmaps) | 동적 타임라인, AI 추천, 토픽 관리 |
| `DiscoveryFeed.tsx` | FastAPI (match) + Supabase | 대외활동 그리드, 북마크 |
| `CalendarSyncV2.tsx` | Supabase (user_calendar) | 월간 캘린더, 실시간 동기화 |
| `TeamUpBoard.tsx` | Supabase (team_posts) | 팀빌딩 매칭, 지원 모달 |

---

## 🛠️ 4. 로컬 환경 실행 및 테스트 방법

### Docker Compose (전체 서비스)
```bash
docker compose up --build
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000
# API Docs:  http://localhost:8000/docs
```

### 개별 실행
1. **DB + Redis**: `docker compose up -d db redis` (로컬 5432, 6379 포트)
2. **AI 서버**: `uv run uvicorn main:app --reload` (8000 포트)
3. **Celery Worker**: `celery -A app.worker.celery_app worker --loglevel=info`
4. **프론트엔드**: `cd devstep-web && npm run dev` (3000 포트)

### 테스트
- **정규화 테스트**: `uv run python scratch/test_normalization.py`
- **로드맵 로직**: `uv run python test_roadmap_logic.py`
- **실제 AI 테스트**: `uv run python test_roadmap_real_ai.py`

---

## 🚀 5. 현재 완료 현황

### 완료된 기능
- ✅ 프리미엄 UI 퍼블리싱 (Glassmorphism 라이트 모드)
- ✅ SPA 탭 라우팅 대시보드 구현
- ✅ 온보딩 진단 시스템 (Point A/B + GitHub 연동)
- ✅ Supabase Auth + Google OAuth 인증
- ✅ FastAPI 모듈형 아키텍처 리팩토링
- ✅ AI 매칭 엔진 (기술 스택 정규화 + 벡터 검색)
- ✅ AI 로드맵 생성 (Celery 비동기 + Gemini Pro)
- ✅ 캘린더 실시간 동기화 (커스텀 브라우저 이벤트)
- ✅ 토픽 학습 상태 관리 (LMS)
- ✅ Docker Compose 전체 오케스트레이션

### 향후 진행 과제 (Next Steps)
1. **팀업 보드 실제 데이터 연동**: team_posts/team_members 테이블 기반 실시간 데이터 바인딩
2. **포트폴리오 입력/수정 페이지**: 사용자가 포트폴리오를 직접 관리할 수 있는 CRUD 페이지
3. **인턴십 가이드 페이지**: 직무별 이력서 팁, 면접 체크리스트 등
4. **크롤링 소스 다변화**: 다양한 외부 플랫폼 통합 처리를 위한 어댑터 패턴
5. **온보딩 변경 트리거**: 설문 데이터 변경 시 로드맵 자동 재연산
6. **프로덕션 배포**: Vercel (Frontend) + Cloud Run (Backend) 배포 파이프라인

---
**Last Updated**: 2026-04-14 08:12

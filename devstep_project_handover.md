# 🚀 DevStep 프로젝트 인수인계 및 히스토리 문서 (Handover Document)

이 문서는 AI 기반 전공 맞춤형 커리어 로드맵 플랫폼인 **DevStep**의 현재 구현 상태, 개발 히스토리, 그리고 차후 진행해야 할 세부 계획을 완벽하게 보존하여, 다음 작업 시 언제든지 컨텍스트 낭비 없이 연속적인 개발을 이어가기 위해 작성되었습니다.

---

## 1. 프로젝트 개요 (Overview)
- **프로젝트명**: DevStep (AI Career Navigator)
- **주요 목적**: 파편화된 스펙 진단, 대외활동/자격증 추천, 팀 매칭을 개인의 데이터를 기반으로 객관화시켜 보여주는 올인원 플랫폼.
- **아키텍처 스펙**:
  - **Front-end**: Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, Recharts, shadcn/ui, Zustand
  - **Back-end (AI/Data)**: FastAPI, Python 3.12+ (Celery/RAG/웹 크롤링 담당 워커)
  - **AI Engine**: Google Gemini (Vertex AI SDK) — flash-lite, embedding-001, pro
  - **Database & Auth**: Supabase (PostgreSQL + pgvector + Auth)
  - **Infrastructure**: Docker Compose (5 services), Redis 7 (Celery broker)

---

## 2. 작업 완료 내역 히스토리

### ✅ Phase 1: 스캐폴딩 및 기획 병합
- `최종 기획안` 문서(`final_devstep_prd.md`) 확립.
- `d:\Documents\careermap` 워크스페이스 내 모노레포 형태의 디렉토리 분리.
  - `/devstep-web`: Next.js 기반 메인 클라이언트.
  - `/devstep-ai`: FastAPI 기반 마이크로 서비스 워커.
- `docker-compose.yml` 리소스 세팅 (5 서비스: web, api, worker, db, redis).

### ✅ Phase 2 & 2.5: 프리미엄 UI 퍼블리싱 (완료)
**사이버네틱 다크 모드**와 **오프화이트 라이트 모드** 중, 신뢰감을 주는 **라이트 모드 (Glassmorphism + Point Blue)** 테마로 확정되어 모든 컴포넌트가 퍼블리싱 되었습니다.

- **메인 탭 (SPA Routing)**: `/dashboard?tab=...` 구조를 통해 클릭 시 앱처럼 부드럽게 화면이 전환됩니다.
  - `My Dashboard`: 6각 레이더 차트, 강약점 분석 코멘트, 목표 달성률, 출석 체크, To-do 렌더링.
  - `Discovery Feed`: 그리드 형태의 공고 피드 (AI 매칭 + 크롤링 데이터 이중 소스).
  - `Team-up Board`: 팀빌딩 매칭 점수 뱃지 및 인라인 지원 모달 UI.
  - `Calendar Sync`: 월간/주간 캘린더 + 실시간 일정 동기화.

### ✅ Phase 2.7: 합격자 패스파인더 고도화 (완료)
가장 많은 로직 개편이 들어간 핵심 모듈입니다 (`RoadmapPathfinder.tsx`).
- **메가 메뉴 직무 검색창**: 상단 아코디언 드롭다운에서 `검색창`을 통해 대분류/소분류 내 원하는 직무를 플랫(Flat)하게 직관적으로 검색하고 변경할 수 있습니다.
- **동적 압축 뷰 (Current-focused Scale)**: 전체 타임라인 횡스크롤을 폐기하고, 과거/현재/미래 3개의 노드만 화면에 보입니다. 특히 **현재 마일스톤**이 1.5배 스케일 업(Scale-up)되어 강한 시선 집중을 유도합니다.
- **클릭 확장 애니메이션 (Expandable)**: 1.5배 커져 있는 중앙 노드를 클릭 시 원래 비율로 줄어들며 양옆으로 감춰진 전체 마일스톤이 동적으로 펼쳐집니다.
- **인라인 추천 피드 & 달성률**: 중앙 노드 하단 여백에 **목표 달성률 진행 바(Progress Bar)**가 삽입되어 있으며, 마감 임박 강의, 스터디, 자격증 등 인라인 피드 카드와 `[캘린더에 추가]` 버튼을 탑재했습니다.

### ✅ Phase 3: 온보딩 진단 시스템 (완료)
- **Point A 진단**: 현재 역량/경험/기술 스택 수집 위저드.
- **Point B 진단**: 목표 직무/도메인/리소스/정성적 목표 설정 위저드.
- **GitHub 연동**: Octokit 기반 레포지토리 분석 → 기술 스택 자동 추출.
- 단계별 검증 로직 및 중복 API 호출 방지.

### ✅ Phase 4: Supabase 연동 (완료)
- Supabase Auth (Google OAuth) 기반 인증 전체 플로우.
- Server Actions를 통한 DB CRUD (프로필, 온보딩, 캘린더, 출석, To-do).
- 미들웨어 기반 세션 관리 (경로 보호).

### ✅ Phase 5: FastAPI AI 엔드포인트 고도화 (완료)
- 모듈형 아키텍처 리팩토링 (`endpoints → services → models`).
- AI 매칭 엔진: 온보딩 데이터 → 기술 스택 정규화 → 벡터 임베딩 → 코사인 유사도 매칭.
- AI 로드맵 생성: Celery 비동기 처리 → Gemini Pro 기반 마일스톤/토픽 생성.
- JWT 인증 흐름 (Supabase → FastAPI IDOR 방지).
- 커넥션 풀 최적화 (`async_session_factory` 기반).
- 재시도 로직 (Tenacity) 적용.

### ✅ Phase 6: Docker Compose 컨테이너화 (완료)
- 5 서비스 오케스트레이션 (web, api, worker, db, redis).
- 멀티스테이지 빌드 (uv 기반 Python, Node.js slim).
- 볼륨 마운트 기반 핫 리로드 개발 환경.
- 헬스체크 및 서비스 의존성 관리.

---

## 3. 남은 작업 (Next Steps)

### 📍 Step 1. 팀업 보드 실제 데이터 연동
- `team_posts`, `team_members` 테이블 기반 실시간 데이터 바인딩.
- 팀원 매칭 점수 알고리즘 구현.

### 📍 Step 2. 포트폴리오 입력/수정 페이지
- `portfolio` 테이블 기반 CRUD 페이지.
- 기술 스택, 자격증, 활동 이력 관리 UI.

### 📍 Step 3. 인턴십 가이드 페이지
- 직무별 이력서/자소서 팁.
- 면접 체크리스트 및 필요 기술 스택 안내.

### 📍 Step 4. 운영 고도화
- 크롤링 소스 다변화 (어댑터 패턴).
- 온보딩 변경 시 로드맵 자동 재연산 트리거.
- CI/CD 파이프라인 (GitHub Actions).
- 프로덕션 배포 (Vercel + Cloud Run).

---

## 4. Git 저장소 정보
- **Remote Repository**: `https://github.com/rammeobu/AI-LMS-Assistant.git`
- **Current Branch**: `dev`
- **커밋 시점**: Phase 6 (Docker 컨테이너화) 완료 시점. AI 로드맵 생성, 캘린더 실시간 동기화 등 핵심 기능 모두 포함.

---

**Last Updated**: 2026-04-14 08:12

이 문서는 저장소의 워크스페이스 Root에 저장되며, 다음 세션을 시작할 때 이 문서를 참조하여(Context 100% 복원) 컨티뉴하시면 됩니다. 🚀

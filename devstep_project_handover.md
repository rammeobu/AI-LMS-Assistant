# 🚀 DevStep 프로젝트 인수인계 및 히스토리 문서 (Handover Document)

이 문서는 AI 기반 전공 맞춤형 커리어 로드맵 플랫폼인 **DevStep**의 현재 구현 상태, 개발 히스토리, 그리고 차후 진행해야 할 세부 계획(Phase 3)을 완벽하게 보존하여, 다음 작업 시 언제든지 컨텍스트 낭비 없이 연속적인 개발을 이어가기 위해 작성되었습니다.

---

## 1. 프로젝트 개요 (Overview)
- **프로젝트명**: DevStep (AI Career Navigator)
- **주요 목적**: 파편화된 스펙 진단, 대외활동/자격증 추천, 팀 매칭을 개인의 데이터를 기반으로 객관화시켜 보여주는 올인원 플랫폼.
- **아키텍처 스펙**:
  - **Front-end**: Next.js 14 (App Router), Tailwind CSS v4, Framer Motion, Recharts
  - **Back-end (AI/Data)**: FastAPI, Python (셀러리/RAG/웹 크롤링 담당 워커)
  - **Database & Auth**: Supabase (PostgreSQL + pgvector)

---

## 2. 작업 완료 내역 히스토리

### ✅ Phase 1: 스캐폴딩 및 기획 병합
- `최종 기획안` 문서(`final_devstep_prd.md`) 확립.
- `d:\Documents\careermap` 워크스페이스 내 모노레포 형태의 디렉토리 분리.
  - `/devstep-web`: Next.js 기반 메인 클라이언트.
  - `/devstep-ai`: FastAPI 기반 마이크로 서비스 워커.
- `docker-compose.yml` 리소스 세팅 예약.

### ✅ Phase 2 & 2.5: 프리미엄 UI 퍼블리싱 (완료)
**사이버네틱 다크 모드**와 **오프화이트 라이트 모드** 중, 신뢰감을 주는 **라이트 모드 (Glassmorphism + Point Blue)** 테마로 확정되어 모든 컴포넌트가 퍼블리싱 되었습니다. 모의(Mock) 데이터를 사용하여 시각화를 완성했습니다.

- **메인 탭 (SPA Routing)**: `/dashboard?tab=...` 구조를 통해 클릭 시 앱처럼 부드럽게 화면이 전환됩니다.
  - `My Dashboard`: 6각 레이더 차트, 강약점 분석 코멘트, 목표 달성률 렌더링.
  - `Discovery Feed`: 그리드 형태의 공고 피드.
  - `Team-up Board`: 팀빌딩 매칭 점수 뱃지 및 인라인 지원 모달 UI.
  - `Calendar Sync`: 학사 일정과 남은 여력(AIx)을 종합한 캘린더 보드.

### ✅ Phase 2.7: 합격자 패스파인더 고도화 (완료)
가장 많은 로직 개편이 들어간 핵심 모듈입니다 (`RoadmapPathfinder.tsx`).
- **메가 메뉴 직무 검색창**: 상단 아코디언 드롭다운에서 `검색창`을 통해 대분류/소분류 내 원하는 직무를 플랫(Flat)하게 직관적으로 검색하고 변경할 수 있습니다.
- **동적 압축 뷰 (Current-focused Scale)**: 전체 타임라인 횡스크롤을 폐기하고, 과거/현재/미래 3개의 노드만 화면에 보입니다. 특히 **현재 마일스톤**이 1.5배 스케일 업(Scale-up)되어 강한 시선 집중을 유도합니다.
- **클릭 확장 애니메이션 (Expandable)**: 1.5배 커져 있는 중앙 노드를 클릭 시 원래 비율로 줄어들며 양옆으로 감춰진 전체 마일스톤이 동적으로 펼쳐집니다.
- **인라인 추천 피드 & 달성률**: 중앙 노드 하단 여백에 **목표 달성률 65% 진행 바(Progress Bar)**가 삽입되어 있으며, 마감 임박 강의, 스터디, 자격증 등 4가지 인라인 피드 카드와 `[캘린더에 추가]` 버튼을 탑재했습니다.

---

## 3. 남은 작업 (Next Steps / Phase 3)

본 문서 이후 세션이 재개되면 다음 작업부터 이어서 수행해야 합니다.

### 📍 Step 1. Supabase 연동 (Next.js Database)
1. Next.js (`devstep-web`) 프로젝트에 `@supabase/supabase-js` 브랜치 연동.
2. `src/utils/supabase/client.ts` 클라이언트 유틸리티 파일 생성.
3. 로컬의 `.env.local` 에 고객님의 `NEXT_PUBLIC_SUPABASE_URL`, `ANON_KEY`를 삽입하여 Next.js 서버액션 단에서 DB Read/Write 테스트(예: User 프로필 불러오기).

### 📍 Step 2. FastAPI AI 엔드포인트 구축
1. Python/FastAPI (`devstep-ai`) 폴더에 진입하여 가상환경(venv) 액티베이트.
2. LangChain 기반의 RAG 로직 뼈대를 세우고 `POST /api/v1/analyze` 라우팅 개설.
3. OpenAI API 키를 세팅하고, 하드코딩된 패스파인더 추천 데이터 대신 LLM이 생성한 JSON 데이터를 리턴하도록 설계.

### 📍 Step 3. 프론트엔드 - 백엔드 결합
1. 하드코딩된 React State(`const roadmapSteps = [...]`)를 제거하고, Next.js 단에서 FastAPI나 Supabase 로부터 Fetch 해온 리얼 데이터로 마이그레이션.

---

## 4. Git 저장소 정보
- **Remote Repository**: `https://github.com/rammeobu/AI-LMS-Assistant.git`
- **Current Branch**: `dev`
- **커밋 시점**: UI 퍼블리싱 Phase 2.7 일체가 완료된 완벽한 시점.

이 문서는 저장소의 워크스페이스 Root에 저장되며, 다음 세션을 시작할 때 이 문서를 참조하여(Context 100% 복원) 컨티뉴하시면 됩니다. 🚀

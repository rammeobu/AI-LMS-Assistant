# 🚀 DevStep AI Backend: Project Context & Handover

이 문서는 현재까지 완료된 **DevStep AI 백엔드 리팩토링 및 프론트엔드 연동** 작업의 핵심 내용을 요약합니다. 새로운 컨텍스트 윈도우에서 작업을 이어갈 때 이 파일을 참조하십시오.

---

## 🏗️ 1. 핵심 아키텍처 및 기술 스택
- **Backend Framework**: FastAPI (Python)
- **AI SDK**: Google GenAI Native SDK (Gemini 2.0 모델군 사용)
- **Database**: Supabase PostgreSQL (pgvector 기반 RAG 시스템)
- **Models**:
    - `gemini-3.1-flash-lite-preview`: 기술 스택 정규화 및 데이터 정제 (Fast Worker)
    - `gemini-embedding-001`: 3072차원 고정밀 임베딩 생성
    - `gemini-3.1-pro-preview`: 상세 로드맵 생성 및 최종 추천 (High Reasoning)

---

## 📊 2. 데이터베이스 스키마 상태 (Supabase Sync)
모든 유저 연동 테이블은 Supabase Auth의 유저 고유 ID인 `id (UUID)`를 기반으로 정렬되었습니다.

| 테이블명 | 주요 역할 | 특징 |
|---|---|---|
| `users` | 사용자 기본 프로필 | `availability_index` 삭제 완료 |
| `onboarding_surveys` | 온보딩 진단 데이터 (Point A/B) | JSONB 기반 고유 설문 데이터 저장 |
| `activities` | 벡터화된 대외활동 데이터 | 3072차원 벡터 컬럼(`skill_embedding`) 포함 |
| `crawling_data` | 원천 크롤링 데이터 | `is_processed`, `last_error` 컬럼 추가 완료 |
| `user_bookmarks` | 유저-활동 찜하기 관계 | N:M 관계 매핑 |

---

## 🔗 3. 프론트엔드 연동 (Next.js Server Actions)
- **위치**: `devstep-web/src/app/actions/match.ts`
- **기능**: 유저 ID와 목표 직무를 백엔드의 `/api/v1/match/activities`로 전달하여 추천 리스트 확보.
- **UI 바인딩**: `RoadmapPathfinder.tsx` 컴포넌트에서 실시간 AI 추천 결과 렌더링.

---

## 🛠️ 4. 로컬 환경 실행 및 테스트 방법
1. **DB 가동**: `docker compose up -d db` (로컬 5432 포트 사용)
2. **AI 서버 실행**: `uv run uvicorn main:app --reload` (8000 포트)
3. **데이터 정규화 워커 실행**: `celery -A app.worker.celery_app worker --loglevel=info` 실행 후 `sync_crawled_data` 태스크 트리거.
4. **테스트 스크립트**: `uv run python scratch/test_normalization.py`를 통해 단일 항목 정규화 테스트 가능.

---

## 🚀 5. 향후 진행 과제 (Next Steps)
1. **로드맵 상세 마일스톤 생성**: `gemini-3.1-pro-preview`를 활용하여 장기적인 커리어 패스웨이 생성 기능을 RAG 모듈로 확장.
2. **사용자 경험 고도화**: `onboarding_surveys`의 변경 사항이 발생할 때마다 실시간으로 로드맵을 재연산하는 트리거 로직 추가.
3. **크롤링 소스 다변화**: 다양한 외부 플랫폼에서 수집된 데이터를 통합 처리하는 어댑터 패턴 적용.

---
**Last Updated**: 2026-04-12 01:00

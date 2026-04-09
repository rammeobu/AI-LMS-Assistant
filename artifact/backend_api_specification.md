# 🛠️ DevStep 백엔드 API 명세 및 연동 가이드 문서 (Full Backend Spec)

이 문서는 DevStep 플랫폼의 프론트엔드 UI/UX 작업 중 **현재 하드코딩(Mock)되어 있는 데이터를 실제 데이터베이스(Supabase)와 연동하기 위한 "완전 통합" 가이드**입니다. 다음 세션의 개발자가 즉시 사용할 수 있도록 읽기/조회(GET) 뿐만 아니라 쓰기/수정(POST/PUT) 액션까지 모두 포함하여 작성되었습니다.

---

## 1. 🔐 인증 (Authentication)
프론트엔드의 `AuthForm.tsx` 컴포넌트가 담당하며, 자체 커스텀 API를 구축하는 대신 **Supabase Auth SDK**를 직접 연동하는 방식을 권장합니다.

*   **연동 타겟 컴포넌트**: `src/components/auth/AuthForm.tsx`
*   **필요 백엔드 액션**:
    *   Supabase OAuth Provider (Kakao, Github, Google) 설정 활성화.
    *   `supabase.auth.signInWithOAuth({ provider: 'kakao' })` 호출 로직 변경.
    *   인증 완료 후 UUID 획득 및 Users 테이블 레코드 자동 생성(Trigger 활용 권장).

---

## 2. 📊 사용자 역량 대시보드 (Dashboard & Radar)
메인 대시보드와 진단 차트 형성을 위해 필요한 유저 스탯 데이터입니다.

### `GET /api/v1/users/me/profile`
*   **연동 컴포넌트**: `DashboardOverview.tsx`, `RadarChart.tsx`
*   **응답 JSON 구조 예시**:
    ```json
    {
      "user_id": "uuid",
      "level": "Junior",
      "streak_days": 12,
      "competency_scores": {
        "backend": 85,
        "frontend": 40,
        "ai": 20,
        "cs_fundamentals": 75,
        "collaboration": 90
      },
      "ai_feedback": "데이터베이스 경험은 풍부하나, 백엔드 프레임워크 실무 경험이 부족합니다."
    }
    ```

---

## 3. 🗺️ 직무 최적화 로드맵 (Roadmap Pathfinder)
AI가 동적으로 제안한 로드맵과 사용자의 학습 상태를 동기화합니다.

### `GET /api/v1/roadmaps/me` (조회)
*   **연동 컴포넌트**: `RoadmapPathfinder.tsx`
*   **응답 JSON**:
    ```json
    {
      "milestones": [
        {
          "milestone_id": "m_1",
          "title": "실무형 데이터베이스 아키텍처",
          "status": "current",
          "progress_percent": 65,
          "subTasks": [
             { "task_id": "t_202", "title": "N+1 문제 재현 및 Fetch Join 해결", "status": "current" },
             { "task_id": "t_203", "title": "대용량 트래픽 쿼리 최적화 포스팅", "status": "pending" }
          ]
        }
      ]
    }
    ```

### 🔴 `PUT /api/v1/roadmaps/tasks/{task_id}/status` (상태 변경)
사용자가 로드맵에서 특정 세부 태스크의 체크박스를 클릭하여 완료 처리할 때 호출됩니다.
*   **요청(Request) Body**:
    ```json
    {
      "status": "completed"  // "pending" | "current" | "completed"
    }
    ```
*   **요구 동작**: DB 업데이트 후, 상위 `milestone`의 `progress_percent` 백분율을 재계산하여 업데이트해야 합니다.

---

## 4. ✨ 추천 활동 피드 및 팀 매칭 (Discovery Feed)
사용자 핏에 맞는 활동을 보여주고, 팀원을 구하거나 지원하는 API입니다.

### `GET /api/v1/activities/recommendations` (피드 조회)
*   **연동 컴포넌트**: `DiscoveryFeed.tsx`
*   **응답 JSON**:
    ```json
    [
      {
        "activity_id": "act_8831",
        "title": "네이버 웨일 해커톤 2026",
        "category": "해커톤/공모전",
        "status": "모집중"
      }
    ]
    ```

### `GET /api/v1/activities/{activity_id}/teams` (팀 목록 조회)
*   **연동 컴포넌트**: `ActivityDetailDrawer.tsx`
*   **응답 JSON**:
    ```json
    [
      {
        "team_id": "team_11",
        "title": "네이버 지도 API 활용 팀원 구합니다",
        "capacity": { "current": 1, "max": 4 }
      }
    ]
    ```

### 🔴 `POST /api/v1/activities/{activity_id}/teams` (새 팀 모집글 작성)
*   **요청(Request) Body**:
    ```json
    {
      "title": "프론트엔드/백엔드 각 1명 모십니다",
      "required_stacks": ["React", "Spring Boot"],
      "max_capacity": 4,
      "description": "열정적인 분 환영합니다!"
    }
    ```

### 🔴 `POST /api/v1/teams/{team_id}/applications` (팀 지원 액션)
*   사용자가 특정 모집글에 "지원하기" 버튼을 클릭했을 때 호출됩니다.
*   **요청(Request) Body**: 없음 (인증 토큰 기반). 본인 프로필이 팀장에게 전송됩니다.

---

## 5. 🗓️ 스마트 어젠다 캘린더 (Calendar Sync)
학사 일정 및 개발 일정을 동기화 관리합니다.

### `GET /api/v1/calendar/events` (월간 코어 스케줄 조회)
*   **연동 컴포넌트**: `CalendarSync.tsx`
*   **응답 JSON**:
    ```json
    {
      "ai_insight": {
        "has_conflict": true,
        "conflict_date": "2026-04-21",
        "warning_message": "학교 중간고사와 카카오 코딩테스트가 겹쳐있습니다."
      },
      "events": [
        { "event_id": "ev_1", "date": 21, "type": "academic", "title": "데이터베이스 중간고사" }
      ]
    }
    ```

### 🔴 `POST /api/v1/calendar/events` (신규 일정 생성)
*   우측 타임라인에서 "일정 추가" 액션을 할 때 호출됩니다.
*   **요청(Request) Body**:
    ```json
    {
      "title": "개인 알고리즘 스터디",
      "target_date": "2026-04-28",
      "time": "20:00",
      "type": "roadmap",
      "tag": "학습목표"
    }
    ```

---

## 💡 개발 구현 가이드 (Implementation Steps)
1. **Supabase Tables & RLS 설정**: `users`, `roadmaps`, `tasks`, `activities`, `teams`, `events` 주요 테이블 설계.
2. **Data Fetching Hook**: 프론트엔드의 `RoadmapPathfinder.tsx` 등의 컴포넌트에 `SWR` 이나 `React Query`를 결합하여 작성된 API 인터페이스와 연동.
3. **Optimistic UI (낙관적 렌더링)**: 팀 매칭 지원, 로드맵 체크박스 클릭 등 **POST/PUT 요청의 경우 클릭 즉시 UI 상태를 변경(Mock)** 한 후, 백그라운드에서 API 응답을 동기화하여 UX 체감 속도를 높일 것을 강력히 권장합니다.

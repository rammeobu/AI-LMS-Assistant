-- ============================================
-- DevStep Database Initialization Script
-- PostgreSQL 16 + pgvector
-- ============================================
-- PRD ERD 기반 전체 테이블 정의
-- References:
--   - artifact/final_devstep_prd.md (Section 6. ERD)
--   - artifact/devstep_prd.md (Section 4. ERD)
--   - artifact/backend_api_specification.md (API 연동 스키마)
-- ============================================

-- Enable pgvector extension for semantic search / RAG
CREATE EXTENSION IF NOT EXISTS "vector";
-- Enable uuid-ossp for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────
-- 1. USERS — 사용자 계정
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
    user_id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE,
    name            VARCHAR(100),
    github_username VARCHAR(100),
    github_token    TEXT,
    university      VARCHAR(100),
    major           VARCHAR(100),
    target_job      VARCHAR(100),
    level           VARCHAR(20) DEFAULT 'Junior',          -- Junior / Middle / Senior
    streak_days     INTEGER DEFAULT 0,
    availability_index FLOAT DEFAULT 0.0,                  -- 활동 가능 지수 (AIx)
    competency_scores JSONB DEFAULT '{
        "backend": 0,
        "frontend": 0,
        "ai": 0,
        "cs_fundamentals": 0,
        "collaboration": 0,
        "open_source": 0
    }'::jsonb,
    ai_feedback     TEXT,
    avatar_url      TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 2. PORTFOLIO — 사용자 포트폴리오 (1:1)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS portfolio (
    portfolio_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    tech_stacks     JSONB DEFAULT '[]'::jsonb,              -- ["React", "Spring Boot", ...]
    certifications  JSONB DEFAULT '[]'::jsonb,              -- [{"name": "정보처리기사", "date": "2026-01"}]
    activities      JSONB DEFAULT '[]'::jsonb,              -- 대외활동 이력
    github_stats    JSONB DEFAULT '{}'::jsonb,              -- 커밋, 언어비율 등
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT fk_portfolio_user UNIQUE (user_id)
);

-- ──────────────────────────────────────────────
-- 3. ANALYSIS_RESULT — AI 역량 분석 결과
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analysis_results (
    analysis_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    radar_chart_data JSONB NOT NULL DEFAULT '{}'::jsonb,    -- 6각 레이더 차트 수치
    strengths       TEXT,
    weaknesses      TEXT,
    ai_roadmaps     JSONB DEFAULT '[]'::jsonb,             -- AI 생성 로드맵 JSON
    embedding       vector(1536),                           -- OpenAI text-embedding 벡터 (RAG용)
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analysis_user ON analysis_results(user_id);
CREATE INDEX IF NOT EXISTS idx_analysis_embedding ON analysis_results USING ivfflat (embedding vector_cosine_ops);

-- ──────────────────────────────────────────────
-- 4. ROADMAPS — 사용자 맞춤 로드맵
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS roadmaps (
    roadmap_id      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    target_job      VARCHAR(100),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_roadmap_user ON roadmaps(user_id);

-- ──────────────────────────────────────────────
-- 5. MILESTONES — 로드맵 내 마일스톤
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS milestones (
    milestone_id    VARCHAR(20) PRIMARY KEY,                -- e.g. "m_1"
    roadmap_id      UUID NOT NULL REFERENCES roadmaps(roadmap_id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    status          VARCHAR(20) DEFAULT 'pending',          -- pending | current | completed
    progress_percent INTEGER DEFAULT 0 CHECK (progress_percent BETWEEN 0 AND 100),
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_milestone_roadmap ON milestones(roadmap_id);

-- ──────────────────────────────────────────────
-- 6. TASKS — 마일스톤 내 세부 태스크
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
    task_id         VARCHAR(20) PRIMARY KEY,                -- e.g. "t_202"
    milestone_id    VARCHAR(20) NOT NULL REFERENCES milestones(milestone_id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    status          VARCHAR(20) DEFAULT 'pending',          -- pending | current | completed
    reason          TEXT,                                    -- AI가 제시하는 학습 이유
    sort_order      INTEGER DEFAULT 0,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_task_milestone ON tasks(milestone_id);

-- ──────────────────────────────────────────────
-- 7. ACTIVITIES — 외부 대외활동/공모전/인턴십
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS activities (
    activity_id     SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    category        VARCHAR(50),                            -- 해커톤/공모전, 인턴십, 스터디 등
    source_type     VARCHAR(50),                            -- 학교공지, 링커리어, 프로그래머스 등
    status          VARCHAR(20) DEFAULT '모집중',            -- 모집중, 마감임박, 마감
    deadline        TIMESTAMPTZ,
    required_skills JSONB DEFAULT '[]'::jsonb,              -- ["React", "Spring Boot"]
    skill_embedding vector(1536),                           -- 요구 역량 벡터 (코사인 유사도용)
    source_url      TEXT,
    thumbnail_url   TEXT,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_deadline ON activities(deadline);
CREATE INDEX IF NOT EXISTS idx_activity_skill_embed ON activities USING ivfflat (skill_embedding vector_cosine_ops);

-- ──────────────────────────────────────────────
-- 8. USER_BOOKMARKS — 사용자 찜 (N:M)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_bookmarks (
    user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    activity_id     INTEGER NOT NULL REFERENCES activities(activity_id) ON DELETE CASCADE,
    bookmarked_at   TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, activity_id)
);

-- ──────────────────────────────────────────────
-- 9. TEAMS — 팀 모집글 (활동 내 팀 빌딩)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
    team_id         SERIAL PRIMARY KEY,
    activity_id     INTEGER NOT NULL REFERENCES activities(activity_id) ON DELETE CASCADE,
    leader_id       UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    required_stacks JSONB DEFAULT '[]'::jsonb,              -- ["React", "Spring Boot"]
    capacity_current INTEGER DEFAULT 1,
    capacity_max    INTEGER DEFAULT 4,
    status          VARCHAR(20) DEFAULT 'OPEN',             -- OPEN | CLOSED
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_team_activity ON teams(activity_id);
CREATE INDEX IF NOT EXISTS idx_team_leader ON teams(leader_id);

-- ──────────────────────────────────────────────
-- 10. TEAM_APPLICATIONS — 팀 지원서
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_applications (
    application_id  SERIAL PRIMARY KEY,
    team_id         INTEGER NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    ai_report_snapshot JSONB,                               -- 지원 시점 AI 분석 스냅샷 (immutable)
    match_score     FLOAT,                                  -- AI 매칭률 (%)
    status          VARCHAR(20) DEFAULT 'PENDING',          -- PENDING | ACCEPTED | REJECTED
    applied_at      TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_team_user UNIQUE (team_id, user_id)       -- 중복 지원 방지
);

CREATE INDEX IF NOT EXISTS idx_app_team ON team_applications(team_id);
CREATE INDEX IF NOT EXISTS idx_app_user ON team_applications(user_id);

-- ──────────────────────────────────────────────
-- 11. EVENTS — 캘린더 일정
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
    event_id        SERIAL PRIMARY KEY,
    user_id         UUID REFERENCES users(user_id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    target_date     DATE NOT NULL,
    time            TIME,
    type            VARCHAR(20) NOT NULL,                   -- academic | roadmap | activity | personal
    tag             VARCHAR(50),                            -- 학습목표, 시험, 마감 등
    is_global       BOOLEAN DEFAULT FALSE,                  -- 학사일정 등 전체 공유 이벤트
    source          VARCHAR(50),                            -- manual | crawled | synced
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_event_user_date ON events(user_id, target_date);
CREATE INDEX IF NOT EXISTS idx_event_global ON events(is_global) WHERE is_global = TRUE;

-- ──────────────────────────────────────────────
-- 12.合격자 프로필 (RAG 지식 베이스)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS accepted_profiles (
    profile_id      SERIAL PRIMARY KEY,
    company         VARCHAR(100),
    job_role        VARCHAR(100),
    resume_keywords JSONB DEFAULT '[]'::jsonb,
    tech_stacks     JSONB DEFAULT '[]'::jsonb,
    description     TEXT,
    embedding       vector(1536),                           -- 합격자 프로필 벡터 (RAG 검색)
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_accepted_embedding ON accepted_profiles USING ivfflat (embedding vector_cosine_ops);

-- ============================================
-- 초기 시드 데이터 (테스트용)
-- ============================================

-- 테스트 유저
INSERT INTO users (user_id, email, name, github_username, university, major, target_job, level, streak_days, competency_scores, ai_feedback)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'test@devstep.kr',
    '홍길동',
    'hong-gildong',
    '한국대학교',
    '컴퓨터공학과',
    '백엔드 개발자',
    'Junior',
    12,
    '{"backend": 85, "frontend": 40, "ai": 20, "cs_fundamentals": 75, "collaboration": 90, "open_source": 30}'::jsonb,
    '데이터베이스 경험은 풍부하나, 백엔드 프레임워크 실무 경험이 부족합니다.'
) ON CONFLICT (user_id) DO NOTHING;

-- 테스트 로드맵
INSERT INTO roadmaps (roadmap_id, user_id, target_job)
VALUES (
    'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22',
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '백엔드 개발자'
) ON CONFLICT (roadmap_id) DO NOTHING;

-- 테스트 마일스톤
INSERT INTO milestones (milestone_id, roadmap_id, title, status, progress_percent, sort_order) VALUES
    ('m_1', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '실무형 데이터베이스 아키텍처', 'current', 65, 1),
    ('m_2', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Spring Boot 실전 프로젝트', 'pending', 0, 2),
    ('m_3', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', '코딩테스트 집중 훈련', 'pending', 0, 3)
ON CONFLICT (milestone_id) DO NOTHING;

-- 테스트 태스크
INSERT INTO tasks (task_id, milestone_id, title, status, reason, sort_order) VALUES
    ('t_201', 'm_1', '인덱스 전략 수립 및 Explain Analyze 실습', 'completed', '합격자 80%가 인덱스 최적화 경험 보유', 1),
    ('t_202', 'm_1', 'N+1 문제 재현 및 Fetch Join 해결', 'current', 'JPA 면접 단골 질문, 실무 필수', 2),
    ('t_203', 'm_1', '대용량 트래픽 쿼리 최적화 포스팅', 'pending', '기술 블로그 작성으로 이해도 증명', 3)
ON CONFLICT (task_id) DO NOTHING;

-- 테스트 활동
INSERT INTO activities (title, category, status, deadline, required_skills, source_url) VALUES
    ('네이버 웨일 해커톤 2026', '해커톤/공모전', '모집중', '2026-05-15', '["React", "Node.js", "AI"]'::jsonb, 'https://example.com/whale'),
    ('카카오 인턴십 2026 상반기', '인턴십', '모집중', '2026-05-01', '["Java", "Spring Boot", "MySQL"]'::jsonb, 'https://example.com/kakao'),
    ('오픈소스 컨트리뷰션 아카데미', '대외활동', '모집중', '2026-06-01', '["Git", "Linux", "Python"]'::jsonb, 'https://example.com/oss'),
    ('프로그래머스 AI 데브코스', '교육', '모집중', '2026-04-30', '["Python", "PyTorch", "LangChain"]'::jsonb, 'https://example.com/devcos')
ON CONFLICT DO NOTHING;

-- 테스트 캘린더 이벤트
INSERT INTO events (user_id, title, target_date, time, type, tag, is_global) VALUES
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '데이터베이스 중간고사', '2026-04-21', '09:00', 'academic', '시험', FALSE),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '카카오 코딩테스트', '2026-04-21', '14:00', 'activity', '마감', FALSE),
    ('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Spring Security 학습', '2026-04-25', '20:00', 'roadmap', '학습목표', FALSE),
    (NULL, '2026 1학기 중간고사 기간', '2026-04-21', NULL, 'academic', '시험기간', TRUE),
    (NULL, '2026 1학기 중간고사 기간', '2026-04-22', NULL, 'academic', '시험기간', TRUE),
    (NULL, '2026 1학기 중간고사 기간', '2026-04-23', NULL, 'academic', '시험기간', TRUE)
ON CONFLICT DO NOTHING;

-- ============================================
-- Done! 🚀 All tables and seed data created.
-- ============================================

-- ============================================
-- DevStep Database Initialization Script (Unified Sync)
-- PostgreSQL 16 + pgvector
-- ============================================
-- Supabase(Web) 최적화 스키마를 기반으로 AI 기능 테이블들을 통합함
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ──────────────────────────────────────────────
-- 1. USERS — 사용자 계정 (Supabase Auth Sync)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    name            VARCHAR(100),
    avatar_url      TEXT,
    is_onboarded    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 2. ONBOARDING_SURVEYS — 상세 진단 데이터 (Point A & B)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.onboarding_surveys (
    survey_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    survey_data     JSONB NOT NULL DEFAULT '{}'::jsonb,
    version         INTEGER DEFAULT 1,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_survey UNIQUE (user_id)
);

-- ──────────────────────────────────────────────
-- 3. PORTFOLIO — 사용자 포트폴리오
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.portfolio (
    portfolio_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    tech_stacks     JSONB DEFAULT '[]'::jsonb,
    certifications  JSONB DEFAULT '[]'::jsonb,
    activities      JSONB DEFAULT '[]'::jsonb,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_portfolio_user UNIQUE (user_id)
);

-- ──────────────────────────────────────────────
-- 4. ACTIVITIES — 대외활동 데이터 (AI 전용)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.activities (
    activity_id     SERIAL PRIMARY KEY,
    title           VARCHAR(255) NOT NULL,
    category        VARCHAR(50),
    source_type     VARCHAR(50),
    status          VARCHAR(20) DEFAULT '모집중',
    deadline        TIMESTAMPTZ,
    required_skills JSONB DEFAULT '[]'::jsonb,
    skill_embedding halfvec(3072),                          -- Google Gemini-Embedding (3072 dim, halfvec for indexing)
    source_url      TEXT,
    thumbnail_url   TEXT,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 5. USER_BOOKMARKS — 찜하기
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_bookmarks (
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    activity_id     INTEGER NOT NULL REFERENCES public.activities(activity_id) ON DELETE CASCADE,
    bookmarked_at   TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (user_id, activity_id)
);

-- ──────────────────────────────────────────────
-- 6. ANALYSIS_RESULTS — AI 분석 레포트
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.analysis_results (
    analysis_id     UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    radar_chart_data JSONB NOT NULL DEFAULT '{}'::jsonb,
    strengths       TEXT,
    weaknesses      TEXT,
    ai_roadmaps     JSONB DEFAULT '[]'::jsonb,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 7. CRAWLING_DATA — 원천 데이터 (Supabase Sync)
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.crawling_data (
    id              SERIAL PRIMARY KEY,
    collected_at    TIMESTAMPTZ,
    organization    VARCHAR(255),
    title           VARCHAR(255),
    subject         VARCHAR(255),
    start_date      VARCHAR(20),
    end_date        VARCHAR(20),
    target          VARCHAR(100),
    homepage        TEXT,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    is_processed    BOOLEAN DEFAULT FALSE,
    last_error      TEXT
);

-- ──────────────────────────────────────────────
-- 8. AI_PROCESSED_DATA — AI 분석 태그 데이터
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.ai_processed_data (
    idx             SERIAL PRIMARY KEY,
    crawling_id     INTEGER NOT NULL REFERENCES public.crawling_data(id) ON DELETE CASCADE,
    domain_tags     TEXT,
    activity_types  TEXT,
    benefit_tags    TEXT,
    all_keywords    TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스 및 기타 설정
CREATE INDEX IF NOT EXISTS idx_onboarding_json ON public.onboarding_surveys USING GIN (survey_data);
CREATE INDEX IF NOT EXISTS idx_activity_embed ON public.activities USING hnsw (skill_embedding halfvec_cosine_ops);

-- ──────────────────────────────────────────────
-- 9. ROADMAPS — 마스터 로드맵
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.roadmaps (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    target_job      VARCHAR(100) NOT NULL,
    is_active       BOOLEAN DEFAULT TRUE,
    version         INTEGER DEFAULT 1,
    status          VARCHAR(20) DEFAULT 'generating', -- generating, completed, failed
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 10. MILESTONES — 로드맵 단계
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.milestones (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    roadmap_id      UUID NOT NULL REFERENCES public.roadmaps(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    order_index     INTEGER NOT NULL,
    description     TEXT,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 11. TOPICS — 상세 학습 주제
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.topics (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    milestone_id    UUID NOT NULL REFERENCES public.milestones(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    content_md      TEXT,
    required_skills VARCHAR[] DEFAULT '{}',
    order_index     INTEGER NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ──────────────────────────────────────────────
-- 12. USER_TOPIC_PROGRESS — 진행 상태
-- ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.user_topic_progress (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    topic_id        UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
    status          VARCHAR(20) DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'completed')),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, topic_id)
);

-- 인덱스 및 트리거
CREATE INDEX IF NOT EXISTS idx_milestones_roadmap_id ON public.milestones(roadmap_id);
CREATE INDEX IF NOT EXISTS idx_topics_milestone_id ON public.topics(milestone_id);
CREATE INDEX IF NOT EXISTS idx_progress_user_id ON public.user_topic_progress(user_id);

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_roadmaps_updated_at
    BEFORE UPDATE ON public.roadmaps
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();

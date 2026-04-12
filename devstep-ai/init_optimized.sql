-- ============================================
-- DevStep Schema Optimization & AI-Ready JSON Storage
-- ============================================

-- 1. 기존 테이블 정리 (필요 시)
-- DROP TABLE IF EXISTS onboarding_surveys;

-- 2. USERS 테이블 미니멀화 및 PK 명칭 'id'로 변경
-- 기존 테이블이 있을 경우 ALTER 명령어로 처리하거나, 초기화 시 아래 쿼리 사용
CREATE TABLE IF NOT EXISTS public.users (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    name            VARCHAR(100),
    avatar_url      TEXT,
    is_onboarded    BOOLEAN DEFAULT FALSE,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 3. AI 전용 온보딩 상세 데이터 테이블 (JSONB 전용)
CREATE TABLE IF NOT EXISTS public.onboarding_surveys (
    survey_id       UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    survey_data     JSONB NOT NULL DEFAULT '{}'::jsonb,
    version         INTEGER DEFAULT 1,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_user_survey UNIQUE (user_id)
);

-- 4. PORTFOLIO 테이블 FK 명칭 동기화
CREATE TABLE IF NOT EXISTS public.portfolio (
    portfolio_id    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    tech_stacks     JSONB DEFAULT '[]'::jsonb,
    certifications  JSONB DEFAULT '[]'::jsonb,
    activities      JSONB DEFAULT '[]'::jsonb,
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT uq_portfolio_user UNIQUE (user_id)
);

-- 인덱스 추가
CREATE INDEX IF NOT EXISTS idx_onboarding_json ON public.onboarding_surveys USING GIN (survey_data);
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);

COMMENT ON TABLE public.onboarding_surveys IS 'AI 분석 엔진이 참조하는 사용자별 상세 진단 Raw 데이터 (Point A & B)';

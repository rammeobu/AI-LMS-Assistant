# ============================================
# DevStep AI — FastAPI & Celery Dockerfile (Optimized with uv)
# ============================================

# ── Stage 1: Builder ──
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS builder

# System dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

ENV UV_COMPILE_BYTECODE=1
ENV UV_LINK_MODE=copy

WORKDIR /app

# Install dependencies
# 레이어 캐시를 위해 소스 코드보다 의존성 파일을 먼저 복사
COPY pyproject.toml uv.lock ./
RUN --mount=type=cache,target=/root/.cache/uv \
    uv sync --frozen --no-install-project --no-dev

# ── Stage 2: Runtime ──
FROM python:3.12-slim-bookworm

WORKDIR /app

# 시스템 라이브러리 (psycopg2 등을 위한 runtime lib)
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq5 \
    && rm -rf /var/lib/apt/lists/*

# 빌더 스테이지에서 생성된 가상환경 복사
COPY --from=builder /app/.venv /app/.venv

# 가상환경을 PATH에 추가하여 활성화된 것과 동일하게 동작
ENV PATH="/app/.venv/bin:$PATH"

# 소스 코드 복사
COPY . .

EXPOSE 8000

# 기본 실행 명령 (docker-compose에서 api/worker에 따라 오버라이드됨)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

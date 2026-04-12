# ============================================
# DevStep AI — FastAPI Dockerfile
# ============================================

FROM python:3.12-slim

WORKDIR /app

# System dependencies (for psycopg2, etc.)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
        gcc \
        libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Application code
COPY . .

EXPOSE 8000

# --reload for development hot-reload (mount volume in compose)
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]

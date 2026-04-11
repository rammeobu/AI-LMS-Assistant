import asyncio
import os
import sys

# 현재 디렉토리를 path에 추가
sys.path.append(os.getcwd())

from app.services.matching import MatchingService
from app.core.config import get_settings

async def verify_ai_pipeline():
    print("[1] AI Pipeline Verification Started (Optimized for Current Environment)...")
    
    settings = get_settings()
    if not settings.GOOGLE_AI_API_KEY:
        print("ERROR: GOOGLE_AI_API_KEY is not set.")
        return

    service = MatchingService()
    
    # 1. 기술 스택 정규화 테스트 (gemini-2.0-flash-lite 사용)
    print("\n--- [Step 1: Skill Normalization (Gemini 2.0 Flash Lite)] ---")
    test_skills = ["React", "noda.js", "python", "Spring"]
    try:
        response = await service._client.aio.models.generate_content(
            model=service._norm_model, 
            contents=f"Normalize these tech skills to standard English names. Format as JSON: {test_skills}"
        )
        print(f"Input: {test_skills}")
        print(f"Response: {response.text.strip()[:100]}...")
        print("Result: Success")
    except Exception as e:
        print(f"Result: Failed - {e}")

    # 2. 임베딩 생성 테스트 (3072차원)
    print("\n--- [Step 2: 3072-dim Embedding (Embedding-001)] ---")
    try:
        vector = await service._get_embedding("React, Python, Spring")
        print(f"Embedding Success! Dimension: {len(vector)}")
        if len(vector) == 3072:
            print("Check: 3072-dim Verified")
        else:
            print(f"Check: Dimension Mismatch ({len(vector)})")
    except Exception as e:
        print(f"Result: Failed - {e}")

    # 3. 모델 로드 및 스키마 구조 확인
    print("\n--- [Step 3: DB Model & Schema Sync Check] ---")
    try:
        from app.models.user import User
        from app.models.onboarding import OnboardingSurvey
        from app.models.activity import Activity
        
        print(f"User PK Column: {User.id.name}")
        print(f"OnboardingSurvey Table: {OnboardingSurvey.__tablename__}")
        
        # pgvector 타입 확인을 위해 런타임 객체 조사
        # Activity.skill_embedding 은 InstrumentedAttribute 임
        column_type = str(Activity.skill_embedding.property.columns[0].type)
        print(f"Activity Vector Type String: {column_type}")
        
        if User.id.name == "id" and "VECTOR(3072)" in column_type.upper():
            print("Check: DB Model Sync Success (id, Vector(3072) detected)")
        else:
            print(f"Check: DB Model Sync Failed (Mismatch found)")
    except Exception as e:
        print(f"Check: Model Loading Failed - {e}")

    print("\nVerification process completed.")

if __name__ == "__main__":
    asyncio.run(verify_ai_pipeline())

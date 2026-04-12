import asyncio
import os
import sys
import json
from sqlalchemy import text, select
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker

# 현재 디렉토리를 path에 추가
sys.path.append(os.getcwd())

from app.services.matching import MatchingService
from app.core.config import get_settings
from app.models.user import User
from app.models.onboarding import OnboardingSurvey
from app.models.activity import Activity

async def seed_data():
    print("[Step 1] DB Connection & Driver Setup...")
    settings = get_settings()
    
    # 드라이버를 asyncpg로 강제 지정
    db_url = settings.DATABASE_URL
    if db_url.startswith("postgresql://"):
        db_url = db_url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    # Docker 호스트 'db'를 'localhost'로 변환
    if "@db:" in db_url:
        db_url = db_url.replace("@db:", "@localhost:", 1)
        
    print(f"  - Target URL: {db_url.split('@')[-1]}")

    try:
        engine = create_async_engine(db_url, echo=False)
        AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
        
        async with engine.begin() as conn:
            # 필수 확장 기능 확인
            await conn.execute(text('CREATE EXTENSION IF NOT EXISTS "vector";'))
            await conn.execute(text('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";'))
            
        service = MatchingService()
        
        async with AsyncSessionLocal() as session:
            # 1. 테스트 유저 생성
            test_user_id = "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11"
            print("\n[Step 2] Preparing Test User & Survey Data...")
            
            # 유저 생성 (id 직접 지정)
            stmt_user = text("INSERT INTO users (id, email, name, is_onboarded) VALUES (:id, :email, :name, :is_onboarded) ON CONFLICT (id) DO NOTHING")
            await session.execute(stmt_user, {"id": test_user_id, "email": "test@devstep.kr", "name": "홍길동", "is_onboarded": True})
            
            # 설문 데이터 생성 (Point A: React, Python)
            survey_payload = {
                "profile": {"name": "홍길동", "region": "서울"},
                "point_a": {
                    "current_skills": ["React", "Python", "SQL"],
                    "academic_year": "3학년",
                    "current_focus": ["백엔드 개발"],
                    "experience_level": "중급",
                    "interests": ["생성형 AI"]
                },
                "point_b": {
                    "career_gaps": ["인턴 경험 부족"],
                    "target_domains": ["웹 백엔드", "AI 서비스"],
                    "availability_resource": "주 20시간",
                    "free_idea": "실제 서비스 배포 경험을 쌓고 싶습니다."
                }
            }
            stmt_survey = text("INSERT INTO onboarding_surveys (user_id, survey_data) VALUES (:user_id, :data) ON CONFLICT (user_id) DO NOTHING")
            await session.execute(stmt_survey, {"user_id": test_user_id, "data": json.dumps(survey_payload)})
            
            await session.commit()
            print("  - Test User & Survey Data Initialized.")

            # 2. 대외활동 시딩
            print("\n[Step 3] Seeding Activities with 3072-dim Embeddings...")
            activities_to_seed = [
                {
                    "title": "Naver Whale Hackathon 2026",
                    "required_skills": ["React", "Node.js", "AI"],
                    "description": "Develop innovative web services based on Naver Whale browser. React and AI integration skills are key."
                },
                {
                    "title": "Kakao Internship 2026",
                    "required_skills": ["Java", "Spring Boot", "MySQL"],
                    "description": "Real-world internship to enhance backend services at Kakao. Java and SQL skills are essential."
                },
                {
                    "title": "Programmers AI DevCourse",
                    "required_skills": ["Python", "PyTorch", "LangChain"],
                    "description": "Intensive training course focused on building services using Generative AI and LLMs."
                }
            ]

            for act in activities_to_seed:
                # 중복 체크 (ORM 사용)
                check_stmt = select(Activity).where(Activity.title == act['title'])
                res = await session.execute(check_stmt)
                if res.scalar_one_or_none():
                    print(f"  - '{act['title']}' already exists. Skipping.")
                    continue

                print(f"  - Generating embedding for '{act['title']}'...")
                content = f"Title: {act['title']}\nDescription: {act['description']}"
                vector = await service._get_embedding(content)
                
                activity = Activity(
                    title=act['title'],
                    required_skills=act['required_skills'],
                    description=act['description'],
                    skill_embedding=vector
                )
                session.add(activity)
            
            await session.commit()
            print("  - Seeding Completed.")

            # 3. 매칭 테스트
            print("\n[Step 4] Running Unified Match Engine Test...")
            result = await service.match(
                db=session,
                user_id=test_user_id,
                target_job="Backend Developer"
            )
            
            print(f"\n[AI Match Result] (Normalized Skills: {result.normalized_skills})")
            for i, m in enumerate(result.matches, 1):
                print(f"{i}. {m['title']} (Score: {m['score']})")
                print(f"   Reason: {m['reason']}")

    except Exception as e:
        print(f"\nERROR: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(seed_data())

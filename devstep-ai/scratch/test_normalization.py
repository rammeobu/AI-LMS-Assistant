import asyncio
import os
import sys
import logging

# 현재 디렉토리를 path에 추가
sys.path.append(os.getcwd())

from app.core.database import async_session_factory
from app.services.normalization import NormalizationService

logging.basicConfig(level=logging.INFO)

async def test_normalization():
    print("Starting Normalization Test...")
    service = NormalizationService()
    
    async with async_session_factory() as db:
        unprocessed_ids = await service.get_unprocessed_ids(db, limit=1)
        if not unprocessed_ids:
            print("No unprocessed data found.")
            return
        
        target_id = unprocessed_ids[0]
        print(f"Found unprocessed record ID: {target_id}")
        
        try:
            await service.normalize_and_sync(db, target_id)
            print("Normalization Success!")
        except Exception as e:
            print(f"Normalization Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_normalization())

import time
from id_collector import collect_activity_ids
from detail_data import crawl_activities
from supabase_handler import db_manager # 👈 추가된 DB 핸들러 모듈

INTERVAL_HOURS = 12

if __name__ == "__main__":
    while True:
        print(f"\n{'='*40}")
        print("🚀 1단계: ID 수집")
        ids = collect_activity_ids()
        #ids = ids[:1]
        # 수집된 ID가 있을 때만 2~3단계 진행
        if ids:
            print(f"\n{'='*40}")
            print("🚀 2단계: 상세 크롤링 및 로컬 JSON 저장")
            crawled_data = crawl_activities(ids)

            print(f"\n{'='*40}")
            print("🚀 3단계: Supabase 클라우드 전송")
            db_manager.upload_activities(crawled_data)
        else:
            print("  ⚠️ 수집된 ID가 없어 상세 크롤링 및 DB 전송을 건너뜁니다.")

        print(f"\n⏳ 다음 수집까지 {INTERVAL_HOURS}시간 대기...")
        time.sleep(INTERVAL_HOURS * 3600)
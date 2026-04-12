import time
from id_collector import collect_activity_ids
from detail_data import crawl_activities
from supabase_handler import db_manager
from ai import process_and_save_to_new_table

INTERVAL_HOURS = 12

if __name__ == "__main__":
    while True:
        print(f"\n{'='*40}")
        print("🚀 1단계: ID 수집")
        ids = collect_activity_ids()
        
        # 수집된 ID가 있을 때만 2~4단계 진행
        if ids:
            print(f"\n{'='*40}")
            print("🚀 2단계: 상세 크롤링 및 로컬 JSON 저장")
            crawled_data = crawl_activities(ids)

            print(f"\n{'='*40}")
            print("🚀 3단계: Supabase 클라우드 전송 (Raw Data)")
            db_manager.upload_activities(crawled_data)
            
            print(f"\n{'='*40}")
            print("🚀 4단계: AI 맞춤형 키워드 가공 및 DB 적재")
            try:
                process_and_save_to_new_table()
            except Exception as e:
                print(f"  ❌ 4단계 AI 가공 파이프라인 실행 중 오류 발생: {e}")
                
        else:
            print("  ⚠️ 수집된 ID가 없어 상세 크롤링, DB 전송, AI 가공을 건너뜁니다.")

        print(f"\n⏳ 다음 사이클까지 {INTERVAL_HOURS}시간 대기...")
        time.sleep(INTERVAL_HOURS * 3600)
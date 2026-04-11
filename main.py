import time
from id_collector    import collect_activity_ids
from detail_data import crawl_activities

INTERVAL_HOURS = 12

if __name__ == "__main__":
    while True:
        print(f"\n{'='*40}")
        print("🚀 1단계: ID 수집")
        ids = collect_activity_ids()        # ← ID 추출 함수

        print(f"\n{'='*40}")
        print("🚀 2단계: 상세 크롤링")
        crawl_activities(ids)               # ← ID 받아서 파싱

        print(f"\n⏳ 다음 수집까지 {INTERVAL_HOURS}시간 대기...")
        time.sleep(INTERVAL_HOURS * 3600)
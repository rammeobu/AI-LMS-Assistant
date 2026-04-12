import os
from dotenv import load_dotenv
from supabase import create_client, Client

# .env 파일에서 설정 불러오기
load_dotenv()

class SupabaseManager:
    def __init__(self):
        url = os.getenv("SUPABASE_URL")
        key = os.getenv("SUPABASE_KEY")
        
        if not url or not key:
            raise ValueError("⚠️ .env 파일에 SUPABASE_URL 또는 SUPABASE_KEY가 없습니다.")
            
        self.supabase: Client = create_client(url, key)

    def upload_activities(self, data_list: list[dict]):
        if not data_list:
            print("  ⚠️ 전송할 데이터가 없습니다.")
            return

        # 1. 크롤링된 한글 키를 Supabase의 영문 컬럼명에 매핑
        mapped_data = []
        for item in data_list:
            mapped_data.append({
                "id":           item.get("ID"),
                "collected_at": item.get("수집일시"),
                "organization": item.get("기관"),
                "title":        item.get("제목"),
                "subject":      item.get("주제"),
                "start_date":   item.get("시작일"),
                "end_date":     item.get("마감일"),
                "target":       item.get("대상"),
                "homepage":     item.get("홈페이지"),
                "description":  item.get("상세내용"),
            })

        # 2. 클라우드 DB로 전송
        try:
            batch_size = 100
            for i in range(0, len(mapped_data), batch_size):
                batch = mapped_data[i : i + batch_size]
                self.supabase.table("crawling_data").upsert(
                    batch, 
                    on_conflict="id"
                ).execute()
            
            print(f"  ☁️ ✅ Supabase 'crawling_data' 테이블에 {len(mapped_data)}건 동기화 완료")
        except Exception as e:
            print(f"  ☁️ ❌ Supabase 업로드 실패: {e}")

# 다른 파일에서 바로 사용할 수 있도록 인스턴스 생성
db_manager = SupabaseManager()
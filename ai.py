import os
import json
import time
from dotenv import load_dotenv
from supabase import create_client, Client
from google import genai
from google.genai import types

# ==========================================
# 1. 환경 변수 로드 및 안전 검사
# ==========================================
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(BASE_DIR, '.env')
load_dotenv(dotenv_path=env_path, override=True)

url = os.getenv("SUPABASE_URL")
key = os.getenv("SUPABASE_KEY")
gemini_key = os.getenv("GEMINI_API_KEY")

if not url or not key or not gemini_key:
    print("\n🚨 [치명적 오류] 환경 변수를 읽지 못했습니다. .env 파일을 확인하세요.")
    exit()

# ==========================================
# 2. 클라이언트 초기화
# ==========================================
supabase: Client = create_client(url, key)
gemini_client = genai.Client(api_key=gemini_key)

# ==========================================
# 3. 메인 가공 파이프라인 함수
# ==========================================
def process_and_save_to_new_table():
    print("🚀 IT 대학생 맞춤형 AI 가공 시작 (RPM 쿨다운 및 무중단 탐색 적용)")
    
    # 가공 안 된 데이터 찾기
    response = supabase.table("crawling_data") \
        .select("id, title, description, ai_processed_data!left(crawling_id)") \
        .is_("ai_processed_data.crawling_id", "null") \
        .execute()
    
    unprocessed_items = response.data

    if not unprocessed_items:
        print("✨ 모든 데이터 가공 완료!")
        return

    # 구글 최신 무료 모델 후보군
    models_to_try = [
        'gemini-3.1-flash-lite-preview'
    ]

    for item in unprocessed_items:
        print(f"\n🔄 가공 중: [{item['id']}] {item['title']}")
        raw_text = item.get('description', '')
        truncated_text = raw_text[:1500] if raw_text else ""
        
        prompt = f"""
        당신은 IT 대학생을 위한 공모전 분석 전문가입니다. 
        상세내용을 분석하여 다음 3가지 카테고리로 키워드를 분류해 JSON으로 응답하세요.

        1. domain_tags: 해당 분야 (예: 핀테크, 헬스케어, 보안, 모빌리티, 에듀테크, 블록체인 등)
        2. activity_types: 활동 성격 (예: 해커톤, 코딩, 알고리즘, 데이터분석, UI/UX 디자인, 기획)
        3. benefit_tags: 참여 혜택 (예: 상금, 인턴십, 서류전형 면제, 수료증, 전문가 멘토링, 네트워킹)

        반드시 아래 JSON 형식을 지키고, 각 카테고리당 최대 4개씩 추출하세요.

        [응답 형식]
        {{
            "domain_tags": ["분야1", "분야2"],
            "activity_types": ["유형1", "유형2"],
            "benefit_tags": ["혜택1", "혜택2"]
        }}

        [상세내용]
        {truncated_text}
        """
        
        success = False
        
        for target_model in models_to_try:
            if success: 
                break 
                
            MAX_RETRIES = 3 # 재시도 횟수를 3회로 넉넉하게 늘림
            for attempt in range(MAX_RETRIES):
                try:
                    response = gemini_client.models.generate_content(
                        model=target_model,
                        contents=prompt,
                        config=types.GenerateContentConfig(response_mime_type="application/json")
                    )
                    
                    ai_result = json.loads(response.text)
                    d_tags = ai_result.get("domain_tags", [])
                    a_tags = ai_result.get("activity_types", [])
                    b_tags = ai_result.get("benefit_tags", [])
                    
                    supabase.table("ai_processed_data").upsert({
                        "crawling_id": item["id"],
                        "domain_tags": d_tags,
                        "activity_types": a_tags,
                        "benefit_tags": b_tags
                    }).execute()
                    
                    print(f"  ✅ 가공 완료 및 DB 저장 성공! (사용한 모델: {target_model})")
                    success = True
                    break 
                    
                except Exception as e:
                    error_msg = str(e)
                    
                    if "404" in error_msg:
                        break # 이름이 없는 모델은 즉시 버리고 다음 모델로
                    
                    # 💡 핵심 추가: 분당 요청 한도(429) 초과 시 60초 대기하여 쿼터 초기화!
                    if "429" in error_msg or "RESOURCE_EXHAUSTED" in error_msg:
                        if attempt < MAX_RETRIES - 1:
                            print(f"  ⏳ 분당 요청 한도 도달(429). 60초간 숨 고르기 후 재시도합니다... ({attempt+1}/{MAX_RETRIES})")
                            time.sleep(60)
                            continue
                            
                    if "503" in error_msg or "UNAVAILABLE" in error_msg:
                        if attempt < MAX_RETRIES - 1:
                            print(f"  ⚠️ 서버 과부하(503). 10초 대기 후 재시도... ({attempt+1}/{MAX_RETRIES})")
                            time.sleep(10)
                            continue
                            
                    break

        if not success:
            print(f"  ❌ 모든 모델 가공 실패 ({item['id']}). 다음 데이터로 넘어갑니다.")

        # 무료 티어 안정성을 위해 데이터 하나당 기본 5초 대기
        time.sleep(5) 

if __name__ == "__main__":
    process_and_save_to_new_table()
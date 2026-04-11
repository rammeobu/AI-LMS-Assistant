import json
from supabase_handler import db_manager

# 1. 가지고 계신 JSON 파일 이름을 여기에 정확히 적어주세요.
# (예: "linkareer_activities_20260411_2019.json" 또는 "test.json")
JSON_FILE_NAME = "linkareer_activities_20260411_2034.json"

def test_single_upload():
    try:
        # 2. JSON 파일 읽어오기
        with open(JSON_FILE_NAME, "r", encoding="utf-8") as f:
            data_list = json.load(f)

        if not data_list:
            print("  ⚠️ JSON 파일이 비어있습니다.")
            return

        # 3. 리스트에서 첫 번째 데이터 딱 1개만 추출
        single_item = data_list[0]
        
        print(f"\n{'='*40}")
        print(f"🎯 [테스트 전송] 대상 제목: {single_item.get('제목')}")
        print(f"    - ID: {single_item.get('ID')}")
        print(f"{'='*40}\n")

        # 4. 핸들러는 리스트(list) 형태를 기대하므로 대괄호 [ ] 로 감싸서 보냅니다.
        db_manager.upload_activities([single_item])

    except FileNotFoundError:
        print(f"  ❌ 에러: '{JSON_FILE_NAME}' 파일을 찾을 수 없습니다. 오타가 없는지 확인해주세요.")
    except Exception as e:
        print(f"  ❌ 에러 발생: {e}")

if __name__ == "__main__":
    test_single_upload()
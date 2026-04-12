import os
from dotenv import load_dotenv

# ai.py 파일이 있는 디렉토리를 기준으로 .env 경로 설정
current_dir = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(current_dir, '.env')

# 절대 경로로 로드 시도
if not load_dotenv(dotenv_path):
    print(f"🚨 [치명적 오류] 환경 변수를 읽지 못했습니다.")
    print(f"시도한 경로: {dotenv_path}")
    exit(1)
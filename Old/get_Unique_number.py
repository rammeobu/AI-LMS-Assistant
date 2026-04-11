import time
import random
import os
import requests
import pandas as pd
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from datetime import datetime

def run_crawler():
    print(f"\n🚀 [링크 추출 시작] {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    os.makedirs("posters", exist_ok=True)
    all_links = []
    page_num = 1     # 1페이지부터 시작
    
    # 무한 루프 및 중복 방지용 Set
    seen_links = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=50) # 완료 후엔 headless=True 권장
        context = browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            viewport={"width": 1280, "height": 800},
            locale="ko-KR",
            timezone_id="Asia/Seoul",
        )

        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            window.chrome = { runtime: {} };
        """)

        try:
            while True:
                # 매 페이지마다 완전한 '새 창(탭)'을 엽니다 (SPA 무한루프 방지)
                page = context.new_page()

                url = (
                    "https://linkareer.com/list/contest"
                    "?filterBy_categoryIDs=40&filterBy_categoryIDs=35"
                    "&filterType=CATEGORY&orderBy_direction=DESC"
                    f"&orderBy_field=CREATED_AT&page={page_num}"
                )
                print(f"\n📄 {page_num}페이지 접근 중...")
                
                page.goto(url, timeout=60000)
                page.wait_for_load_state("networkidle", timeout=60000)
                page.wait_for_timeout(3000) # 데이터 로딩 대기

                # 스크롤 내리기
                for _ in range(3):
                    page.keyboard.press("PageDown")
                    time.sleep(random.uniform(1.0, 2.0))

                html = page.content()
                soup = BeautifulSoup(html, "html.parser")
                cards = soup.select("div.ActivityListCardItem__StyledWrapper-sc-39989f6d-0")

                # 종료 조건 1: 카드가 없으면 종료
                if not cards or len(cards) == 0:
                    print(f"🛑 {page_num}페이지에 데이터가 없습니다. 마지막 페이지 도달.")
                    page.close()
                    break

                # 종료 조건 2: 1페이지로 튕김 현상 감지
                first_card_link_tag = cards[0].select_one("a.image-link")
                first_card_link = "https://linkareer.com" + first_card_link_tag["href"] if first_card_link_tag else ""
                
                if first_card_link in seen_links:
                    print(f"🛑 앗! 화면이 더 이상 갱신되지 않거나 1페이지로 돌아왔습니다. 크롤링 종료.")
                    page.close()
                    break

                print(f"✅ {page_num}페이지: {len(cards)}개의 링크 추출 중...")

                # 링크 데이터만 파싱
                for card in cards:
                    link_tag = card.select_one("a.image-link")
                    if link_tag:
                        link = "https://linkareer.com" + link_tag["href"]
                        
                        # 중복되지 않은 링크만 리스트에 추가
                        if link not in seen_links:
                            seen_links.add(link)

                            # 이미지 다운로드 로직 추가
                            title_tag = card.select_one("h5.activity-title")
                            title = title_tag.text.strip() if title_tag else "제목없음"
                            
                            img_tag = card.select_one("img.activity-image")
                            img_url = img_tag["src"] if img_tag else None

                            poster_filename = "없음"
                            if img_url:
                                safe_title = "".join(x for x in title if x.isalnum() or x in " -_").strip()
                                poster_filename = f"posters/poster_{page_num}_{safe_title[:10]}.jpg"
                                
                                if not os.path.exists(poster_filename):
                                    try:
                                        response = requests.get(img_url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
                                        with open(poster_filename, "wb") as f:
                                            f.write(response.content)
                                    except Exception as e:
                                        print(f"  ❌ 포스터 다운로드 실패: {e}")

                            all_links.append({
                                "상세링크": link,
                                "포스터URL": img_url or "없음",
                                "포스터파일": poster_filename
                            })

                page_num += 1
                
                # 크롤링이 끝난 현재 탭 닫기
                page.close()
                time.sleep(random.uniform(2.5, 5.0)) # IP 차단 방지

        except Exception as e:
            print(f"❌ 크롤링 중 에러 발생: {e}")
        finally:
            browser.close()

        # CSV 저장
        if all_links:
            df = pd.DataFrame(all_links)
            save_name = f"linkareer_links_only_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
            df.to_csv(save_name, index=False, encoding="utf-8-sig")
            print(f"🎉 완료! 총 {len(df)}개 링크 → {save_name} 저장 완료")

if __name__ == "__main__":
    # 12시간(43,200초) 간격 무한 루프
    INTERVAL_HOURS = 12
    INTERVAL_SECONDS = INTERVAL_HOURS * 60 * 60

    while True:
        run_crawler()
        print(f"⏳ 다음 크롤링까지 {INTERVAL_HOURS}시간 대기합니다...")
        time.sleep(INTERVAL_SECONDS)
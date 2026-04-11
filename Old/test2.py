import time
import random
import os
import requests
import pandas as pd
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from datetime import datetime

def run_crawler():
    print(f"\n🚀 [크롤링 시작] {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    os.makedirs("posters", exist_ok=True)
    all_contests = []
    item_counter = 1 # 전체 순번 관리
    page_num = 1     # 1페이지부터 시작

    # ✅ 무한 루프 및 중복 방지용 Set
    seen_links = set()

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=50) # 완료 후엔 headless=True로 변경 권장
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

        page = context.new_page()

        try:
            while True:
                # 1. 동적 URL 생성
                url = (
                    "https://linkareer.com/list/contest"
                    "?filterBy_categoryIDs=40&filterBy_categoryIDs=35"
                    "&filterType=CATEGORY&orderBy_direction=DESC"
                    f"&orderBy_field=CREATED_AT&page={page_num}"
                )
                print(f"\n📄 {page_num}페이지 접근 중...")
                
                # 🔥 [핵심 해결책] SPA 캐시 렌더링 방지: 백지로 먼저 이동 후 타겟 URL 접속
                page.goto("about:blank") 
                page.wait_for_timeout(500) # 아주 잠깐 대기
                
                # 진짜 URL로 이동 (강제 새로고침 효과)
                page.goto(url, timeout=60000)
                page.wait_for_load_state("networkidle", timeout=60000)
                page.wait_for_timeout(3000) # API 데이터가 그려질 때까지 대기

                # 스크롤 내리기 (지연 로딩 이미지 확보)
                for _ in range(3):
                    page.keyboard.press("PageDown")
                    time.sleep(random.uniform(1.0, 2.0))

                html = page.content()
                soup = BeautifulSoup(html, "html.parser")
                cards = soup.select("div.ActivityListCardItem__StyledWrapper-sc-39989f6d-0")

                # 2. 종료 조건 1: 해당 페이지에 카드가 없으면 끝페이지로 간주
                if not cards or len(cards) == 0:
                    print(f"🛑 {page_num}페이지에 데이터가 없습니다. 마지막 페이지 도달.")
                    break

                # ✅ 3. 종료 조건 2: 1페이지로 튕김 현상 감지
                first_card_link_tag = cards[0].select_one("a.image-link")
                first_card_link = "https://linkareer.com" + first_card_link_tag["href"] if first_card_link_tag else ""
                
                if first_card_link in seen_links:
                    print(f"🛑 앗! 화면이 더 이상 갱신되지 않거나 1페이지로 돌아왔습니다. 크롤링 종료.")
                    break

                print(f"✅ {page_num}페이지: {len(cards)}개의 공모전 카드 발견")

                # 4. 데이터 파싱 및 이미지 다운로드
                for card in cards:
                    title_tag = card.select_one("h5.activity-title")
                    title = title_tag.text.strip() if title_tag else "제목없음"

                    org_tag = card.select_one(".organization-name")
                    organization = org_tag.text.strip() if org_tag else "기관명 없음"

                    link_tag = card.select_one("a.image-link")
                    link = "https://linkareer.com" + link_tag["href"] if link_tag else "링크없음"

                    # ✅ 파싱한 링크를 Set에 저장하여 다음 페이지 검증에 사용
                    if link != "링크없음":
                        seen_links.add(link)

                    dday_tag = card.select_one(".SecondInfoText__StyledWrapper-sc-3b26042c-0 div")
                    dday = dday_tag.text.strip() if dday_tag else "정보없음"

                    img_tag = card.select_one("img.activity-image")
                    img_url = img_tag["src"] if img_tag else None

                    poster_filename = "없음"
                    if img_url:
                        # 파일명을 순번이 아닌 고유 링크 해시나 이름으로 하는 것이 중복 방지에 좋음
                        safe_title = "".join(x for x in title if x.isalnum() or x in " -_").strip()
                        poster_filename = f"posters/poster_{page_num}_{safe_title[:10]}.jpg"
                        
                        # 이미 다운받은 이미지가 아니면 다운로드
                        if not os.path.exists(poster_filename):
                            try:
                                response = requests.get(img_url, timeout=10, headers={"User-Agent": "Mozilla/5.0"})
                                with open(poster_filename, "wb") as f:
                                    f.write(response.content)
                            except Exception as e:
                                print(f"  ❌ 포스터 다운로드 실패: {e}")

                    all_contests.append({
                        "순번": item_counter,
                        "수집일시": datetime.now().strftime('%Y-%m-%d %H:%M'),
                        "디데이": dday,
                        "공모전명": title,
                        "주최기관": organization,
                        "상세링크": link,
                        "포스터URL": img_url or "없음",
                        "포스터파일": poster_filename,
                    })
                    item_counter += 1

                page_num += 1
                time.sleep(random.uniform(2.5, 5.0)) # 페이지 전환 시 IP 차단 방지를 위한 랜덤 쿨타임

        except Exception as e:
            print(f"❌ 크롤링 중 에러 발생: {e}")
        finally:
            browser.close()

        # 5. CSV 저장
        if all_contests:
            df = pd.DataFrame(all_contests)
            save_name = f"linkareer_contests_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
            df.to_csv(save_name, index=False, encoding="utf-8-sig")
            print(f"🎉 완료! 총 {len(df)}개 공모전 → {save_name} 저장 완료")

if __name__ == "__main__":
    # 6. 12시간(43,200초) 간격 무한 루프 설정
    INTERVAL_HOURS = 12
    INTERVAL_SECONDS = INTERVAL_HOURS * 60 * 60

    while True:
        run_crawler()
        print(f"⏳ 다음 크롤링까지 {INTERVAL_HOURS}시간 대기합니다...")
        time.sleep(INTERVAL_SECONDS)
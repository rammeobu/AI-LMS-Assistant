import time
import random
import os
import requests
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright


def collect_activity_ids() -> list[int]:
    """
    링커리어 공모전 목록 페이지를 순회하며 activity ID만 추출해 반환한다.
    """
    os.makedirs("posters", exist_ok=True)
    collected_ids: list[int] = []
    seen_links: set[str]     = set()
    page_num                 = 1

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True, slow_mo=50)
        context = browser.new_context(
            user_agent=(
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
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
            # ── 1페이지: URL로 최초 접근 ──
            url = (
                "https://linkareer.com/list/contest"
                "?filterBy_categoryIDs=40&filterBy_categoryIDs=35"
                "&filterType=CATEGORY&orderBy_direction=DESC"
                "&orderBy_field=CREATED_AT&page=1"
            )
            print(f"  📄 [{page_num}페이지] ID 수집 중...")
            page.goto(url, timeout=60000)
            page.wait_for_load_state("networkidle", timeout=60000)
            page.wait_for_timeout(3000)

            while True:
                # 스크롤 내리기 (지연 로딩 이미지 확보 + 하단 페이지네이션 노출)
                for _ in range(3):
                    page.keyboard.press("PageDown")
                    time.sleep(random.uniform(1.0, 2.0))

                soup  = BeautifulSoup(page.content(), "html.parser")
                cards = soup.select(
                    "div.ActivityListCardItem__StyledWrapper-sc-39989f6d-0"
                )

                # 종료 조건 1: 카드 없음
                if not cards:
                    print(f"  🛑 {page_num}페이지 데이터 없음 → 수집 종료")
                    break

                # 종료 조건 2: 페이지 튕김(중복) 감지
                first_tag  = cards[0].select_one("a.image-link")
                first_link = (
                    "https://linkareer.com" + first_tag["href"]
                    if first_tag else ""
                )
                if first_link in seen_links:
                    print(f"  🛑 페이지 중복 감지 → 수집 종료")
                    break

                # ID 파싱
                for card in cards:
                    link_tag = card.select_one("a.image-link")
                    if not link_tag:
                        continue

                    href     = link_tag["href"]          # e.g. /activity/123456
                    full_url = "https://linkareer.com" + href
                    seen_links.add(full_url)

                    try:
                        activity_id = int(href.rstrip("/").split("/")[-1])
                        collected_ids.append(activity_id)

                        # 이미지 다운로드 로직
                        title_tag = card.select_one("h5.activity-title")
                        title = title_tag.text.strip() if title_tag else "제목없음"
                        
                        img_tag = card.select_one("img.activity-image")
                        img_url = img_tag["src"] if img_tag else None

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
                                    
                    except ValueError:
                        print(f"  ⚠️  ID 파싱 실패: {href}")

                print(f"  ✅ {page_num}페이지: {len(cards)}개 ID 수집")
                page_num += 1

                # ── 다음 페이지로 이동: 페이지네이션 버튼 클릭 방식 ──
                next_btn = page.locator("button.button-page-number", has_text=str(page_num))
                if next_btn.count() == 0:
                    # 숫자 버튼이 없으면 '>' (다음) 화살표 버튼 시도
                    next_arrow = page.locator("button.button-page-arrow >> nth=-1")
                    if next_arrow.count() == 0:
                        print(f"  🛑 다음 페이지 버튼 없음 → 수집 종료")
                        break
                    next_arrow.click()
                else:
                    next_btn.click()

                print(f"  📄 [{page_num}페이지] ID 수집 중...")

                # 페이지 전환 후 콘텐츠 로딩 대기
                page.wait_for_load_state("networkidle", timeout=60000)
                page.wait_for_timeout(3000)
                time.sleep(random.uniform(1.5, 3.0))

        except Exception as e:
            print(f"  ❌ ID 수집 중 오류: {e}")
        finally:
            browser.close()

    print(f"  📋 총 {len(collected_ids)}개 ID 수집 완료")
    return collected_ids
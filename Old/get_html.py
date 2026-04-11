import time
import random
from playwright.sync_api import sync_playwright

def get_html():
    url = (
        "https://linkareer.com/list/contest"
        "?filterBy_categoryIDs=40&filterBy_categoryIDs=35"
        "&filterType=CATEGORY&orderBy_direction=DESC"
        "&orderBy_field=CREATED_AT&page=21"
    )

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=False, slow_mo=50)
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

        # ✅ playwright_stealth 없이 직접 webdriver 감지 우회
        context.add_init_script("""
            Object.defineProperty(navigator, 'webdriver', { get: () => undefined });
            Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3] });
            Object.defineProperty(navigator, 'languages', { get: () => ['ko-KR', 'ko'] });
            window.chrome = { runtime: {} };
        """)

        page = context.new_page()

        try:
            print("✅ 접속 시도 중...")
            page.goto(url, timeout=60000)
            page.wait_for_load_state("networkidle", timeout=60000)
            page.wait_for_timeout(3000)

            for _ in range(3):
                page.keyboard.press("PageDown")
                time.sleep(random.uniform(1.5, 3.5))

            html = page.content()

            with open("linkareer.html", "w", encoding="utf-8") as f:
                f.write(html)

            print(f"✅ HTML 저장 완료! 길이: {len(html)}자")
            print(html[:2000])
            return html

        except Exception as e:
            print(f"❌ 에러 발생: {e}")
            return None
        finally:
            browser.close()

if __name__ == "__main__":
    get_html()
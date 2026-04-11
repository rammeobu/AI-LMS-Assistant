import time
import random
import pandas as pd
from bs4 import BeautifulSoup
from playwright.sync_api import sync_playwright
from datetime import datetime

def _parse_activity(soup: BeautifulSoup, activity_id: int) -> dict | None:
    title_tag = soup.select_one("h1.activity-title") or soup.select_one("h1")
    if not title_tag:
        return None

    title = title_tag.text.strip()

    org_tag = (
        soup.select_one(".organization-name")
        or soup.select_one("[class*='organization']")
    )
    organization = org_tag.text.strip() if org_tag else "기관명 없음"

    # info 행 파싱
    info: dict[str, str] = {}
    for dt in soup.select("dl dt"):
        dd = dt.find_next_sibling("dd")
        if dd:
            info[dt.text.strip()] = dd.text.strip()
    for row in soup.select("[class*='InfoRow'],[class*='info-row'],[class*='DetailInfo']"):
        spans = row.select("span, p, div")
        if len(spans) >= 2:
            info[spans[0].text.strip()] = spans[1].text.strip()

    def pick(keys: list[str]) -> str:
        for k in keys:
            for ik, iv in info.items():
                if k in ik:
                    return iv
        return "정보없음"

    subject  = pick(["주제", "분야", "카테고리"])
    period   = pick(["기간", "접수", "일정", "신청"])
    target   = pick(["대상", "자격", "지원"])
    homepage = pick(["홈페이지", "사이트", "링크", "URL"])

    if homepage == "정보없음":
        for a in soup.select("a[href^='http']"):
            if "linkareer" not in a["href"]:
                homepage = a["href"]
                break

    img_tag = (
        soup.select_one("img.activity-image")
        or soup.select_one("[class*='poster'] img")
        or soup.select_one("[class*='thumbnail'] img")
    )
    img_url = None
    if img_tag:
        img_url = img_tag.get("src") or img_tag.get("data-src")

    return {
        "ID"        : activity_id,
        "수집일시"  : datetime.now().strftime("%Y-%m-%d %H:%M"),
        "기관"      : organization,
        "제목"      : title,
        "주제"      : subject,
        "전체기간"  : period,
        "대상"      : target,
        "홈페이지"  : homepage,
        "포스터URL" : img_url or "없음"
    }


def crawl_activities(activity_ids: list[int]) -> list[dict]:
    """
    수집된 activity_ids 를 받아 상세 페이지를 파싱한다.
    결과 list[dict] 를 반환하고 CSV 저장까지 수행한다.
    """
    print(f"\n🔎 상세 크롤링 시작 — 대상 {len(activity_ids)}개")
    all_data: list[dict] = []

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
            for idx, activity_id in enumerate(activity_ids, start=1):
                print(f"  🔍 [{idx}/{len(activity_ids)}] ID={activity_id}")

                page.goto("about:blank")
                page.wait_for_timeout(300)
                page.goto(
                    f"https://linkareer.com/activity/{activity_id}",
                    timeout=60000,
                )
                page.wait_for_load_state("networkidle", timeout=60000)
                page.wait_for_timeout(2500)

                for _ in range(2):
                    page.keyboard.press("PageDown")
                    time.sleep(random.uniform(0.8, 1.5))

                entry = _parse_activity(
                    BeautifulSoup(page.content(), "html.parser"),
                    activity_id,
                )

                if entry is None:
                    print(f"  ⚠️  ID={activity_id} 파싱 실패, 건너뜀")
                    continue

                all_data.append(entry)
                print(f"  ✅ 「{entry['제목']}」")
                time.sleep(random.uniform(1.5, 3.5))

        except Exception as e:
            print(f"❌ 상세 크롤링 오류: {e}")
        finally:
            browser.close()

    # CSV 저장
    if all_data:
        col_order = ["ID", "수집일시", "기관", "제목", "주제",
                     "전체기간", "대상", "홈페이지", "포스터URL"]
        df        = pd.DataFrame(all_data)
        df        = df[[c for c in col_order if c in df.columns]]
        save_name = f"linkareer_activities_{datetime.now().strftime('%Y%m%d_%H%M')}.csv"
        df.to_csv(save_name, index=False, encoding="utf-8-sig")
        print(f"\n🎉 {len(df)}건 → {save_name} 저장 완료")

    return all_data
import os
import requests
from bs4 import BeautifulSoup
import pandas as pd

def parse_linkareer_html(html_path="linkareer.html"):
    with open(html_path, "r", encoding="utf-8") as f:
        html = f.read()

    soup = BeautifulSoup(html, "html.parser")

    # 공모전 카드 전체 선택
    cards = soup.select("div.ActivityListCardItem__StyledWrapper-sc-39989f6d-0")
    print(f"✅ 총 {len(cards)}개의 공모전 카드 발견")

    os.makedirs("posters", exist_ok=True)
    all_contests = []

    for i, card in enumerate(cards, 1):
        # 공모전명
        title_tag = card.select_one("h5.activity-title")
        title = title_tag.text.strip() if title_tag else "제목없음"

        # 주최기관 (p 또는 a 태그 둘 다 처리)
        org_tag = card.select_one(".organization-name")
        organization = org_tag.text.strip() if org_tag else "기관명 없음"

        # 상세 링크
        link_tag = card.select_one("a.image-link")
        link = "https://linkareer.com" + link_tag["href"] if link_tag else "링크없음"

        # D-day
        dday_tag = card.select_one(".SecondInfoText__StyledWrapper-sc-3b26042c-0 div")
        dday = dday_tag.text.strip() if dday_tag else "정보없음"

        # 포스터 이미지 URL
        img_tag = card.select_one("img.activity-image")
        img_url = img_tag["src"] if img_tag else None

        # 포스터 다운로드
        poster_filename = "없음"
        if img_url:
            try:
                response = requests.get(img_url, timeout=10, headers={
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
                })
                poster_filename = f"posters/poster_{i}.jpg"
                with open(poster_filename, "wb") as f:
                    f.write(response.content)
                print(f"  🖼️ [{i}] 포스터 저장: {poster_filename}")
            except Exception as e:
                print(f"  ❌ [{i}] 포스터 다운로드 실패: {e}")

        all_contests.append({
            "순번": i,
            "디데이": dday,
            "공모전명": title,
            "주최기관": organization,
            "상세링크": link,
            "포스터URL": img_url or "없음",
            "포스터파일": poster_filename,
        })

    # CSV 저장
    df = pd.DataFrame(all_contests)
    df.to_csv("linkareer_contests.csv", index=False, encoding="utf-8-sig")
    print(f"\n🎉 완료! {len(df)}개 공모전 → linkareer_contests.csv 저장")
    print(df[["순번", "디데이", "공모전명", "주최기관"]].to_string())
    return df

if __name__ == "__main__":
    parse_linkareer_html()
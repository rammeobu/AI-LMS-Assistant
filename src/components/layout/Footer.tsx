"use client";
import { Compass } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer
      className="border-t"
      style={{
        background: "rgba(10, 11, 20, 0.9)",
        borderColor: "rgba(124, 58, 237, 0.1)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                }}
              >
                <Compass className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold gradient-text">
                AI Career Navigator
              </span>
            </Link>
            <p className="text-sm" style={{ color: "#6b7280" }}>
              AI가 분석하는 맞춤형
              <br />
              커리어 성장 플랫폼
            </p>
          </div>

          {/* Links */}
          <div>
            <h4
              className="font-semibold text-sm mb-4"
              style={{ color: "#e8eaf6" }}
            >
              서비스
            </h4>
            <div className="space-y-2">
              {["AI 분석", "맞춤 추천", "학습 로드맵", "인턴십 가이드"].map(
                (item) => (
                  <p
                    key={item}
                    className="text-sm cursor-pointer hover:text-white transition-colors"
                    style={{ color: "#6b7280" }}
                  >
                    {item}
                  </p>
                )
              )}
            </div>
          </div>

          <div>
            <h4
              className="font-semibold text-sm mb-4"
              style={{ color: "#e8eaf6" }}
            >
              커뮤니티
            </h4>
            <div className="space-y-2">
              {["팀원 모집", "공모전 정보", "스터디 모집", "멘토링"].map(
                (item) => (
                  <p
                    key={item}
                    className="text-sm cursor-pointer hover:text-white transition-colors"
                    style={{ color: "#6b7280" }}
                  >
                    {item}
                  </p>
                )
              )}
            </div>
          </div>

          <div>
            <h4
              className="font-semibold text-sm mb-4"
              style={{ color: "#e8eaf6" }}
            >
              지원
            </h4>
            <div className="space-y-2">
              {["자주 묻는 질문", "이용약관", "개인정보처리방침", "문의하기"].map(
                (item) => (
                  <p
                    key={item}
                    className="text-sm cursor-pointer hover:text-white transition-colors"
                    style={{ color: "#6b7280" }}
                  >
                    {item}
                  </p>
                )
              )}
            </div>
          </div>
        </div>

        <div
          className="mt-10 pt-6 border-t flex flex-col sm:flex-row justify-between items-center gap-4"
          style={{ borderColor: "rgba(124, 58, 237, 0.1)" }}
        >
          <p className="text-xs" style={{ color: "#4b5563" }}>
            © 2026 AI Career Navigator. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            {/* Github icon removed */}
          </div>
        </div>
      </div>
    </footer>
  );
}

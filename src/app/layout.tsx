import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "AI Career Navigator - AI 기반 커리어 포트폴리오 분석 플랫폼",
  description:
    "AI가 포트폴리오를 분석해 부족한 역량을 진단하고, 대외활동·자격증·공모전·학습 계획까지 추천해주는 대학생 맞춤형 커리어 성장 플랫폼",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-grid">
        {/* Background blobs */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div
            className="blob absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: "rgba(124, 58, 237, 0.3)" }}
          />
          <div
            className="blob absolute top-1/3 -right-40 w-96 h-96 rounded-full opacity-15 blur-3xl"
            style={{
              background: "rgba(6, 182, 212, 0.3)",
              animationDelay: "2s",
            }}
          />
          <div
            className="blob absolute -bottom-40 left-1/3 w-96 h-96 rounded-full opacity-10 blur-3xl"
            style={{
              background: "rgba(79, 70, 229, 0.3)",
              animationDelay: "4s",
            }}
          />
        </div>

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-1 pt-16">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}

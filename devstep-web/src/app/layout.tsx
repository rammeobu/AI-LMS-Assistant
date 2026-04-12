import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Suspense } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "DevStep | AI Career Navigator",
  description: "데이터로 설계하고 AI로 가이드하는 전공 맞춤형 커리어 로드맵",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} font-sans antialiased bg-[#F8FAFC]`}
      >
        <Suspense fallback={null}>
          <Navbar />
        </Suspense>
        <main className="min-h-screen pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}

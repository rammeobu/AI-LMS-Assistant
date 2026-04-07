"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  User,
  FileText,
  Brain,
  Sparkles,
  Map,
  Briefcase,
  Calendar,
  Users,
  Menu,
  X,
  Compass,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/profile", label: "프로필", icon: User },
  { href: "/portfolio", label: "포트폴리오", icon: FileText },
  { href: "/analysis", label: "AI 분석", icon: Brain },
  { href: "/recommendations", label: "맞춤 추천", icon: Sparkles },
  { href: "/roadmap", label: "학습 로드맵", icon: Map },
  { href: "/internship", label: "인턴십 가이드", icon: Briefcase },
  { href: "/calendar", label: "캘린더", icon: Calendar },
  { href: "/team", label: "팀원 모집", icon: Users },
];

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isLanding = pathname === "/";

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(10, 11, 20, 0.85)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(124, 58, 237, 0.1)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                }}
              >
                <Compass className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-lg gradient-text hidden sm:block">
                AI Career Navigator
              </span>
            </Link>

            {/* Desktop Nav */}
            {!isLanding && (
              <div className="hidden lg:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      style={{
                        color: isActive ? "#7c3aed" : "#9ca3af",
                        background: isActive
                          ? "rgba(124, 58, 237, 0.1)"
                          : "transparent",
                      }}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            )}

            {/* Right side */}
            <div className="flex items-center gap-3">
              {isLanding ? (
                <>
                  <Link
                    href="/dashboard"
                    className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200"
                    style={{ color: "#9ca3af" }}
                  >
                    내 커리어 보기
                  </Link>
                  <Link href="/dashboard" className="btn-gradient text-sm px-4 py-2">
                    빠른 시작
                  </Link>
                </>
              ) : (
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                    style={{
                      background: "linear-gradient(135deg, #7c3aed, #06b6d4)",
                    }}
                  >
                    김
                  </div>
                </div>
              )}

              {/* Mobile menu button */}
              {!isLanding && (
                <button
                  onClick={() => setMobileOpen(!mobileOpen)}
                  className="lg:hidden p-2 rounded-lg"
                  style={{ color: "#9ca3af" }}
                >
                  {mobileOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Nav Overlay */}
      {mobileOpen && !isLanding && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(10, 11, 20, 0.95)", paddingTop: "64px" }}
        >
          <div className="p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all duration-200"
                  style={{
                    color: isActive ? "#7c3aed" : "#9ca3af",
                    background: isActive
                      ? "rgba(124, 58, 237, 0.1)"
                      : "transparent",
                  }}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

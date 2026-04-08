"use client";

import Link from "next/link";
import { User, Activity, Map, Users, LayoutDashboard, Calendar } from "lucide-react";
import { useSearchParams, usePathname } from "next/navigation";

export default function Navbar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  // Dashboard 진입 시 기본값 처리
  const currentTab = searchParams?.get("tab") || (pathname?.startsWith("/dashboard") ? "dashboard" : "");

  const navItems = [
    { id: "dashboard", label: "내 대시보드", icon: LayoutDashboard, href: "/dashboard?tab=dashboard" },
    { id: "feed", label: "추천 활동 피드", icon: Activity, href: "/dashboard?tab=feed" },
    { id: "roadmap", label: "직무 로드맵", icon: Map, href: "/dashboard?tab=roadmap" },
    { id: "calendar", label: "스마트 캘린더", icon: Calendar, href: "/dashboard?tab=calendar" },
  ];

  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-outfit font-bold text-xl">
                D
              </div>
              <span className="font-outfit font-bold text-xl tracking-tight text-foreground">
                DevStep
              </span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-1 lg:space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              return (
                <Link 
                  key={item.id} 
                  href={item.href} 
                  className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm transition-all duration-200 select-none ${
                    isActive 
                      ? "bg-gray-100/70 text-primary font-bold shadow-inner ring-1 ring-gray-200/50 translate-y-[1px]" 
                      : "text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-gray-400"}`} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
          
          <div className="flex items-center space-x-4">
            <Link href="/dashboard?tab=settings">
              <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
                currentTab === "settings" 
                  ? "bg-gray-100/70 border-gray-200/50 text-primary shadow-inner ring-1 ring-gray-200/50 translate-y-[1px]" 
                  : "bg-secondary border-border text-muted-foreground hover:bg-primary/10 hover:text-primary"
              }`}>
                <User className={`w-5 h-5 ${currentTab === "settings" ? "text-primary" : ""}`} />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

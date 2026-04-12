"use client";

import Link from "next/link";
import { User, Activity, Map, LayoutDashboard, Calendar, LogOut, Sparkles, Zap } from "lucide-react";
import { useSearchParams, usePathname, useRouter } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { createClient } from "@/utils/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";

function NavbarContent() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  
  // 초기 세션 확인 및 상태 구독
  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  // Dashboard 진입 시 기본값 처리
  const currentTab = searchParams?.get("tab") || (pathname?.startsWith("/dashboard") ? "dashboard" : "");

  const navItems = [
    { id: "dashboard", label: "내 대시보드", icon: LayoutDashboard, href: "/dashboard?tab=dashboard" },
    { id: "feed", label: "추천 활동 피드", icon: Activity, href: "/dashboard?tab=feed" },
    { id: "roadmap", label: "직무 로드맵", icon: Map, href: "/dashboard?tab=roadmap" },
    { id: "calendar", label: "스마트 캘린더", icon: Calendar, href: "/dashboard?tab=calendar" },
  ];

  // 로그아웃 핸들러
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.refresh();
    router.push('/');
  };

  return (
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
      
      <div className="flex items-center space-x-3 lg:space-x-4">
        <Link href="/dashboard?tab=roadmap" className="hidden lg:flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all shadow-sm group">
          <Sparkles className="w-4 h-4 text-primary group-hover:animate-pulse" />
          나만의 로드맵 추천
        </Link>

        <Link href="/setup/point-a" className="hidden lg:flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-white bg-primary rounded-xl hover:bg-primary/90 transition-all shadow-md shadow-primary/20 group">
          <Zap className="w-4 h-4 fill-white group-hover:animate-bounce" />
          커리어 정밀 진단
        </Link>

        {user ? (
          <button 
            onClick={handleSignOut}
            className="hidden sm:flex items-center justify-center gap-2 px-4 py-2 text-sm font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-xl hover:bg-rose-100 transition-colors shadow-sm"
          >
            <LogOut className="w-4 h-4" />
            로그아웃
          </button>
        ) : (
          <Link href="/login" className="hidden sm:flex items-center justify-center px-4 py-2 text-sm font-bold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
            로그인
          </Link>
        )}
        
        <Link href={user ? "/settings/profile" : "/login"}>
          <div className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
            currentTab === "settings" 
              ? "bg-gray-100/70 border-gray-200/50 text-primary shadow-inner ring-1 ring-gray-200/50 translate-y-[1px]" 
              : "bg-secondary border-border text-muted-foreground hover:bg-primary/10 hover:text-primary"
          }`}>
            {user?.user_metadata?.avatar_url ? (
              <img src={user.user_metadata.avatar_url} alt="profile" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className={`w-5 h-5 ${currentTab === "settings" ? "text-primary" : ""}`} />
            )}
          </div>
        </Link>
      </div>
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="fixed top-0 w-full z-50 glass border-b border-gray-100/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<div className="h-16 flex items-center justify-center"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
          <NavbarContent />
        </Suspense>
      </div>
    </header>
  );
}

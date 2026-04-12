"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Activity, LayoutDashboard, Map, Settings, Users, Calendar } from "lucide-react";
import { Suspense } from "react";

function SidebarContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  const navItems = [
    { name: "My Dashboard", id: "dashboard", icon: LayoutDashboard },
    { name: "Discovery Feed", id: "feed", icon: Activity },
    { name: "Roadmap Pathfinder", id: "roadmap", icon: Map },
    { name: "Team-up Board", id: "team", icon: Users },
    { name: "Calendar Sync", id: "calendar", icon: Calendar },
    { name: "Settings", id: "settings", icon: Settings },
  ];

  return (
    <aside className="w-64 fixed left-0 top-16 h-[calc(100vh-4rem)] border-r border-gray-100 bg-white/50 backdrop-blur-md z-40 hidden lg:block">
      <div className="p-6 h-full flex flex-col gap-2">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Modules</h2>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <Link
              key={item.id}
              href={`/dashboard?tab=${item.id}`}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm ${
                isActive 
                  ? "bg-primary text-white shadow-sm" 
                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
              }`}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
        
        <div className="mt-auto">
          <div className="p-4 bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-2xl border border-primary/10">
            <h3 className="text-sm font-semibold text-gray-900 mb-1">활동 가능 지수 (AIx)</h3>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2 mt-3">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: "70%" }}></div>
            </div>
            <p className="text-xs text-gray-500">이번 달 가용 여력 70%로 양호합니다.</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default function Sidebar() {
  return (
    <Suspense fallback={<div className="w-64 fixed left-0 top-16 h-full border-r border-gray-100 bg-white/50" />}>
      <SidebarContent />
    </Suspense>
  );
}

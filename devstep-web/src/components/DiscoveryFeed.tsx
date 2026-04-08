"use client";

import { Calendar, Search, Star, Filter, LayoutList, LayoutGrid, Brain } from "lucide-react";
import { useState } from "react";
import ActivityDetailDrawer from "./ActivityDetailDrawer";

export default function DiscoveryFeed() {
  const [viewMode, setViewMode] = useState<"card" | "poster">("card");
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleCardClick = (item: any) => {
    setSelectedActivity(item);
    setIsDrawerOpen(true);
  };

  const dummyFeed = Array.from({ length: 9 }).map((_, i) => ({
    status: i % 4 === 0 ? "마감 임박" : "모집중",
    category: i % 2 === 0 ? "정부지원" : "부트캠프",
    statusColor: i % 4 === 0 ? "bg-red-100 text-red-700" : "bg-emerald-100 text-emerald-700",
    title: i === 0 ? "SW마에스트로 17기" : `2026 ${i % 3 === 0 ? "우아한테크코스" : "Naver D2 스터디"} 멤버 모집`,
    subtitle: i === 0 ? "과학기술정보통신부 주관 최고급 소프트웨어 인재 양성 프로그램" : "기초부터 실무까지 탄탄하게 다지는 개발자 심화 과정",
    period: "2026.06 - 2026.11",
    skills: ["팀 프로젝트", "멘토링", i % 2 === 0 ? "창업" : "네트워킹", "알고리즘"].slice(0, 3 + (i % 2)),
    aiComment: i === 0 ? "체계적인 멘토링과 팀 프로젝트 역량을 폭발적으로 성장시킬 수 있습니다" : "현재 부족한 '실무 협업' 역량을 채워줄 AI 강력 추천 활동입니다",
    points: `+${(i+1)*5}%`,
    duration: i % 4 === 0 ? "마감 임박" : "상시 모집",
    tag: i % 2 === 0 ? "보완: 백엔드" : "강점 강화",
    // Fallback beautiful gradients for poster view
    gradient: `linear-gradient(135deg, ${
      ["#f6d365, #fda085", "#84fab0, #8fd3f4", "#a18cd1, #fbc2eb", "#fbc2eb, #a6c1ee", "#cfd9df, #e2ebf0"][i % 5]
    })`
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end w-full mb-2">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="활동 검색..." 
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex gap-1 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200 shrink-0">
            <button 
              onClick={() => setViewMode("card")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'card' 
                ? 'bg-white shadow-sm text-primary' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200/50'
              }`}
              title="카드형 보기"
            >
              <LayoutList className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setViewMode("poster")}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'poster' 
                ? 'bg-white shadow-sm text-primary' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-200/50'
              }`}
              title="포스터형 보기"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <button className="flex items-center gap-1.5 px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-semibold shrink-0">
          <Filter className="w-4 h-4" /> 전체
        </button>
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-semibold shrink-0 transition-colors">
          부족 역량 보완(AI 추천)
        </button>
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-semibold shrink-0 transition-colors">
          자격증 공모
        </button>
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 rounded-full text-sm font-semibold shrink-0 transition-colors">
          해커톤/대외활동
        </button>
      </div>

      <div className={`grid gap-5 transition-all ${
        viewMode === "card" 
          ? "grid-cols-1 lg:grid-cols-2" 
          : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
      }`}>
        {dummyFeed.map((item, i) => (
          <div 
            key={i} 
            onClick={() => handleCardClick(item)}
            className={`glass-card group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 relative flex flex-col overflow-hidden ${
              viewMode === 'poster' ? 'h-[320px] p-0' : 'p-6 h-full gap-3'
            }`}
          >
            
            {/* Poster Mode Styling */}
            {viewMode === "poster" && (
              <>
                <div className="h-44 w-full relative flex-shrink-0" style={{ background: item.gradient }}>
                   <div className="absolute top-3 right-3 text-white drop-shadow-md">
                     <button className="hover:scale-110 transition-transform"><Star className="w-5 h-5 fill-white/20" /></button>
                   </div>
                   <span className={`absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-black w-fit bg-white/95 shadow-sm text-gray-800`}>
                     {item.tag}
                   </span>
                </div>
                <div className="flex flex-col flex-1 p-4 bg-white/50">
                  <h3 className="font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors text-sm mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="mt-auto flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> {item.duration}
                    </span>
                    <span className="text-xs font-extrabold text-primary">{item.points}</span>
                  </div>
                </div>
              </>
            )}

            {/* Card Mode Styling (Detailed List) */}
            {viewMode === "card" && (
              <>
                <div className="absolute top-5 right-5">
                  <button className="text-gray-300 hover:text-yellow-400 transition-colors"><Star className="w-6 h-6" /></button>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${item.statusColor}`}>
                    {item.status}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">{item.category}</span>
                </div>
                
                <div>
                  <h3 className="font-extrabold text-xl text-gray-900 mb-1.5 leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium mb-3">
                    {item.subtitle}
                  </p>
                  <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5 mb-4">
                    기간: {item.period}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {item.skills.map((skill, idx) => (
                    <span key={idx} className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100">
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 relative">
                  <div className="bg-primary/5 rounded-xl p-3 flex items-center gap-2.5 border border-primary/10">
                    <Brain className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-xs text-primary font-bold tracking-tight">{item.aiComment}</p>
                  </div>
                </div>
              </>
            )}

          </div>
        ))}
      </div>

      <ActivityDetailDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
        activity={selectedActivity} 
      />
    </div>
  );
}

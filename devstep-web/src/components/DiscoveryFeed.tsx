"use client";

import { Calendar, Search, Star, Filter } from "lucide-react";

export default function DiscoveryFeed() {
  const dummyFeed = Array.from({ length: 9 }).map((_, i) => ({
    tag: i % 2 === 0 ? "보완: 백엔드" : "강점 강화",
    tagColor: i % 2 === 0 ? "bg-orange-100 text-orange-700" : "bg-green-100 text-green-700",
    title: `[IT] 2026 ${i%3 === 0 ? "해커톤" : "스프링 스터디"} 멤버 모집`,
    duration: i % 4 === 0 ? "마감 임박" : "상시 모집",
    points: `+${(i+1)*5}%`,
    targetStack: "Spring Boot, MySQL",
  }));

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">맞춤형 추천 피드</h1>
          <p className="text-gray-500 mt-2 font-medium">나의 빈틈을 채워줄 최적의 활동을 탐색하세요.</p>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="활동 검색..." 
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
        </div>
      </header>

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dummyFeed.map((item, i) => (
          <div key={i} className="glass-card p-5 group cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 relative flex flex-col h-full">
            <div className="absolute top-4 right-4">
               <button className="text-gray-300 hover:text-red-400 transition-colors"><Star className="w-5 h-5" /></button>
            </div>
            <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold w-fit mb-3 ${item.tagColor}`}>
              {item.tag}
            </span>
            <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight pr-6 group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
            <p className="text-sm text-gray-500 mb-4 font-medium">{item.targetStack}</p>
            
            <div className="mt-auto">
              <div className="w-full h-[1px] bg-gray-100 mb-4" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4" /> {item.duration}
                </span>
                <span className="text-sm font-extrabold text-primary">{item.points} 역량 예상</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

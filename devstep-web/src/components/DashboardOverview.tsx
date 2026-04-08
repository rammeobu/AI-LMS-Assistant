"use client";

import { ChevronRight, Clock, Zap, CheckCircle2, Flame, ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function DashboardOverview() {
  const [todos, setTodos] = useState([
    { id: 1, text: "오전 10시 정보처리기사 실기 기출 풀기", completed: true },
    { id: 2, text: "Next.js 프로젝트 Vercel 배포 시도", completed: false },
    { id: 3, text: "GitHub 1일 1커밋 필수 방어", completed: false },
    { id: 4, text: "저녁 8시 팀 미팅 참여", completed: false },
  ]);

  const toggleTodo = (id: number) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const timelineCategories = [
    {
      title: "프론트엔드 역량 강화",
      tasks: [
        { name: "Next.js App Router 도입 검토", start: 0, duration: 20, type: "research" },
        { name: "상태관리(Zustand) 리팩토링", start: 22, duration: 25, type: "ongoing" },
        { name: "렌더링 성능 최적화", start: 50, duration: 30, type: "planned" },
      ]
    },
    {
      title: "팀 프로젝트 (DevStep)",
      tasks: [
        { name: "핵심 UI/UX 와이어프레임", start: 5, duration: 25, type: "planned" },
        { name: "MVP 프론트엔드 구현", start: 35, duration: 45, type: "ongoing" },
        { name: "사내 알파 테스트", start: 85, duration: 15, type: "customer" },
      ]
    },
    {
      title: "취업 및 커리어 준비",
      tasks: [
        { name: "이력서 및 포트폴리오 초안", start: 0, duration: 18, type: "research" },
        { name: "기업 타겟팅 및 요구사항 분석", start: 20, duration: 30, type: "planned" },
        { name: "공채 지원서 난사", start: 55, duration: 40, type: "ongoing" },
      ]
    }
  ];

  const typeColors: Record<string, string> = {
    research: "bg-teal-400",
    ongoing: "bg-indigo-500",
    planned: "bg-blue-400",
    customer: "bg-purple-500"
  };

  const upcomingTasks = [
    { id: 1, title: "정보처리기사 실기 접수", dday: "D-2", date: "4.10(수)", type: "자격증", color: "bg-orange-100 text-orange-700" },
    { id: 2, title: "네이버 하계 인턴십 마감", dday: "D-5", date: "4.13(토)", type: "인턴십", color: "bg-green-100 text-green-700" },
    { id: 3, title: "포트폴리오 프로젝트 마감", dday: "D-14", date: "4.22(월)", type: "프로젝트", color: "bg-purple-100 text-purple-700" },
  ];

  // Stable Dummy Heatmap Data (24 weeks x 7 days = 168 days)
  const heatmapData = Array.from({ length: 168 }).map((_, i) => {
    const todayIndex = 167;
    const distance = todayIndex - i;
    if (distance === 0) return 3; // Today
    if (distance < 7) return ((i * 7) % 3) + 1; // Recent activity
    if (distance > 120) return 0; // Less activity in far past
    
    // Pseudo-random but pure formula using index to avoid impurities during render
    const pseudoRandom = (i * 137 + 19) % 100;
    return pseudoRandom > 60 ? (pseudoRandom % 4) : 0;
  });

  return (
    <div className="flex flex-col gap-6 lg:gap-8">


      {/* 1. Streak Banner (Option B: Heatmap style) */}
      <section className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden">
        <div className="flex items-center gap-6">
          <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Flame className="w-8 h-8 text-orange-500" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">DevStep과 함께한 지 45일째!</h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">현재 연속 <strong className="text-orange-500 font-extrabold">14일째</strong> 성장 중입니다. 오늘도 잔디를 심어보세요.</p>
          </div>
        </div>

        {/* Mini Github-style Heatmap */}
        <div className="flex flex-col items-end gap-2 shrink-0 max-w-full overflow-x-auto pb-1 scrollbar-hide">
          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {heatmapData.map((level, idx) => (
              <div 
                key={idx} 
                className={`w-3 h-3 rounded-sm ${
                  level === 0 ? "bg-gray-100" :
                  level === 1 ? "bg-green-200" :
                  level === 2 ? "bg-green-400" :
                  "bg-green-600"
                }`}
                title={`Level ${level}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider mt-1">
            <span>Less</span>
            <div className="flex gap-1">
              <div className="w-2.5 h-2.5 rounded-sm bg-gray-100" />
              <div className="w-2.5 h-2.5 rounded-sm bg-green-200" />
              <div className="w-2.5 h-2.5 rounded-sm bg-green-400" />
              <div className="w-2.5 h-2.5 rounded-sm bg-green-600" />
            </div>
            <span>More</span>
          </div>
        </div>
      </section>

      {/* 2. Middle Section: Schedules vs To-Do */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Ongoing Schedules Widget */}
        <section className="glass-card p-6 flex flex-col relative overflow-hidden min-h-[400px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> 진행 중인 핵심 일정
            </h2>
            <Link href="/dashboard?tab=calendar" className="text-sm font-semibold text-primary hover:underline flex items-center">
              전체 보기 <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>
          
          <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 min-h-0">
            {upcomingTasks.map(task => (
              <div key={task.id} className="flex flex-col p-4 bg-[#F8FAFC]/70 border border-gray-100 rounded-2xl flex-shrink-0 hover:shadow-sm transition-all hover:-translate-y-0.5 relative group">
                <div className="absolute right-4 top-4 text-xs font-black text-red-500 bg-red-50 px-2 py-0.5 rounded-full ring-1 ring-red-100">
                  {task.dday}
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${task.color}`}>
                    {task.type}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 truncate mb-1.5 text-sm">{task.title}</h3>
                <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {task.date} 마감
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Right: Today's To-Do Checklist */}
        <section className="glass-card p-6 flex flex-col relative overflow-hidden min-h-[400px]">
          <div className="flex items-center justify-between mb-5 shrink-0">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> 오늘의 액션 플랜
            </h2>
            <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-full">
              {todos.filter(t => t.completed).length} / {todos.length} 완료
            </span>
          </div>

          <div className="flex flex-col gap-2.5 overflow-y-auto pr-1 flex-1 min-h-0 mb-4">
            {todos.map(todo => (
              <div 
                key={todo.id} 
                onClick={() => toggleTodo(todo.id)}
                className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  todo.completed 
                    ? "bg-gray-50/80 border-transparent shadow-none" 
                    : "bg-white border-primary/20 hover:border-primary/40 shadow-[0_2px_10px_rgba(85,82,250,0.03)]"
                }`}
              >
                <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                  todo.completed ? "bg-primary border-primary" : "border-gray-300 bg-white"
                }`}>
                  {todo.completed && <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </div>
                <span className={`text-sm font-semibold transition-all select-none ${
                  todo.completed ? "text-gray-400 line-through" : "text-gray-700"
                }`}>
                  {todo.text}
                </span>
              </div>
            ))}
          </div>
          
          <div className="mt-auto pt-4 shrink-0">
            <button className="w-full py-2.5 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-dashed border-gray-300">
               새로운 할 일 추가하기
            </button>
          </div>
        </section>
      </div>

      {/* 3. Bottom Section: Gantt Chart Timeline (Replaced Radar & Gap) */}
      <section className="glass-card flex flex-col relative overflow-hidden mt-2 border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-white flex-wrap gap-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            내 커리어 타임라인 <span className="text-xs text-gray-500 font-medium bg-gray-50 px-2 py-1 rounded-md border">Gantt View</span>
          </h2>
          <div className="flex items-center gap-5 text-xs font-bold text-gray-600">
            <span className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-sm flex-shrink-0 bg-teal-400" /> Research</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-sm flex-shrink-0 bg-blue-400" /> Planned</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-sm flex-shrink-0 bg-indigo-500" /> Ongoing</span>
            <span className="flex items-center gap-1.5"><div className="w-3 h-1.5 rounded-sm flex-shrink-0 bg-purple-500" /> Customer Value</span>
          </div>
        </div>

        <div className="flex flex-col relative w-full overflow-x-auto bg-white scrollbar-hide">
          <div className="min-w-[800px] w-full pb-8">
            {/* Time Grid Header */}
            <div className="flex w-full ml-[220px] h-12 relative border-b border-gray-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex-1 border-l border-gray-100 h-full relative">
                  <span className="absolute -left-6 top-3 text-xs font-extrabold text-gray-400 bg-white px-2">Week {i + 1}</span>
                </div>
              ))}
              {/* Today / Milestone Marker */}
              <div className="absolute left-[45%] top-0 h-[360px] border-l border-red-500 z-0">
                <div className="absolute -top-4 -translate-x-1/2 bg-red-500 text-white text-[10px] font-bold px-2.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                  Go Live (Mar 31)
                </div>
              </div>
            </div>

            {/* Timeline Rows */}
            {timelineCategories.map((cat, idx) => (
              <div key={idx} className="flex w-full border-b border-gray-100 relative group min-h-[100px]">
                {/* Category Title Left Bar */}
                <div className="w-[220px] flex-shrink-0 bg-gray-50 p-4 border-r border-gray-100 flex items-start gap-2">
                  <ChevronDown className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span className="text-sm font-bold text-gray-800 break-keep leading-tight">{cat.title}</span>
                </div>
                
                {/* Timeline Graph Area */}
                <div className="flex-1 relative py-4 mr-6">
                  {/* Background vertical grid lines */}
                  <div className="absolute inset-0 flex">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex-1 border-l border-gray-50 h-full" />
                    ))}
                  </div>
                  
                  {/* Task Bars */}
                  <div className="relative w-full h-full">
                    {cat.tasks.map((task, tIdx) => (
                      <div 
                        key={tIdx}
                        className="absolute h-[18px] rounded cursor-pointer transition-all hover:brightness-110 hover:shadow-md flex items-center"
                        style={{ 
                          left: `${task.start}%`, 
                          width: `${task.duration}%`,
                          top: `${(tIdx * 32)}px`,
                        }}
                      >
                        <div className={`w-full h-[6px] rounded-full ${typeColors[task.type]}`} />
                        <span className="absolute -top-4 left-0 text-[11px] font-bold text-gray-800 whitespace-nowrap bg-white/80 px-1 rounded-sm leading-none">
                          {task.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

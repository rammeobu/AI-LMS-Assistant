"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle, Calendar as CalendarIcon, Clock, Sparkles } from "lucide-react";

export default function CalendarSync() {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = Array.from({ length: 35 }).map((_, i) => i - 2); 
  
  // Set default selection to a high-conflict date (the 21st) to demonstrate AI feature
  const [selectedDate, setSelectedDate] = useState(21);

  // High-density dummy events reflecting DevStep's core value (school vs career)
  const dummyEvents = [
    { date: 4, type: "roadmap", title: "정보처리기사 필기시험 접수", time: "18:00", tag: "자격증", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    { date: 10, type: "academic", title: "소프트웨어 공학 조별 과제 D-Day", time: "23:59", tag: "학교과제", color: "bg-red-100 text-red-700 border-red-200" },
    { date: 12, type: "career", title: "네이버 웨일톤 서류 지원 마감", time: "17:00", tag: "해커톤", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { date: 20, type: "academic", title: "전공필수: 데이터베이스 중간고사", time: "10:00", tag: "학교시험", color: "bg-red-100 text-red-700 border-red-200" },
    { date: 21, type: "academic", title: "전공필수: 알고리즘 설계 중간고사", time: "13:00", tag: "학교시험", color: "bg-red-100 text-red-700 border-red-200" },
    { date: 21, type: "career", title: "카카오 채용연계형 인턴 코딩테스트", time: "14:00", tag: "코딩테스트", color: "bg-blue-100 text-blue-700 border-blue-200" },
    { date: 25, type: "roadmap", title: "스프링 코어 개념 완강 & 블로그 포스팅", time: "자율", tag: "학습목표", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
  ];

  const getEventsForDate = (day: number) => dummyEvents.filter(e => e.date === day);
  const selectedEvents = getEventsForDate(selectedDate);
  
  // Determine if AI needs to warn about schedule conflict (E.g. Exam + Career on same day)
  const hasAcademic = selectedEvents.some(e => e.type === "academic");
  const hasCareerOrRoadmap = selectedEvents.some(e => e.type === "career" || e.type === "roadmap");
  const hasConflict = hasAcademic && hasCareerOrRoadmap;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 h-full animate-in fade-in duration-500">
      
      {/* Container: Master - Detail Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[650px] items-start">
        
        {/* LEFT COMPONENT: Calendar Grid (Master) */}
        <div className="lg:col-span-2 glass-card p-6 md:p-8 flex flex-col h-full shadow-sm relative w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                <CalendarIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">2026년 4월</h2>
                <span className="text-xs font-bold text-gray-500">대학교 중간고사 기간</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
              <button className="text-sm font-bold px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">오늘</button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><ChevronRight className="w-5 h-5 text-gray-500" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 flex-1">
            {weekDays.map((day, idx) => (
              <div key={day} className={`bg-gray-50/80 py-3 text-center text-xs font-extrabold uppercase ${idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : "text-gray-400"}`}>
                {day}
              </div>
            ))}
            
            {days.map((date, i) => {
              const events = getEventsForDate(date);
              const isToday = date === 7;
              const isSelected = selectedDate === date;
              const isValidDate = date > 0 && date <= 30; // April has 30 days
              const displayDate = !isValidDate ? (date <= 0 ? 31 + date : date - 30) : date;

              return (
                <div 
                  key={i} 
                  onClick={() => isValidDate && setSelectedDate(date)}
                  className={`bg-white min-h-[110px] p-2 flex flex-col transition-colors border-[2px] ${
                    isSelected ? "border-primary bg-primary/5 z-10 shadow-sm" : "border-transparent hover:bg-gray-50 cursor-pointer"
                  } ${!isValidDate ? "opacity-40 pointer-events-none" : ""}`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors ${
                      isToday ? "bg-primary text-white shadow-md" : 
                      isSelected ? "text-primary" : "text-gray-700"
                    }`}>
                      {displayDate}
                    </span>
                    {events.length > 0 && (
                      <span className="text-[10px] font-bold text-gray-400">{events.length}개</span>
                    )}
                  </div>
                  
                  {/* Event Badges Rendering */}
                  <div className="flex flex-col gap-1.5 mt-auto">
                    {events.slice(0, 3).map((ev, idx) => (
                       <div key={idx} className={`text-[10px] font-extrabold px-1.5 py-1 rounded truncate border ${ev.color}`}>
                         {ev.title}
                       </div>
                    ))}
                    {events.length > 3 && (
                       <div className="text-[10px] font-bold bg-gray-100 text-gray-500 px-1 py-0.5 rounded text-center">
                         +{events.length - 3} 더보기
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COMPONENT: Agenda & AI Briefing (Detail) */}
        <div className="lg:col-span-1 h-full flex flex-col gap-4">
          
          {/* Selected Date Header */}
          <div className="glass-card p-6 bg-gray-900 border-none shadow-md overflow-hidden relative">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-[50px] opacity-20 rounded-full" />
             <span className="text-primary font-bold text-xs bg-primary/20 px-2 py-1 rounded tracking-wide inline-block mb-3">Daily Agenda</span>
             <h3 className="text-3xl font-extrabold text-white mb-1 tracking-tight">4월 {selectedDate}일</h3>
             <p className="text-gray-400 text-sm font-medium">{selectedEvents.length === 0 ? "등록된 일정이 없습니다." : `오늘 총 ${selectedEvents.length}개의 주요 일정이 있습니다.`}</p>
          </div>

          {/* AI Conflict Briefing Panel */}
          {hasConflict && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-5 shadow-sm animate-in zoom-in-95 duration-300">
               <div className="flex items-center gap-2 mb-3">
                 <AlertTriangle className="w-5 h-5 text-red-500" />
                 <h4 className="font-extrabold text-red-800 text-sm">AI 밸런스 알림</h4>
               </div>
               <p className="text-xs text-red-600 font-medium leading-relaxed bg-white/60 p-3 rounded-xl border border-red-100/50">
                 학교 학사일정(중간고사)과 대외활동 코딩테스트가 같은 날짜에 몰려 있습니다. 극심한 피로도가 예상되므로, 학점 방어를 위해 <strong>다른 스터디나 부차적인 일정은 뒤로 미룰 것</strong>을 강력히 권장합니다.
               </p>
            </div>
          )}

          {/* Events List for Selected Date */}
          <div className="glass-card p-6 flex-1 border border-gray-100 shadow-sm flex flex-col">
             <div className="flex justify-between items-center mb-6">
                <h4 className="font-bold text-gray-900 text-base">스케줄 타임라인</h4>
                <button className="text-xs font-bold text-primary hover:underline">일정 추가하기</button>
             </div>

             {selectedEvents.length > 0 ? (
               <div className="relative flex flex-col gap-5">
                 {/* Connecting line */}
                 <div className="absolute left-[9px] top-4 bottom-4 w-[2px] bg-gray-100 z-0" />
                 
                 {selectedEvents.map((ev, idx) => (
                    <div key={idx} className="relative z-10 flex gap-4 animate-in slide-in-from-right-4 duration-300 group">
                       <div className="mt-1">
                          <div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm flex items-center justify-center ${ev.type === "academic" ? "bg-red-500" : ev.type === "career" ? "bg-blue-500" : "bg-emerald-500"}`} />
                       </div>
                       <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-4 group-hover:bg-white group-hover:shadow-md transition-all">
                          <div className="flex justify-between items-start mb-2">
                             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.color}`}>
                               {ev.tag}
                             </span>
                             <span className="flex items-center gap-1 text-[11px] font-bold text-gray-400">
                               <Clock className="w-3.5 h-3.5" /> {ev.time}
                             </span>
                          </div>
                          <h5 className="font-bold text-gray-900 text-sm leading-snug">{ev.title}</h5>
                       </div>
                    </div>
                 ))}
               </div>
             ) : (
               <div className="flex flex-col items-center justify-center flex-1 py-10 opacity-60">
                 <Sparkles className="w-10 h-10 text-gray-300 mb-3" />
                 <p className="text-sm font-bold text-gray-400">일정이 없는 날입니다.</p>
                 <p className="text-xs font-medium text-gray-400 mt-1">휴식을 취하거나 가벼운 자율 학습을 추천해요.</p>
               </div>
             )}
          </div>

        </div>
      </div>
    </div>
  );
}

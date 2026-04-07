"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CalendarSync() {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const days = Array.from({ length: 35 }).map((_, i) => i - 2); 
  // simplified mock array for dates
  
  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">학사 일정 & 스마트 캘린더</h1>
          <p className="text-gray-500 mt-2 font-medium">학교 시험 기간과 대외활동 마감일을 고려한 월간 일정을 확인하세요.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3 glass-card p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">2026년 4월</h2>
            <div className="flex gap-2">
              <button className="p-1 px-2 border border-gray-200 rounded-md hover:bg-gray-50"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
              <button className="text-sm font-semibold px-4 border border-gray-200 rounded-md hover:bg-gray-50">Today</button>
              <button className="p-1 px-2 border border-gray-200 rounded-md hover:bg-gray-50"><ChevronRight className="w-5 h-5 text-gray-500" /></button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
            {weekDays.map(day => (
              <div key={day} className="bg-gray-50 py-3 text-center text-xs font-bold text-gray-500 uppercase">
                {day}
              </div>
            ))}
            
            {days.map((date, i) => {
              const isToday = date === 7;
              const isExam = date >= 20 && date <= 25; // mock exam period
              const hasActivity = date === 12;

              return (
                <div key={i} className={`bg-white min-h-[100px] p-2 hover:bg-gray-50 transition-colors ${
                  isExam ? "bg-red-50/50" : ""
                }`}>
                  <span className={`text-sm font-semibold w-7 h-7 flex items-center justify-center rounded-full ${
                    isToday ? "bg-primary text-white" : date < 1 || date > 30 ? "text-gray-300" : "text-gray-700"
                  }`}>
                    {date < 1 ? 31 + date : date > 30 ? date - 30 : date}
                  </span>
                  
                  <div className="mt-2 flex flex-col gap-1">
                    {isExam && date === 20 && (
                      <div className="text-[10px] font-bold bg-red-100 text-red-700 px-1 py-0.5 rounded truncate">
                        🏫 전북대 중간고사 시작
                      </div>
                    )}
                    {hasActivity && (
                      <div className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1 py-0.5 rounded truncate">
                        🎯 네이버 해커톤 마감
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Info Panel */}
        <div className="xl:col-span-1 flex flex-col gap-4">
          <div className="glass-card p-6 border-t-4 border-t-primary">
            <h3 className="font-bold text-gray-900 mb-2">이번 달 활동 가능 지수 (AIx)</h3>
            <p className="text-sm text-gray-500 mb-4">학사 일정을 고려했을 때 이번 달 남은 가용 비중입니다.</p>
            <div className="flex items-end gap-2 mb-2">
              <span className="text-4xl font-extrabold text-gray-900">30%</span>
              <span className="text-sm font-medium text-red-500 font-bold mb-1">▼ 주의 구간</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
              <div className="bg-red-400 h-2 rounded-full" style={{ width: "30%" }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-4 leading-relaxed">
              💡 <strong className="text-gray-700">AI 코멘트:</strong> 4월 20일부터 있는 중간고사 일정으로 인해 새로운 장기 프로젝트 시작을 권장하지 않습니다. 5월을 노려보세요!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

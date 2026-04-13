"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, AlertTriangle, Calendar as CalendarIcon, Clock, Sparkles, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { getAIRecommendations, addActivityToCalendar, getUserCalendar } from "../app/actions/calendarActions";

export default function CalendarSync() {
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  
  // -- State --
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1));
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 3, 21));
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  const formatDateKey = (date: Date | string | null) => {
    if (!date) return "";
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) return "";
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      const [recResult, calResult] = await Promise.all([
        getAIRecommendations(),
        getUserCalendar()
      ]);

      if (recResult.success && recResult.data) {
        setRecommendations(recResult.data);
      }
      
      if (calResult.success && calResult.data) {
        const normalizedEvents = calResult.data.map((item: any) => ({
          ...item,
          fullDate: formatDateKey(item.deadline), // 마감일에 표시
          isSaved: true
        }));
        setCalendarEvents(normalizedEvents);
      }
    } catch (err) {
      console.error("Data loading error:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({ date: daysInPrevMonth - i, isCurrentMonth: false, fullDate: new Date(year, month - 1, daysInPrevMonth - i) });
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ date: i, isCurrentMonth: true, fullDate: new Date(year, month, i) });
    }
    const remainingSlots = 42 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      days.push({ date: i, isCurrentMonth: false, fullDate: new Date(year, month + 1, i) });
    }
    return days;
  };
  const calendarDays = generateCalendarDays();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
    setSelectedDate(today);
  };

  const handleAddToCalendar = async (rec: any) => {
    setIsSyncing(true);
    const { success, error, activityUuid } = await addActivityToCalendar(rec.id);
    setIsSyncing(false);

    if (!success) { alert("캘린더 저장 실패: " + error); return; }

    alert(`"${rec.title}" 활동이 캘린더에 성공적으로 담겼습니다!`);
    
    // UI 반영 (마감일에 표시)
    setRecommendations(prev => prev.filter(r => r.title !== rec.title));
    setCalendarEvents(prev => [...prev, {
      id: activityUuid || rec.id,
      fullDate: rec.raw_end_date || formatDateKey(selectedDate),
      type: "career",
      title: rec.title,
      time: "협의",
      tag: rec.category || "추천",
      isSaved: true,
      color: "bg-purple-100 text-purple-700 border-purple-300 shadow-sm"
    }]);
  };

  const getEventsForDate = (date: Date) => {
    const dStr = formatDateKey(date);
    
    // 1. 저장된 일정 (마감일에만 표시)
    const saved = calendarEvents.filter(e => e.fullDate === dStr).map(e => ({
        ...e,
        color: e.color || "bg-purple-100 text-purple-700 border-purple-300 shadow-sm font-bold",
        tag: e.tag || "학정"
      }));

    const savedTitles = new Set(calendarEvents.map(e => e.title));
    
    // 2. AI 임시 추천 일정 (마감일에만 표시)
    const temporary = recommendations
      .filter(rec => !savedTitles.has(rec.title))
      .filter(rec => {
        const eDay = rec.raw_end_date || "2026-04-25";
        return dStr === eDay;
      })
      .map(rec => ({
        id: rec.id,
        isTemp: true,
        type: "temporary",
        title: "[추천] " + rec.title,
        time: "미정",
        tag: "AI 임시",
        color: "bg-purple-50/80 text-purple-500 border-purple-200 border-dashed border-2 opacity-90",
        rawRec: rec
      }));

    // 3. 고정 더미 데이터
    const dummyEvents = [
      { fullDate: "2026-04-04", type: "roadmap", title: "정보처리기사 필기시험 접수", time: "18:00", tag: "자격증", color: "bg-emerald-100 text-emerald-700 border-emerald-200" },
      { fullDate: "2026-04-10", type: "academic", title: "소프트웨어 공학 조별 과제의 날", time: "23:59", tag: "학교과제", color: "bg-red-100 text-red-700 border-red-200" },
      { fullDate: "2026-04-12", type: "career", title: "네이버 웨일톤 지원 마감", time: "17:00", tag: "해커톤", color: "bg-blue-100 text-blue-700 border-blue-200" },
    ].filter(e => e.fullDate === dStr && !savedTitles.has(e.title));

    return [...saved, ...temporary, ...dummyEvents];
  };

  const selectedEvents = getEventsForDate(selectedDate);
  const hasAcademic = selectedEvents.some(e => e.type === "academic");
  const hasCareerOrRoadmap = selectedEvents.some(e => (e.type === "career" || e.type === "temporary"));
  const hasConflict = hasAcademic && hasCareerOrRoadmap;

  return (
    <div className="flex flex-col gap-6 lg:gap-8 h-full animate-in fade-in duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 min-h-[650px] items-start">
        <div className="lg:col-span-2 glass-card p-6 md:p-8 flex flex-col h-full shadow-sm relative w-full">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
                {isSyncing ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <CalendarIcon className="w-5 h-5 text-white" />}
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월</h2>
                <span className="text-xs font-bold text-gray-500">DevStep AI 캘린더 매칭</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={handlePrevMonth} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><ChevronLeft className="w-5 h-5 text-gray-500" /></button>
              <button onClick={handleToday} className="text-sm font-bold px-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">오늘</button>
              <button onClick={handleNextMonth} className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"><ChevronRight className="w-5 h-5 text-gray-500" /></button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-px bg-gray-100 rounded-2xl overflow-hidden border border-gray-100 flex-1">
            {weekDays.map((day, idx) => (<div key={day} className={`bg-gray-50/80 py-3 text-center text-xs font-extrabold uppercase ${idx === 0 ? "text-red-500" : idx === 6 ? "text-blue-500" : "text-gray-400"}`}>{day}</div>))}
            {calendarDays.map((dayObj, i) => {
              const events = getEventsForDate(dayObj.fullDate);
              const isToday = formatDateKey(dayObj.fullDate) === formatDateKey(new Date());
              const isSelected = formatDateKey(selectedDate) === formatDateKey(dayObj.fullDate);
              return (
                <div key={i} onClick={() => setSelectedDate(dayObj.fullDate)} className={`bg-white min-h-[110px] p-2 flex flex-col transition-colors border-[2px] ${isSelected ? "border-primary bg-primary/5 z-10 shadow-sm" : "border-transparent hover:bg-gray-50 cursor-pointer"} ${!dayObj.isCurrentMonth ? "opacity-30 bg-gray-50/30" : ""}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-sm font-bold w-7 h-7 flex items-center justify-center rounded-full transition-colors ${isToday ? "bg-primary text-white shadow-md" : isSelected ? "text-primary" : "text-gray-700"}`}>{dayObj.date}</span>
                    {events.length > 0 && <span className="text-[10px] font-bold text-gray-400">{events.length}개</span>}
                  </div>
                  <div className="flex flex-col gap-1.5 mt-auto">
                    {events.slice(0, 2).map((ev: any, idx: number) => (
                      <div key={idx} className={`relative text-[10px] font-extrabold px-1.5 py-1 rounded truncate border group/ev ${ev.color}`}>
                        <div className="flex items-center gap-1">
                          {ev.isSaved && <CheckCircle2 className="w-2.5 h-2.5 text-purple-600" />}
                          <span className="truncate">{ev.title}</span>
                        </div>
                        {ev.isTemp && (
                          <div className="absolute inset-0 bg-purple-900/90 text-white flex items-center justify-center rounded opacity-0 group-hover/ev:opacity-100 transition-opacity z-50">
                            <button onClick={(e) => { e.stopPropagation(); handleAddToCalendar(ev.rawRec); }} className="text-[9px] font-black w-full h-full flex items-center justify-center">확인 (저장)</button>
                          </div>
                        )}
                      </div>
                    ))}
                    {events.length > 2 && <div className="text-[8px] text-gray-400 font-bold ml-1">+{events.length - 2} more</div>}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-8 border-t border-gray-100 pt-8 relative overflow-hidden rounded-2xl">
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20"><Sparkles className="w-5 h-5 text-white" /></div>
              <div><h3 className="font-extrabold text-gray-900 text-lg tracking-tight">AI 맞춤 대외활동 추천</h3><p className="text-xs font-bold text-gray-500">유저님의 프로필과 스터디 현황을 분석한 추천입니다.</p></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
              {isLoading ? (<div className="col-span-3 flex flex-col items-center justify-center py-10"><Loader2 className="w-8 h-8 text-purple-400 animate-spin mb-3" /><p className="text-sm font-bold text-gray-400">데이터를 불러오는 중...</p></div>) : (
                recommendations.map(rec => (
                   <div key={rec.id} className="bg-white border-2 border-transparent shadow-[0_2px_10px_rgba(0,0,0,0.02)] rounded-3xl p-5 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group flex flex-col cursor-pointer">
                    <div className="flex justify-between items-start mb-3"><span className="text-[10px] font-extrabold px-2 py-1 bg-gray-50 border border-gray-100 text-gray-600 rounded-lg">{rec.category}</span></div>
                    <h4 className="font-extrabold text-gray-900 text-sm leading-snug mb-2 group-hover:text-purple-600 transition-colors">{rec.title}</h4>
                    <span className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400 mb-4 truncate text-pink-500"><CalendarIcon className="w-3.5 h-3.5" /> 마감: {rec.date}</span>
                    <div className="mt-auto"><button disabled={isSyncing} onClick={() => handleAddToCalendar(rec)} className="w-full py-2.5 bg-gray-900 text-white text-xs font-black rounded-xl hover:bg-primary transition-all flex items-center justify-center gap-1.5 active:scale-95"><Plus className="w-4 h-4" /> 캘린더에 쏙 담기</button></div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 h-full flex flex-col gap-4">
          <div className="glass-card p-6 bg-gray-900 border-none shadow-md overflow-hidden relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary blur-[50px] opacity-20 rounded-full" />
            <h3 className="text-3xl font-extrabold text-white mb-1 tracking-tight">{selectedDate.getMonth() + 1}월 {selectedDate.getDate()}일</h3>
            <p className="text-gray-400 text-sm font-medium">오늘 총 {selectedEvents.length}개의 일정이 있습니다.</p>
          </div>
          <div className="glass-card p-6 flex-1 border border-gray-100 shadow-sm flex flex-col">
            <h4 className="font-bold text-gray-900 text-base mb-6">스케줄 타임라인</h4>
            {selectedEvents.length > 0 ? (
              <div className="relative flex flex-col gap-5">
                <div className="absolute left-[9px] top-4 bottom-4 w-[2px] bg-gray-100 z-0" />
                {selectedEvents.map((ev, idx) => (
                  <div key={idx} className="relative z-10 flex gap-4 animate-in slide-in-from-right-4 duration-300 group">
                    <div className="mt-1"><div className={`w-5 h-5 rounded-full border-4 border-white shadow-sm ${ev.type === "academic" ? "bg-red-500" : ev.type === "career" ? "bg-blue-500" : ev.type === "temporary" ? "bg-purple-400" : "bg-emerald-500"}`} /></div>
                    <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-4 group-hover:bg-white group-hover:shadow-md transition-all">
                      <div className="flex justify-between items-start mb-2"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${ev.color}`}>{ev.tag}</span><span className="flex items-center gap-1 text-[11px] font-bold text-gray-400"><Clock className="w-3.5 h-3.5" /> {ev.time}</span></div>
                      <h5 className="font-bold text-gray-900 text-sm leading-snug">{ev.title}</h5>
                    </div>
                  </div>
                ))}
              </div>
            ) : (<div className="flex flex-col items-center justify-center flex-1 py-10 opacity-60"><Sparkles className="w-10 h-10 text-gray-300 mb-3" /><p className="text-sm font-bold text-gray-400">일정이 없습니다.</p></div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

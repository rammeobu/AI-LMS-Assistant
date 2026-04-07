"use client";
import { useState } from "react";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Brain, Clock, AlertCircle, BookOpen } from "lucide-react";
import { mockCalendarEvents } from "@/lib/mock-data";

const DAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MONTHS = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

const typeConfig: Record<string, { color: string; label: string }> = {
  study: { color: "#7c3aed", label: "학습" },
  deadline: { color: "#ef4444", label: "마감" },
  exam: { color: "#f59e0b", label: "시험" },
  personal: { color: "#06b6d4", label: "개인" },
};

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 1)); // April 2026
  const [selectedDate, setSelectedDate] = useState<string | null>("2026-04-08");

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const getEventsForDate = (day: number) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return mockCalendarEvents.filter((e) => e.date === dateStr);
  };

  const selectedEvents = selectedDate
    ? mockCalendarEvents.filter((e) => e.date === selectedDate)
    : [];

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#e8eaf6" }}>
            📅 <span className="gradient-text">캘린더</span>
          </h1>
          <p className="text-sm" style={{ color: "#9ca3af" }}>AI 추천 일정과 공모전 마감일을 한눈에 관리하세요</p>
        </div>
        <button className="btn-gradient flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" /> 일정 추가
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 glass-card p-6">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-6">
            <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <ChevronLeft className="w-5 h-5" style={{ color: "#9ca3af" }} />
            </button>
            <h2 className="text-lg font-bold" style={{ color: "#e8eaf6" }}>
              {year}년 {MONTHS[month]}
            </h2>
            <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
              <ChevronRight className="w-5 h-5" style={{ color: "#9ca3af" }} />
            </button>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map((day) => (
              <div key={day} className="text-center text-xs font-medium py-2" style={{ color: "#6b7280" }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} className="aspect-square" />;
              const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const events = getEventsForDate(day);
              const isSelected = selectedDate === dateStr;
              const isToday = day === 7; // Mock today as April 7

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDate(dateStr)}
                  className="aspect-square rounded-xl p-1 flex flex-col items-center justify-start transition-all duration-200 hover:bg-white/5 relative"
                  style={{
                    background: isSelected ? "rgba(124, 58, 237, 0.15)" : "transparent",
                    border: isSelected ? "1px solid rgba(124, 58, 237, 0.3)" : isToday ? "1px solid rgba(124, 58, 237, 0.2)" : "1px solid transparent",
                  }}
                >
                  <span
                    className="text-sm font-medium"
                    style={{ color: isSelected ? "#7c3aed" : isToday ? "#a78bfa" : "#d1d5db" }}
                  >
                    {day}
                  </span>
                  {events.length > 0 && (
                    <div className="flex gap-0.5 mt-1">
                      {events.slice(0, 3).map((e, j) => (
                        <div
                          key={j}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: typeConfig[e.type]?.color || "#7c3aed" }}
                        />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-4 mt-4 pt-4" style={{ borderTop: "1px solid rgba(124, 58, 237, 0.1)" }}>
            {Object.entries(typeConfig).map(([key, cfg]) => (
              <div key={key} className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: cfg.color }} />
                <span className="text-xs" style={{ color: "#6b7280" }}>{cfg.label}</span>
              </div>
            ))}
            <div className="flex items-center gap-2">
              <Brain className="w-3 h-3" style={{ color: "#7c3aed" }} />
              <span className="text-xs" style={{ color: "#6b7280" }}>AI 추천</span>
            </div>
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold mb-4" style={{ color: "#e8eaf6" }}>
            {selectedDate ? `${selectedDate.split("-")[1]}월 ${selectedDate.split("-")[2]}일 일정` : "날짜를 선택하세요"}
          </h3>
          {selectedEvents.length === 0 ? (
            <div className="text-center py-8">
              <CalendarIcon className="w-10 h-10 mx-auto mb-3" style={{ color: "#2a2b4a" }} />
              <p className="text-sm" style={{ color: "#6b7280" }}>이 날짜에 일정이 없습니다</p>
            </div>
          ) : (
            <div className="space-y-3">
              {selectedEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-4 rounded-xl"
                  style={{
                    background: "rgba(30, 31, 59, 0.5)",
                    borderLeft: `3px solid ${typeConfig[event.type]?.color || "#7c3aed"}`,
                  }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-sm font-bold" style={{ color: "#e8eaf6" }}>{event.title}</h4>
                    {event.ai && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "rgba(124, 58, 237, 0.1)", color: "#a78bfa" }}>AI</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${typeConfig[event.type]?.color}15`, color: typeConfig[event.type]?.color }}>
                      {typeConfig[event.type]?.label}
                    </span>
                    <span className="text-xs" style={{ color: "#6b7280" }}>{event.date}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Upcoming */}
          <div className="mt-6 pt-4" style={{ borderTop: "1px solid rgba(124, 58, 237, 0.1)" }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <Clock className="w-4 h-4" style={{ color: "#f59e0b" }} /> 마감 임박
            </h3>
            <div className="space-y-2">
              {mockCalendarEvents
                .filter((e) => e.type === "deadline")
                .map((e) => (
                  <div key={e.id} className="flex items-center gap-2 p-2 rounded-lg" style={{ background: "rgba(239, 68, 68, 0.05)" }}>
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" style={{ color: "#ef4444" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate" style={{ color: "#e8eaf6" }}>{e.title}</p>
                      <p className="text-xs" style={{ color: "#6b7280" }}>{e.date}</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

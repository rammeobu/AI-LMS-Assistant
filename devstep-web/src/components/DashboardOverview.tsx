"use client";

import { ChevronRight, Clock, Zap, CheckCircle2, Flame, Loader2, CalendarPlus, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { recordAttendance, getAttendanceHistory } from "../app/actions/attendanceActions";
import { getUserCalendar } from "../app/actions/calendarActions";
import { getTodos, addTodo, toggleTodo, deleteTodo } from "../app/actions/todoActions";

export default function DashboardOverview() {
  const [heatmapData, setHeatmapData] = useState<number[]>(new Array(168).fill(0));
  const [stats, setStats] = useState({ daysSinceJoin: 1, streak: 0 });
  const [upcomingTasks, setUpcomingTasks] = useState<any[]>([]);
  const [todos, setTodos] = useState<any[]>([]);
  const [newTodo, setNewTodo] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState(false);

  /**
   * D-Day 계산기
   */
  const calculateDDay = (deadlineStr: string | null) => {
    if (!deadlineStr) return "상시";
    const deadline = new Date(deadlineStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    deadline.setHours(0, 0, 0, 0);

    const diff = deadline.getTime() - today.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return "D-DAY";
    if (days < 0) return "만료";
    return `D-${days}`;
  };

  /**
   * 카테고리에 따른 색상 매핑
   */
  const getCategoryColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("인턴") || t.includes("취업") || t.includes("직무")) return "bg-green-100 text-green-700";
    if (t.includes("공모전") || t.includes("프로젝트") || t.includes("활동")) return "bg-purple-100 text-purple-700";
    if (t.includes("자격증") || t.includes("교육") || t.includes("강연")) return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      // 1. 출석 체크 및 히스토리
      await recordAttendance();
      const attendanceRes = await getAttendanceHistory();
      if (attendanceRes.success && attendanceRes.data) {
        const calculatedDays = attendanceRes.firstJoinDate 
          ? Math.floor((new Date().getTime() - new Date(attendanceRes.firstJoinDate).getTime()) / (1000 * 60 * 60 * 24)) + 1
          : 1;

        setStats({
          streak: attendanceRes.streak ?? 0,
          daysSinceJoin: calculatedDays
        });
        
        const hData = new Array(168).fill(0);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const attendanceSet = new Set(attendanceRes.data);
        for (let i = 0; i < 168; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - (167 - i));
          const dateStr = checkDate.toISOString().split('T')[0];
          if (attendanceSet.has(dateStr)) hData[i] = 2;
        }
        setHeatmapData(hData);
      }

      // 2. 캘린더 작업 불러오기
      const calendarRes = await getUserCalendar();
      if (calendarRes.success && calendarRes.data) {
        const sorted = calendarRes.data
          .filter((item: any) => {
            if (!item.deadline) return true;
            const dd = new Date(item.deadline);
            dd.setHours(0, 0, 0, 0);
            return dd >= new Date().setHours(0, 0, 0, 0);
          })
          .sort((a: any, b: any) => {
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          })
          .slice(0, 3);
        setUpcomingTasks(sorted);
      }

      // 3. 할 일 목록(To-Do) 불러오기
      const todoRes = await getTodos();
      if (todoRes.success) {
        setTodos(todoRes.data);
      }
    } catch (err) {
      console.error("Data load error:", err);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  /**
   * 할 일 추가 핸들러
   */
  const handleAddTodo = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newTodo.trim() || isActionLoading) return;

    setIsActionLoading(true);
    const res = await addTodo(newTodo);
    if (res.success) {
      setTodos([...todos, res.data]);
      setNewTodo("");
    }
    setIsActionLoading(false);
  };

  /**
   * 할 일 토글 핸들러
   */
  const handleToggleTodo = async (id: string, currentStatus: boolean) => {
    if (isActionLoading) return;
    
    setTodos(todos.map(t => t.id === id ? { ...t, is_completed: !currentStatus } : t));
    
    const res = await toggleTodo(id, currentStatus);
    if (!res.success) {
      const todoRes = await getTodos();
      if (todoRes.success) setTodos(todoRes.data);
    }
  };

  /**
   * 할 일 삭제 핸들러
   */
  const handleDeleteTodo = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (isActionLoading) return;

    setTodos(todos.filter(t => t.id !== id));
    const res = await deleteTodo(id);
    if (!res.success) {
      const todoRes = await getTodos();
      if (todoRes.success) setTodos(todoRes.data);
    }
  };

  return (
    <div className="flex flex-col gap-6 lg:gap-8 overflow-y-auto pr-1 pb-10">

      {/* 1. Streak Banner */}
      <section className="glass-card p-6 flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 z-20 flex items-center justify-center backdrop-blur-[2px]">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        )}
        <div className="flex items-center gap-6">
          <div className="bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
            <Flame className="w-8 h-8 text-orange-500" strokeWidth={2.5} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 leading-tight">DevStep과 함께한 지 {stats.daysSinceJoin}일째!</h2>
            <p className="text-gray-500 text-sm mt-1 font-medium">현재 연속 <strong className="text-orange-500 font-extrabold">{stats.streak}일째</strong> 성장 중입니다.</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2 shrink-0 max-w-full overflow-x-auto pb-1 scrollbar-hide">
          <div className="grid grid-flow-col grid-rows-7 gap-1">
            {heatmapData.map((level, idx) => (
              <div key={idx} className={`w-3 h-3 rounded-sm transition-colors duration-500 ${level === 0 ? "bg-gray-100" : "bg-green-400"}`} />
            ))}
          </div>
        </div>
      </section>

      {/* 2. Middle Section: Schedules vs To-Do */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Real-time Schedules Widget */}
        <section className="glass-card p-6 flex flex-col relative overflow-hidden min-h-[440px]">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" /> 진행 중인 핵심 일정
            </h2>
            <Link href="/dashboard?tab=calendar" className="text-sm font-semibold text-primary hover:underline flex items-center">
              전체 보기 <ChevronRight className="w-4 h-4 ml-0.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3 overflow-y-auto pr-1 flex-1 min-h-0">
            {upcomingTasks.length > 0 ? (
              upcomingTasks.map(task => (
                <div key={task.id} className="flex flex-col p-4 bg-white/60 border border-gray-100 rounded-2xl flex-shrink-0 hover:shadow-sm transition-all hover:-translate-y-0.5 relative group ring-1 ring-gray-100/50">
                  <div className="absolute right-4 top-4 text-[10px] font-black text-red-500 bg-red-50 px-2.5 py-1 rounded-full ring-1 ring-red-100 shadow-sm">
                    {calculateDDay(task.deadline)}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold uppercase ${getCategoryColor(task.type)} ring-1 ring-current/10`}>
                      {task.type}
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-900 truncate mb-1.5 text-sm">{task.title}</h3>
                  <p className="text-xs text-gray-400 font-medium flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {task.deadline ? new Date(task.deadline).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric', weekday: 'short' }) : "상시 모집"}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-10 opacity-70">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <CalendarPlus className="w-8 h-8 text-gray-300" />
                </div>
                <p className="text-sm font-bold text-gray-500 mb-1">참여 중인 일정이 없습니다.</p>
                <Link href="/dashboard?tab=calendar" className="px-4 py-2 bg-primary/10 text-primary text-xs font-bold rounded-lg hover:bg-primary/20 transition-colors mt-2">
                  활동 찾아보기
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Right: Today's To-Do Checklist */}
        <section className="glass-card p-6 flex flex-col relative overflow-hidden min-h-[440px]">
          <div className="flex items-center justify-between mb-2 shrink-0">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-primary" /> 오늘의 액션 플랜
            </h2>
            <span className="text-[10px] bg-primary/5 text-primary px-2 py-0.5 rounded-full font-bold">
              {todos.filter(t => t.is_completed).length}/{todos.length} 완료
            </span>
          </div>

          <div className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-0 mb-4 py-2">
            {todos.length > 0 ? (
              todos.map(todo => (
                <div
                  key={todo.id}
                  onClick={() => handleToggleTodo(todo.id, todo.is_completed)}
                  className={`group flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${todo.is_completed
                      ? "bg-gray-50/60 border-transparent"
                      : "bg-white border-primary/10 hover:border-primary/30 shadow-sm"
                    }`}
                >
                  <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition-colors ${todo.is_completed ? "bg-primary border-primary font-bold" : "border-gray-200 bg-white"
                    }`}>
                    {todo.is_completed && <CheckCircle2 className="w-3.5 h-3.5 text-white stroke-[3]" />}
                  </div>
                  <span className={`text-[13px] font-semibold select-none flex-1 truncate ${todo.is_completed ? "text-gray-400 line-through" : "text-gray-700"
                    }`}>
                    {todo.content}
                  </span>
                  <button
                    onClick={(e) => handleDeleteTodo(e, todo.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center flex-1 text-center py-10 opacity-60">
                <p className="text-xs font-bold text-gray-400">아직 할 일이 없습니다.</p>
                <p className="text-[10px] text-gray-300 mt-1">아래 입력창에서 첫 일정을 추가해보세요!</p>
              </div>
            )}
          </div>

          <form onSubmit={handleAddTodo} className="shrink-0 mt-auto pt-4 border-t border-gray-100">
            <div className="relative group">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="새로운 액션 플랜을 입력하세요..."
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 pr-12 text-sm font-semibold placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-inner"
                disabled={isActionLoading}
              />
              <button
                type="submit"
                disabled={!newTodo.trim() || isActionLoading}
                className="absolute right-2 top-1.5 h-9 w-9 bg-primary text-white rounded-lg flex items-center justify-center hover:bg-primary-dark transition-colors disabled:opacity-30 disabled:hover:bg-primary"
              >
                {isActionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-5 h-5" />}
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}

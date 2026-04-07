"use client";
import Link from "next/link";
import {
  Brain, Sparkles, Map, Calendar, TrendingUp, ArrowRight,
  Award, CheckCircle2, Clock, FileText, Users, AlertCircle,
} from "lucide-react";
import { mockUser, mockAnalysis, mockCalendarEvents, mockRecommendations } from "@/lib/mock-data";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip,
} from "recharts";

const radarData = [
  { subject: "기술 역량", score: mockAnalysis.scores.techSkills },
  { subject: "실무 경험", score: mockAnalysis.scores.practicalExp },
  { subject: "자격증", score: mockAnalysis.scores.certifications },
  { subject: "프로젝트", score: mockAnalysis.scores.projectDiversity },
  { subject: "대외활동", score: mockAnalysis.scores.activities },
  { subject: "계획성", score: mockAnalysis.scores.planning },
];

const trendData = [
  { month: "1월", score: 55 },
  { month: "2월", score: 58 },
  { month: "3월", score: 64 },
  { month: "4월", score: 72 },
];

const upcomingEvents = mockCalendarEvents
  .filter((e) => new Date(e.date) >= new Date("2026-04-07"))
  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  .slice(0, 5);

export default function DashboardPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#e8eaf6" }}>
          안녕하세요, <span className="gradient-text">{mockUser.name}</span>님 👋
        </h1>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          {mockUser.school} {mockUser.major} · 목표: {mockUser.targetJob}
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "종합 역량 점수", value: `${mockAnalysis.overallScore}점`, icon: TrendingUp, color: "#7c3aed", change: "+8점" },
          { label: "보유 자격증", value: `${mockUser.certifications.filter(c => c.status === "취득완료").length}개`, icon: Award, color: "#10b981", change: null },
          { label: "프로젝트", value: `${mockUser.projects.length}건`, icon: FileText, color: "#4f46e5", change: null },
          { label: "예정 일정", value: `${upcomingEvents.length}건`, icon: Calendar, color: "#f59e0b", change: null },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card">
              <div className="flex items-center justify-between mb-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${stat.color}15` }}>
                  <Icon className="w-5 h-5" style={{ color: stat.color }} />
                </div>
                {stat.change && (
                  <span className="text-xs font-medium px-2 py-1 rounded-full" style={{ background: "rgba(16, 185, 129, 0.1)", color: "#10b981" }}>
                    {stat.change}
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold" style={{ color: "#e8eaf6" }}>{stat.value}</p>
              <p className="text-xs mt-1" style={{ color: "#6b7280" }}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Radar Chart */}
        <div className="lg:col-span-1 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold" style={{ color: "#e8eaf6" }}>역량 분석</h3>
            <Link href="/analysis" className="text-xs font-medium flex items-center gap-1" style={{ color: "#7c3aed" }}>
              상세보기 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(124, 58, 237, 0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="score" stroke="#7c3aed" fill="rgba(124, 58, 237, 0.2)" strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Trend Chart */}
        <div className="lg:col-span-2 glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold" style={{ color: "#e8eaf6" }}>성장 추이</h3>
            <span className="badge-success badge text-xs">이번 달 +8점</span>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: "#12132a", border: "1px solid rgba(124, 58, 237, 0.2)", borderRadius: "12px", color: "#e8eaf6" }} />
              <Area type="monotone" dataKey="score" stroke="#7c3aed" fill="url(#scoreGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Strengths / Weaknesses */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold mb-4" style={{ color: "#e8eaf6" }}>AI 분석 요약</h3>
          <div className="space-y-3 mb-4">
            <p className="text-xs font-semibold mb-2" style={{ color: "#10b981" }}>💪 강점</p>
            {mockAnalysis.strengths.slice(0, 2).map((s, i) => (
              <div key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#10b981" }} />
                <span className="text-sm" style={{ color: "#d1d5db" }}>{s}</span>
              </div>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-xs font-semibold mb-2" style={{ color: "#f59e0b" }}>⚡ 보완 필요</p>
            {mockAnalysis.weaknesses.slice(0, 2).map((w, i) => (
              <div key={i} className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#f59e0b" }} />
                <span className="text-sm" style={{ color: "#d1d5db" }}>{w}</span>
              </div>
            ))}
          </div>
          <Link href="/analysis" className="inline-flex items-center gap-1 text-sm font-medium mt-4" style={{ color: "#7c3aed" }}>
            전체 분석 보기 <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Upcoming Schedule */}
        <div className="glass-card p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold" style={{ color: "#e8eaf6" }}>📅 다가오는 일정</h3>
            <Link href="/calendar" className="text-xs font-medium flex items-center gap-1" style={{ color: "#7c3aed" }}>
              전체보기 <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="flex items-center gap-3 p-3 rounded-xl transition-all duration-200"
                style={{ background: "rgba(30, 31, 59, 0.5)" }}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{
                    background:
                      event.type === "deadline" ? "#ef4444" :
                      event.type === "exam" ? "#f59e0b" :
                      event.type === "study" ? "#7c3aed" : "#06b6d4",
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#e8eaf6" }}>{event.title}</p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>{event.date}</p>
                </div>
                {event.ai && (
                  <span className="text-xs px-2 py-0.5 rounded-full shrink-0" style={{ background: "rgba(124, 58, 237, 0.1)", color: "#a78bfa" }}>AI</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        {[
          { href: "/portfolio", label: "포트폴리오 편집", icon: FileText, color: "#4f46e5" },
          { href: "/recommendations", label: "추천 활동", icon: Sparkles, color: "#7c3aed" },
          { href: "/roadmap", label: "학습 로드맵", icon: Map, color: "#06b6d4" },
          { href: "/team", label: "팀원 모집", icon: Users, color: "#10b981" },
        ].map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.href}
              href={action.href}
              className="glass-card p-4 flex flex-col items-center gap-3 text-center group"
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" style={{ background: `${action.color}15` }}>
                <Icon className="w-6 h-6" style={{ color: action.color }} />
              </div>
              <span className="text-sm font-medium" style={{ color: "#d1d5db" }}>{action.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

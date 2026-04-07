"use client";
import Link from "next/link";
import {
  Brain, CheckCircle2, AlertCircle, TrendingUp, ArrowRight,
  Sparkles, Target, AlertTriangle,
} from "lucide-react";
import { mockAnalysis, mockUser } from "@/lib/mock-data";
import {
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell, AreaChart, Area,
} from "recharts";

const radarData = [
  { subject: "기술 역량", score: mockAnalysis.scores.techSkills, fullMark: 100 },
  { subject: "실무 경험", score: mockAnalysis.scores.practicalExp, fullMark: 100 },
  { subject: "자격증", score: mockAnalysis.scores.certifications, fullMark: 100 },
  { subject: "프로젝트", score: mockAnalysis.scores.projectDiversity, fullMark: 100 },
  { subject: "대외활동", score: mockAnalysis.scores.activities, fullMark: 100 },
  { subject: "계획성", score: mockAnalysis.scores.planning, fullMark: 100 },
];

const barData = [
  { name: "기술 역량", score: 78, target: 85, gap: 7 },
  { name: "실무 경험", score: 70, target: 80, gap: 10 },
  { name: "자격증", score: 55, target: 75, gap: 20 },
  { name: "프로젝트", score: 75, target: 80, gap: 5 },
  { name: "대외활동", score: 60, target: 75, gap: 15 },
  { name: "계획성", score: 65, target: 80, gap: 15 },
];

const trendData = [
  { month: "1월", score: 55 },
  { month: "2월", score: 58 },
  { month: "3월", score: 64 },
  { month: "4월", score: 72 },
];

const getScoreColor = (score: number) => {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#7c3aed";
  if (score >= 40) return "#f59e0b";
  return "#ef4444";
};

export default function AnalysisPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#e8eaf6" }}>
          🤖 AI 분석 <span className="gradient-text">결과</span>
        </h1>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          {mockUser.name}님의 포트폴리오를 AI가 6대 평가 항목으로 분석한 결과입니다
        </p>
      </div>

      {/* Overall Score */}
      <div className="glass-card p-8 mb-6 gradient-border">
        <div className="flex flex-col sm:flex-row items-center gap-8">
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center">
              <svg width="140" height="140" viewBox="0 0 140 140">
                <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(124, 58, 237, 0.1)" strokeWidth="12" />
                <circle
                  cx="70" cy="70" r="60" fill="none"
                  stroke="url(#scoreGradient)" strokeWidth="12"
                  strokeDasharray={`${(mockAnalysis.overallScore / 100) * 377} 377`}
                  strokeLinecap="round"
                  transform="rotate(-90 70 70)"
                />
                <defs>
                  <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#7c3aed" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold gradient-text">{mockAnalysis.overallScore}</span>
                <span className="text-xs" style={{ color: "#6b7280" }}>/ 100</span>
              </div>
            </div>
            <p className="text-sm font-medium mt-2" style={{ color: "#a78bfa" }}>종합 역량 점수</p>
          </div>
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(mockAnalysis.scores).map(([key, value]) => {
              const labels: Record<string, string> = {
                techSkills: "기술 역량", practicalExp: "실무 경험",
                certifications: "자격증", projectDiversity: "프로젝트",
                activities: "대외활동", planning: "계획성",
              };
              return (
                <div key={key} className="p-3 rounded-xl text-center" style={{ background: "rgba(30, 31, 59, 0.5)" }}>
                  <p className="text-2xl font-bold" style={{ color: getScoreColor(value) }}>{value}</p>
                  <p className="text-xs mt-1" style={{ color: "#6b7280" }}>{labels[key]}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Radar */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold mb-4" style={{ color: "#e8eaf6" }}>역량 레이더</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(124, 58, 237, 0.15)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "#9ca3af", fontSize: 12 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar dataKey="score" stroke="#7c3aed" fill="rgba(124, 58, 237, 0.2)" strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Gap Analysis */}
        <div className="glass-card p-6">
          <h3 className="text-base font-bold mb-4" style={{ color: "#e8eaf6" }}>역량 격차 분석 (Gap)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData} layout="vertical">
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} width={80} />
              <Tooltip contentStyle={{ background: "#12132a", border: "1px solid rgba(124, 58, 237, 0.2)", borderRadius: "12px", color: "#e8eaf6" }} />
              <Bar dataKey="score" radius={[0, 6, 6, 0]} name="현재 점수">
                {barData.map((entry, index) => (
                  <Cell key={index} fill={getScoreColor(entry.score)} fillOpacity={0.8} />
                ))}
              </Bar>
              <Bar dataKey="target" radius={[0, 6, 6, 0]} fill="rgba(124, 58, 237, 0.15)" name="목표 점수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="glass-card p-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "#10b981" }}>
            <CheckCircle2 className="w-5 h-5" /> 강점 분석
          </h3>
          <div className="space-y-3">
            {mockAnalysis.strengths.map((s, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(16, 185, 129, 0.05)", border: "1px solid rgba(16, 185, 129, 0.1)" }}>
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#10b981" }} />
                <span className="text-sm" style={{ color: "#d1d5db" }}>{s}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-6">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "#f59e0b" }}>
            <AlertTriangle className="w-5 h-5" /> 약점 & 보완 필요사항
          </h3>
          <div className="space-y-3">
            {mockAnalysis.weaknesses.map((w, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.1)" }}>
                <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#f59e0b" }} />
                <span className="text-sm" style={{ color: "#d1d5db" }}>{w}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Missing Skills */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
          <Target className="w-5 h-5" style={{ color: "#ef4444" }} /> 부족 역량 키워드
        </h3>
        <div className="flex flex-wrap gap-2">
          {mockAnalysis.missingSkills.map((skill) => (
            <span key={skill} className="px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#f87171", border: "1px solid rgba(239, 68, 68, 0.2)" }}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Growth Trend */}
      <div className="glass-card p-6 mb-6">
        <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
          <TrendingUp className="w-5 h-5" style={{ color: "#7c3aed" }} /> 성장 추이
        </h3>
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={trendData}>
            <defs>
              <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#7c3aed" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#7c3aed" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="month" tick={{ fill: "#9ca3af", fontSize: 12 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: "#6b7280", fontSize: 12 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: "#12132a", border: "1px solid rgba(124, 58, 237, 0.2)", borderRadius: "12px", color: "#e8eaf6" }} />
            <Area type="monotone" dataKey="score" stroke="#7c3aed" fill="url(#trendGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* AI Recommendations */}
      <div className="glass-card p-6 gradient-border">
        <h3 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
          <Sparkles className="w-5 h-5" style={{ color: "#7c3aed" }} /> AI 추천사항
        </h3>
        <div className="space-y-3 mb-4">
          {mockAnalysis.recommendations.map((rec, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: "rgba(124, 58, 237, 0.05)", border: "1px solid rgba(124, 58, 237, 0.1)" }}>
              <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white" }}>
                {i + 1}
              </span>
              <span className="text-sm" style={{ color: "#d1d5db" }}>{rec}</span>
            </div>
          ))}
        </div>
        <Link href="/recommendations" className="btn-gradient inline-flex items-center gap-2">
          맞춤 추천 보기 <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

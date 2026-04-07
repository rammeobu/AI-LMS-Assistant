"use client";
import { useState } from "react";
import {
  Award, Briefcase, Trophy, BookOpen, Brain,
  Calendar, ChevronRight, ExternalLink, Star,
  ArrowUpRight, Filter,
} from "lucide-react";
import { mockRecommendations } from "@/lib/mock-data";

const tabs = [
  { id: "certs", label: "자격증", icon: Award, count: mockRecommendations.certifications.length },
  { id: "activities", label: "대외활동", icon: Briefcase, count: mockRecommendations.activities.length },
  { id: "contests", label: "공모전", icon: Trophy, count: mockRecommendations.contests.length },
];

const priorityColor: Record<string, { bg: string; text: string }> = {
  "높음": { bg: "rgba(239, 68, 68, 0.1)", text: "#f87171" },
  "중간": { bg: "rgba(245, 158, 11, 0.1)", text: "#fbbf24" },
  "낮음": { bg: "rgba(6, 182, 212, 0.1)", text: "#22d3ee" },
};

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState("certs");

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#e8eaf6" }}>
          ✨ 맞춤형 <span className="gradient-text">추천</span>
        </h1>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          AI 분석 결과를 바탕으로 부족한 역량을 보완할 수 있는 활동을 추천합니다
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
              style={{
                background: isActive ? "rgba(124, 58, 237, 0.15)" : "rgba(30, 31, 59, 0.5)",
                color: isActive ? "#7c3aed" : "#9ca3af",
                border: isActive ? "1px solid rgba(124, 58, 237, 0.3)" : "1px solid rgba(124, 58, 237, 0.08)",
              }}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs" style={{ background: isActive ? "rgba(124, 58, 237, 0.3)" : "rgba(124, 58, 237, 0.1)" }}>
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Certifications */}
      {activeTab === "certs" && (
        <div className="space-y-4 fade-in">
          {mockRecommendations.certifications.map((cert, i) => (
            <div key={cert.id} className="glass-card p-6 slide-up" style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(124, 58, 237, 0.1)" }}>
                  <Award className="w-6 h-6" style={{ color: "#7c3aed" }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold" style={{ color: "#e8eaf6" }}>{cert.title}</h3>
                    <span className="text-xs px-2 py-1 rounded-full" style={{ background: priorityColor[cert.priority].bg, color: priorityColor[cert.priority].text }}>
                      우선순위: {cert.priority}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-3 mb-3">
                    <span className="badge text-xs">{cert.category}</span>
                    <span className="text-xs" style={{ color: "#6b7280" }}>난이도: {cert.difficulty}</span>
                    <span className="text-xs" style={{ color: "#6b7280" }}>준비 기간: {cert.studyPeriod}</span>
                    <span className="text-xs" style={{ color: "#6b7280" }}>시험일: {cert.examDate}</span>
                  </div>
                  <div className="p-3 rounded-xl mb-3" style={{ background: "rgba(124, 58, 237, 0.05)", border: "1px solid rgba(124, 58, 237, 0.1)" }}>
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#7c3aed" }} />
                      <p className="text-sm" style={{ color: "#d1d5db" }}>{cert.reason}</p>
                    </div>
                  </div>
                  <button className="text-sm font-medium flex items-center gap-1" style={{ color: "#7c3aed" }}>
                    캘린더에 추가 <Calendar className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activities */}
      {activeTab === "activities" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 fade-in">
          {mockRecommendations.activities.map((act, i) => (
            <div key={act.id} className="glass-card p-6 slide-up" style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}>
              <div className="flex items-center gap-2 mb-3">
                <span className={act.status === "모집중" ? "badge-success badge" : "badge-warning badge"}>
                  {act.status}
                </span>
                <span className="badge text-xs">{act.category}</span>
              </div>
              <h3 className="text-lg font-bold mb-2" style={{ color: "#e8eaf6" }}>{act.title}</h3>
              <p className="text-sm mb-3" style={{ color: "#9ca3af" }}>{act.description}</p>
              <p className="text-xs mb-3" style={{ color: "#6b7280" }}>기간: {act.period}</p>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {act.skills.map((skill) => (
                  <span key={skill} className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(79, 70, 229, 0.1)", color: "#818cf8" }}>
                    {skill}
                  </span>
                ))}
              </div>
              <div className="p-3 rounded-xl" style={{ background: "rgba(124, 58, 237, 0.05)", border: "1px solid rgba(124, 58, 237, 0.1)" }}>
                <div className="flex items-start gap-2">
                  <Brain className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#7c3aed" }} />
                  <p className="text-xs" style={{ color: "#d1d5db" }}>{act.reason}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Contests */}
      {activeTab === "contests" && (
        <div className="space-y-4 fade-in">
          {mockRecommendations.contests.map((con, i) => (
            <div key={con.id} className="glass-card p-6 slide-up" style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}>
              <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(245, 158, 11, 0.1)" }}>
                  <Trophy className="w-6 h-6" style={{ color: "#f59e0b" }} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold" style={{ color: "#e8eaf6" }}>{con.title}</h3>
                    <span className={con.status === "모집중" ? "badge-success badge text-xs" : "badge-warning badge text-xs"}>
                      {con.status}
                    </span>
                  </div>
                  <p className="text-sm mb-2" style={{ color: "#9ca3af" }}>{con.description}</p>
                  <div className="flex flex-wrap gap-4 mb-3 text-xs" style={{ color: "#6b7280" }}>
                    <span>주최: {con.organizer}</span>
                    <span>마감: {con.deadline}</span>
                    <span>상금: {con.prize}</span>
                    <span>분야: {con.field}</span>
                  </div>
                  <div className="p-3 rounded-xl" style={{ background: "rgba(124, 58, 237, 0.05)", border: "1px solid rgba(124, 58, 237, 0.1)" }}>
                    <div className="flex items-start gap-2">
                      <Brain className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#7c3aed" }} />
                      <p className="text-sm" style={{ color: "#d1d5db" }}>{con.reason}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

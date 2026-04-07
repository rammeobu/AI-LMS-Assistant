"use client";
import {
  Briefcase, CheckCircle2, Circle, BookOpen, FileText,
  MessageSquare, Code, AlertCircle, TrendingUp,
} from "lucide-react";
import { mockInternshipGuide } from "@/lib/mock-data";

export default function InternshipPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#e8eaf6" }}>
          💼 인턴십 <span className="gradient-text">가이드</span>
        </h1>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          <span style={{ color: "#7c3aed" }}>{mockInternshipGuide.targetJob}</span> 직무의 인턴십 준비를 위한 종합 가이드입니다
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Required Skills */}
        <div className="lg:col-span-2 glass-card p-6">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
            <Code className="w-5 h-5" style={{ color: "#7c3aed" }} /> 필요 기술 역량
          </h2>
          <div className="space-y-4">
            {mockInternshipGuide.requiredSkills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-4">
                <div className="w-32 sm:w-40 flex items-center justify-between shrink-0">
                  <span className="text-sm font-medium" style={{ color: "#e8eaf6" }}>{skill.name}</span>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full"
                    style={{
                      background: skill.level === "필수" ? "rgba(239, 68, 68, 0.1)" : "rgba(6, 182, 212, 0.1)",
                      color: skill.level === "필수" ? "#f87171" : "#22d3ee",
                    }}
                  >
                    {skill.level}
                  </span>
                </div>
                <div className="flex-1">
                  <div className="progress-bar">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${skill.userLevel}%`,
                        background: skill.userLevel >= 70 ? "#10b981" :
                          skill.userLevel >= 50 ? "#f59e0b" : "#ef4444",
                      }}
                    />
                  </div>
                </div>
                <span className="text-sm font-bold w-10 text-right" style={{ color: skill.userLevel >= 70 ? "#10b981" : skill.userLevel >= 50 ? "#f59e0b" : "#ef4444" }}>
                  {skill.userLevel}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Resume Tips */}
        <div className="glass-card p-6">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
            <FileText className="w-5 h-5" style={{ color: "#4f46e5" }} /> 이력서 작성 팁
          </h2>
          <div className="space-y-3">
            {mockInternshipGuide.resumeTips.map((tip, i) => (
              <div key={i} className="flex items-start gap-2 p-3 rounded-xl" style={{ background: "rgba(30, 31, 59, 0.5)" }}>
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" style={{ color: "#10b981" }} />
                <span className="text-sm" style={{ color: "#d1d5db" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Interview Checklist */}
      <div className="mt-6">
        <h2 className="text-lg font-bold mb-6 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
          <MessageSquare className="w-5 h-5" style={{ color: "#06b6d4" }} /> 면접 체크리스트
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockInternshipGuide.interviewChecklist.map((section, i) => (
            <div key={i} className="glass-card p-6">
              <h3 className="text-base font-bold mb-4" style={{ color: "#e8eaf6" }}>{section.category}</h3>
              <div className="space-y-2">
                {section.items.map((item, j) => (
                  <label key={j} className="flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all hover:bg-white/5">
                    <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: "#7c3aed" }} />
                    <span className="text-sm" style={{ color: "#d1d5db" }}>{item}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Advice */}
      <div className="glass-card p-6 mt-6 gradient-border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(124, 58, 237, 0.1)" }}>
            <TrendingUp className="w-5 h-5" style={{ color: "#7c3aed" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: "#e8eaf6" }}>AI 인턴십 준비 조언</h3>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              현재 Java/Spring 역량은 양호하지만, Docker와 AWS 경험이 부족합니다.
              인턴십 지원 전 개인 프로젝트를 Docker로 컨테이너화하고 AWS EC2에 배포하는 경험을 쌓으면
              면접에서의 경쟁력이 크게 향상될 것입니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

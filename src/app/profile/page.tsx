"use client";
import {
  User, School, BookOpen, Target, Code, Award,
  FileText, Briefcase, CheckCircle2, AlertCircle,
  ExternalLink, Edit3, Star,
} from "lucide-react";
import { mockUser, mockAnalysis } from "@/lib/mock-data";
import Link from "next/link";

export default function ProfilePage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Header */}
      <div className="glass-card p-8 mb-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0"
            style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
          >
            {mockUser.name.charAt(0)}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold mb-1" style={{ color: "#e8eaf6" }}>{mockUser.name}</h1>
            <p className="text-sm mb-3" style={{ color: "#9ca3af" }}>
              {mockUser.school} · {mockUser.major} · {mockUser.grade}학년
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="badge"><Target className="w-3 h-3 mr-1" /> {mockUser.targetJob}</span>
              <span className="badge-accent badge">{mockUser.targetField}</span>
            </div>
          </div>
          <Link href="/portfolio" className="btn-gradient text-sm flex items-center gap-2">
            <Edit3 className="w-4 h-4" /> 프로필 편집
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tech Stack */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <Code className="w-5 h-5" style={{ color: "#7c3aed" }} /> 기술 스택
            </h2>
            <div className="flex flex-wrap gap-2">
              {mockUser.skills.map((skill) => (
                <span key={skill} className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 hover:scale-105 cursor-default" style={{ background: "rgba(124, 58, 237, 0.1)", color: "#a78bfa", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <FileText className="w-5 h-5" style={{ color: "#4f46e5" }} /> 프로젝트 경험
            </h2>
            <div className="space-y-4">
              {mockUser.projects.map((project, i) => (
                <div key={i} className="p-4 rounded-xl transition-all duration-200" style={{ background: "rgba(30, 31, 59, 0.5)", border: "1px solid rgba(124, 58, 237, 0.08)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-base font-bold" style={{ color: "#e8eaf6" }}>{project.title}</h3>
                    <span className="text-xs shrink-0" style={{ color: "#6b7280" }}>{project.period}</span>
                  </div>
                  <p className="text-sm mb-3" style={{ color: "#9ca3af" }}>{project.description}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {project.tech.map((t) => (
                      <span key={t} className="text-xs px-2.5 py-1 rounded-lg" style={{ background: "rgba(79, 70, 229, 0.1)", color: "#818cf8" }}>{t}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activities */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <Briefcase className="w-5 h-5" style={{ color: "#06b6d4" }} /> 대외활동
            </h2>
            <div className="space-y-4">
              {mockUser.activities.map((act, i) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: "rgba(30, 31, 59, 0.5)", border: "1px solid rgba(124, 58, 237, 0.08)" }}>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-base font-bold" style={{ color: "#e8eaf6" }}>{act.title}</h3>
                      <span className="text-xs" style={{ color: "#06b6d4" }}>{act.role}</span>
                    </div>
                    <span className="text-xs" style={{ color: "#6b7280" }}>{act.period}</span>
                  </div>
                  <p className="text-sm" style={{ color: "#9ca3af" }}>{act.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Certifications */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <Award className="w-5 h-5" style={{ color: "#f59e0b" }} /> 자격증 현황
            </h2>
            <div className="space-y-3">
              {mockUser.certifications.map((cert, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(30, 31, 59, 0.5)" }}>
                  <span className="text-sm font-medium" style={{ color: "#e8eaf6" }}>{cert.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    cert.status === "취득완료" ? "badge-success badge" :
                    cert.status === "준비중" ? "badge-warning badge" : "badge"
                  }`}>{cert.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Awards */}
          <div className="glass-card p-6">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <Star className="w-5 h-5" style={{ color: "#f59e0b" }} /> 수상 경력
            </h2>
            <div className="space-y-3">
              {mockUser.awards.map((award, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(30, 31, 59, 0.5)" }}>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "#e8eaf6" }}>{award.title}</p>
                    <p className="text-xs" style={{ color: "#6b7280" }}>{award.year}</p>
                  </div>
                  <span className="badge-warning badge text-xs">{award.prize}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI Summary */}
          <div className="glass-card p-6 gradient-border">
            <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              🤖 AI 분석 요약
            </h2>
            <div className="text-center mb-4">
              <p className="text-4xl font-bold gradient-text">{mockAnalysis.overallScore}</p>
              <p className="text-xs mt-1" style={{ color: "#6b7280" }}>종합 역량 점수</p>
            </div>
            <div className="space-y-2 mb-3">
              {mockAnalysis.strengths.slice(0, 2).map((s, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#10b981" }} />
                  <span className="text-xs" style={{ color: "#d1d5db" }}>{s}</span>
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {mockAnalysis.weaknesses.slice(0, 2).map((w, i) => (
                <div key={i} className="flex items-start gap-2">
                  <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" style={{ color: "#f59e0b" }} />
                  <span className="text-xs" style={{ color: "#d1d5db" }}>{w}</span>
                </div>
              ))}
            </div>
            <Link href="/analysis" className="btn-gradient w-full text-sm mt-4 flex items-center justify-center gap-1 py-2.5">
              상세 분석 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

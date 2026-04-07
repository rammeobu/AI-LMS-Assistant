"use client";
import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap, Code, Award, FileText, Briefcase, Trophy,
  User, Plus, X, ArrowRight, ArrowLeft, Brain, Sparkles,
} from "lucide-react";

const steps = [
  { id: 1, label: "학력", icon: GraduationCap },
  { id: 2, label: "기술 스택", icon: Code },
  { id: 3, label: "프로젝트", icon: FileText },
  { id: 4, label: "자격증", icon: Award },
  { id: 5, label: "대외활동", icon: Briefcase },
  { id: 6, label: "수상/자기소개", icon: Trophy },
];

export default function PortfolioPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [skills, setSkills] = useState<string[]>(["Java", "Python", "Spring Boot", "React"]);
  const [skillInput, setSkillInput] = useState("");
  const [analyzing, setAnalyzing] = useState(false);

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleAnalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      window.location.href = "/analysis";
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#e8eaf6" }}>
          📝 포트폴리오 <span className="gradient-text">입력</span>
        </h1>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          AI 분석을 위해 자신의 경험과 역량을 입력해주세요
        </p>
      </div>

      {/* Steps */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-2">
        {steps.map((step, i) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;
          return (
            <div key={step.id} className="flex items-center">
              <button
                onClick={() => setCurrentStep(step.id)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap"
                style={{
                  background: isActive ? "rgba(124, 58, 237, 0.15)" : isDone ? "rgba(16, 185, 129, 0.1)" : "transparent",
                  color: isActive ? "#7c3aed" : isDone ? "#10b981" : "#6b7280",
                  border: isActive ? "1px solid rgba(124, 58, 237, 0.3)" : "1px solid transparent",
                }}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < steps.length - 1 && (
                <div className="w-6 h-px mx-1" style={{ background: isDone ? "#10b981" : "rgba(124, 58, 237, 0.15)" }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="glass-card p-8">
        {currentStep === 1 && (
          <div className="space-y-5 fade-in">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <GraduationCap className="w-5 h-5" style={{ color: "#7c3aed" }} /> 학력 정보
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="floating-label">학교</label>
                <input type="text" defaultValue="서울대학교" className="input-field" />
              </div>
              <div>
                <label className="floating-label">전공</label>
                <input type="text" defaultValue="컴퓨터공학과" className="input-field" />
              </div>
              <div>
                <label className="floating-label">학년</label>
                <select className="input-field" defaultValue="3">
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                  <option value="4">4학년</option>
                </select>
              </div>
              <div>
                <label className="floating-label">학점 (선택)</label>
                <input type="text" placeholder="3.8 / 4.5" className="input-field" />
              </div>
            </div>
            <div>
              <label className="floating-label">목표 직무</label>
              <input type="text" defaultValue="백엔드 개발자" className="input-field" />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-5 fade-in">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <Code className="w-5 h-5" style={{ color: "#7c3aed" }} /> 보유 기술 스택
            </h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && addSkill()}
                placeholder="기술명을 입력하고 Enter"
                className="input-field flex-1"
              />
              <button onClick={addSkill} className="btn-gradient px-4 flex items-center gap-1">
                <Plus className="w-4 h-4" /> 추가
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium" style={{ background: "rgba(124, 58, 237, 0.1)", color: "#a78bfa", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
                  {skill}
                  <button onClick={() => setSkills(skills.filter(s => s !== skill))}>
                    <X className="w-3 h-3" style={{ color: "#6b7280" }} />
                  </button>
                </span>
              ))}
            </div>
            <p className="text-xs" style={{ color: "#6b7280" }}>다양한 기술을 입력할수록 AI 분석이 더 정확해집니다</p>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-5 fade-in">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <FileText className="w-5 h-5" style={{ color: "#7c3aed" }} /> 프로젝트 경험
            </h2>
            {[1].map((_, i) => (
              <div key={i} className="p-5 rounded-xl space-y-4" style={{ background: "rgba(30, 31, 59, 0.5)", border: "1px solid rgba(124, 58, 237, 0.1)" }}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold" style={{ color: "#a78bfa" }}>프로젝트 {i + 1}</span>
                </div>
                <div>
                  <label className="floating-label">프로젝트명</label>
                  <input type="text" placeholder="프로젝트 제목" className="input-field" />
                </div>
                <div>
                  <label className="floating-label">설명</label>
                  <textarea placeholder="프로젝트 설명을 입력하세요" className="input-field" rows={3} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="floating-label">시작일</label>
                    <input type="month" className="input-field" />
                  </div>
                  <div>
                    <label className="floating-label">종료일</label>
                    <input type="month" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="floating-label">사용 기술</label>
                  <input type="text" placeholder="쉼표로 구분 (예: React, Node.js)" className="input-field" />
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-80" style={{ border: "1px dashed rgba(124, 58, 237, 0.3)", color: "#a78bfa" }}>
              <Plus className="w-4 h-4" /> 프로젝트 추가
            </button>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-5 fade-in">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <Award className="w-5 h-5" style={{ color: "#7c3aed" }} /> 보유 자격증
            </h2>
            {[1].map((_, i) => (
              <div key={i} className="p-5 rounded-xl space-y-4" style={{ background: "rgba(30, 31, 59, 0.5)", border: "1px solid rgba(124, 58, 237, 0.1)" }}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="floating-label">자격증명</label>
                    <input type="text" placeholder="정보처리기사" className="input-field" />
                  </div>
                  <div>
                    <label className="floating-label">취득 상태</label>
                    <select className="input-field">
                      <option>취득완료</option>
                      <option>준비중</option>
                      <option>미취득</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="floating-label">취득일 (선택)</label>
                  <input type="month" className="input-field" />
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-80" style={{ border: "1px dashed rgba(124, 58, 237, 0.3)", color: "#a78bfa" }}>
              <Plus className="w-4 h-4" /> 자격증 추가
            </button>
          </div>
        )}

        {currentStep === 5 && (
          <div className="space-y-5 fade-in">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <Briefcase className="w-5 h-5" style={{ color: "#7c3aed" }} /> 대외활동 & 공모전
            </h2>
            {[1].map((_, i) => (
              <div key={i} className="p-5 rounded-xl space-y-4" style={{ background: "rgba(30, 31, 59, 0.5)", border: "1px solid rgba(124, 58, 237, 0.1)" }}>
                <div>
                  <label className="floating-label">활동명</label>
                  <input type="text" placeholder="Google DSC, 해커톤 등" className="input-field" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="floating-label">역할</label>
                    <input type="text" placeholder="멤버, 팀장 등" className="input-field" />
                  </div>
                  <div>
                    <label className="floating-label">기간</label>
                    <input type="text" placeholder="2025.03 - 2025.12" className="input-field" />
                  </div>
                </div>
                <div>
                  <label className="floating-label">활동 내용</label>
                  <textarea placeholder="활동 내용을 입력하세요" className="input-field" rows={2} />
                </div>
              </div>
            ))}
            <button className="w-full py-3 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-80" style={{ border: "1px dashed rgba(124, 58, 237, 0.3)", color: "#a78bfa" }}>
              <Plus className="w-4 h-4" /> 활동 추가
            </button>
          </div>
        )}

        {currentStep === 6 && (
          <div className="space-y-5 fade-in">
            <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: "#e8eaf6" }}>
              <Trophy className="w-5 h-5" style={{ color: "#7c3aed" }} /> 수상 경력 & 자기소개
            </h2>
            <div className="p-5 rounded-xl space-y-4" style={{ background: "rgba(30, 31, 59, 0.5)", border: "1px solid rgba(124, 58, 237, 0.1)" }}>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="floating-label">대회명</label>
                  <input type="text" placeholder="SW 경진대회" className="input-field" />
                </div>
                <div>
                  <label className="floating-label">수상명</label>
                  <input type="text" placeholder="최우수상" className="input-field" />
                </div>
                <div>
                  <label className="floating-label">수상 연도</label>
                  <input type="text" placeholder="2025" className="input-field" />
                </div>
              </div>
            </div>
            <div>
              <label className="floating-label">자기소개 요약</label>
              <textarea
                placeholder="자신의 강점, 관심사, 목표 등을 자유롭게 작성해주세요. AI가 이 내용을 바탕으로 더 정확한 분석을 제공합니다."
                className="input-field"
                rows={5}
              />
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: "1px solid rgba(124, 58, 237, 0.1)" }}>
          <button
            onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all disabled:opacity-30"
            style={{ border: "1px solid rgba(124, 58, 237, 0.3)", color: "#a78bfa" }}
          >
            <ArrowLeft className="w-4 h-4" /> 이전
          </button>

          {currentStep < 6 ? (
            <button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="btn-gradient flex items-center gap-2"
            >
              다음 <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleAnalyze}
              disabled={analyzing}
              className="btn-gradient flex items-center gap-2"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  AI 분석 중...
                </>
              ) : (
                <>
                  <Brain className="w-4 h-4" /> AI 분석 시작
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Analysis Loading Overlay */}
      {analyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: "rgba(10, 11, 20, 0.9)" }}>
          <div className="text-center">
            <div className="w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center pulse-glow" style={{ background: "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(6, 182, 212, 0.2))" }}>
              <Brain className="w-10 h-10" style={{ color: "#7c3aed" }} />
            </div>
            <h2 className="text-2xl font-bold mb-3 gradient-text">AI가 포트폴리오를 분석하고 있습니다</h2>
            <p className="text-sm mb-6" style={{ color: "#9ca3af" }}>6대 평가 항목을 기반으로 역량을 진단합니다...</p>
            <div className="w-64 mx-auto progress-bar">
              <div className="progress-bar-fill" style={{ width: "70%", animation: "none", transition: "width 2s ease" }} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

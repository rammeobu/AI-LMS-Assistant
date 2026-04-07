"use client";
import Link from "next/link";
import {
  Brain,
  Sparkles,
  Map,
  Calendar,
  Users,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Target,
  Star,
  ChevronRight,
  Zap,
  Shield,
  BarChart3,
} from "lucide-react";
import { mockSuccessStories, mockRecommendations } from "@/lib/mock-data";

const features = [
  {
    icon: Brain,
    title: "AI 포트폴리오 분석",
    description: "6대 평가 항목으로 당신의 역량을 정밀 분석하고 강점과 약점을 객관적으로 진단합니다.",
    color: "#7c3aed",
  },
  {
    icon: Sparkles,
    title: "맞춤형 추천",
    description: "분석 결과를 바탕으로 자격증, 대외활동, 공모전, 학습 콘텐츠를 개인별 맞춤 추천합니다.",
    color: "#4f46e5",
  },
  {
    icon: Map,
    title: "학습 로드맵",
    description: "목표 직무에 맞는 단계별 학습 경로를 자동으로 생성하여 효율적인 성장을 돕습니다.",
    color: "#06b6d4",
  },
  {
    icon: Calendar,
    title: "스마트 캘린더",
    description: "AI가 추천하는 학습 일정과 공모전 마감일을 자동으로 관리해줍니다.",
    color: "#10b981",
  },
  {
    icon: Users,
    title: "팀 빌딩",
    description: "동일한 목표를 가진 사용자들을 매칭하여 함께 성장할 팀원을 찾아줍니다.",
    color: "#f59e0b",
  },
  {
    icon: TrendingUp,
    title: "성장 모니터링",
    description: "대시보드에서 역량 점수 변화와 활동 달성률을 시각적으로 추적합니다.",
    color: "#ef4444",
  },
];

const stats = [
  { value: "10,000+", label: "활성 사용자" },
  { value: "95%", label: "만족도" },
  { value: "3.2배", label: "취업률 향상" },
  { value: "500+", label: "추천 활동" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center py-20 sm:py-32 px-4">
        <div className="max-w-6xl w-full mx-auto text-center">
          <div className="fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8" style={{ background: "rgba(124, 58, 237, 0.1)", border: "1px solid rgba(124, 58, 237, 0.2)" }}>
              <Zap className="w-4 h-4" style={{ color: "#7c3aed" }} />
              <span className="text-sm font-medium" style={{ color: "#a78bfa" }}>AI 기반 커리어 분석 플랫폼</span>
            </div>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight mb-6 fade-in stagger-1" style={{ opacity: 0 }}>
            <span className="gradient-text">AI가 분석하는</span>
            <br />
            <span style={{ color: "#e8eaf6" }}>나만의 커리어 성장 경로</span>
          </h1>

          <p className="text-lg sm:text-xl max-w-2xl mx-auto mb-10 fade-in stagger-2" style={{ color: "#9ca3af", opacity: 0 }}>
            포트폴리오를 입력하면 AI가 부족한 역량을 진단하고,
            <br className="hidden sm:block" />
            자격증·대외활동·공모전·학습 계획까지 추천해드립니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center fade-in stagger-3" style={{ opacity: 0 }}>
            <Link href="/dashboard" className="btn-gradient text-base px-8 py-4 inline-flex items-center justify-center gap-2">
              무료로 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center justify-center gap-2 transition-all duration-300"
              style={{
                border: "1px solid rgba(124, 58, 237, 0.3)",
                color: "#a78bfa",
                background: "rgba(124, 58, 237, 0.05)",
              }}
            >
              데모 둘러보기
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto fade-in stagger-4" style={{ opacity: 0 }}>
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold gradient-text">{stat.value}</p>
                <p className="text-sm mt-1" style={{ color: "#6b7280" }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#e8eaf6" }}>
              체계적인 커리어 성장을 위한 <span className="gradient-text">올인원 플랫폼</span>
            </h2>
            <p className="text-base max-w-xl mx-auto" style={{ color: "#9ca3af" }}>
              포트폴리오 분석부터 취업 준비까지, 한 곳에서 모든 것을 관리하세요
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="glass-card p-6 slide-up"
                  style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: `${feature.color}20` }}
                  >
                    <Icon className="w-6 h-6" style={{ color: feature.color }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: "#e8eaf6" }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "#9ca3af" }}>
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4" style={{ background: "rgba(18, 19, 42, 0.3)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#e8eaf6" }}>
              <span className="gradient-text">3단계</span>로 시작하는 커리어 성장
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "포트폴리오 입력", desc: "학력, 프로젝트, 자격증, 기술 스택 등 자신의 경험을 입력합니다.", icon: Target },
              { step: "02", title: "AI 정밀 분석", desc: "AI가 6대 평가 항목을 기반으로 역량을 분석하고 강점과 약점을 진단합니다.", icon: BarChart3 },
              { step: "03", title: "맞춤 추천 실행", desc: "분석 결과에 따라 자격증, 활동, 학습 로드맵을 추천받고 실행합니다.", icon: Shield },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center slide-up" style={{ opacity: 0, animationDelay: `${i * 0.15}s` }}>
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center"
                      style={{
                        background: "linear-gradient(135deg, rgba(124, 58, 237, 0.15), rgba(6, 182, 212, 0.15))",
                        border: "1px solid rgba(124, 58, 237, 0.2)",
                      }}
                    >
                      <Icon className="w-8 h-8" style={{ color: "#7c3aed" }} />
                    </div>
                    <span
                      className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)", color: "white" }}
                    >
                      {item.step}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold mb-3" style={{ color: "#e8eaf6" }}>{item.title}</h3>
                  <p className="text-sm" style={{ color: "#9ca3af" }}>{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Active Activities */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold mb-2" style={{ color: "#e8eaf6" }}>
                🔥 현재 모집 중인 활동
              </h2>
              <p className="text-sm" style={{ color: "#9ca3af" }}>AI가 선별한 주요 활동을 확인하세요</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockRecommendations.activities.map((act, i) => (
              <div
                key={act.id}
                className="glass-card p-6 slide-up cursor-pointer"
                style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className={act.status === "모집중" ? "badge-success badge" : "badge-warning badge"}>
                    {act.status}
                  </span>
                  <span className="badge">{act.category}</span>
                </div>
                <h3 className="text-base font-bold mb-2" style={{ color: "#e8eaf6" }}>{act.title}</h3>
                <p className="text-sm mb-3 line-clamp-2" style={{ color: "#9ca3af" }}>{act.description}</p>
                <p className="text-xs" style={{ color: "#6b7280" }}>{act.period}</p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {act.skills.map((skill) => (
                    <span key={skill} className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(79, 70, 229, 0.1)", color: "#818cf8" }}>
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4" style={{ background: "rgba(18, 19, 42, 0.3)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4" style={{ color: "#e8eaf6" }}>
              ⭐ 성공 사례
            </h2>
            <p className="text-sm" style={{ color: "#9ca3af" }}>AI Career Navigator와 함께 성장한 사용자들의 이야기</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mockSuccessStories.map((story, i) => (
              <div
                key={i}
                className="glass-card p-6 slide-up"
                style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-current" style={{ color: "#f59e0b" }} />
                  ))}
                </div>
                <p className="text-sm mb-4 italic" style={{ color: "#d1d5db" }}>
                  &ldquo;{story.quote}&rdquo;
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold" style={{ color: "#e8eaf6" }}>{story.name}</p>
                    <p className="text-xs" style={{ color: "#9ca3af" }}>{story.company} {story.position}</p>
                  </div>
                  <span className="badge-success badge text-xs">{story.improvement}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="glass-card p-12 pulse-glow"
            style={{ border: "1px solid rgba(124, 58, 237, 0.2)" }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: "#e8eaf6" }}>
              지금 바로 <span className="gradient-text">커리어 분석</span>을 시작하세요
            </h2>
            <p className="text-base mb-8" style={{ color: "#9ca3af" }}>
              무료로 시작하고, AI가 제안하는 맞춤형 성장 계획을 확인하세요
            </p>
            <Link href="/dashboard" className="btn-gradient text-lg px-10 py-4 inline-flex items-center gap-2">
              무료로 시작하기
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center justify-center gap-6 mt-6">
              {["무료 사용", "3분 완료", "즉시 분석"].map((item) => (
                <div key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" style={{ color: "#10b981" }} />
                  <span className="text-sm" style={{ color: "#9ca3af" }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

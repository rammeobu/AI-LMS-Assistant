"use client";

import { useEffect, useState } from "react";
import { 
  User,
  GraduationCap, 
  Target, 
  Code, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { completeOnboarding } from "@/app/actions/user";

const ROLES = [
  { id: "frontend", label: "프론트엔드", desc: "사용자 인터페이스 및 웹 기술" },
  { id: "backend", label: "백엔드", desc: "서버 아키텍처 및 DB 설계" },
  { id: "fullstack", label: "풀스택", desc: "프론트와 백엔드 통합 개발" },
  { id: "ai_ml", label: "AI / 머신러닝", desc: "데이터 모델링 및 엔진 개발" },
  { id: "data_eng", label: "데이터 엔지니어", desc: "파이프라인 및 데이터 인프라" },
  { id: "mobile", label: "모바일 앱", desc: "iOS 및 Android 네이티브 앱" },
];

const SKILLS_LIST = [
  "React", "Next.js", "TypeScript", "Python", "FastAPI", "Go", "Docker", "AWS", 
  "PostgreSQL", "Redis", "Spring Boot", "Kotlin", "Swift", "Flutter", "PyTorch"
];

const STATUS_OPTIONS = [
  { id: "student", label: "전공 학부생" },
  { id: "휴학생", label: "휴학생" },
  { id: "취준생", label: "졸업 후 취준생" },
  { id: "비전공", label: "비전공 입문자" },
];

const STEPS = [
  { id: 1, title: "기초 정보", desc: "전공 및 학적 상태" },
  { id: 2, title: "희망 직무/커리어", desc: "지향하는 목표 설정" },
  { id: 3, title: "보유 기술 역량", desc: "경험해본 기술 선택" },
  { id: 4, title: "AI 분석 및 결과", desc: "맞춤 로드맵 생성" },
];

export default function OnboardingPage() {
  const { 
    step, nextStep, prevStep, formData, setFormData, toggleSkill, reset 
  } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize store on mount
  useEffect(() => {
    return () => reset();
  }, [reset]);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await completeOnboarding(formData);
      // Hard redirect to clear middleware cache and ensure fresh session check
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("정보 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-outfit">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-emerald-50 rounded-full blur-[120px]" />
      </div>

      <div className="container mx-auto px-6 py-12 lg:py-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-16 items-start">
          
          {/* Left Column: Milestone Navigator (Sticky) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 mb-12 lg:mb-0">
             {/* 자체 Navbar 삭제됨 (전역 Navbar 사용) */}

             <nav className="flex flex-col gap-10 relative ml-4">
                {/* Vertical Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gray-100 z-0" />
                
                {STEPS.map((s) => {
                  const isActive = step === s.id;
                  const isCompleted = step > s.id;
                  return (
                    <div key={s.id} className="relative z-10 flex items-start gap-4 transition-all duration-300">
                      <div className={`w-8 h-8 rounded-full border-[3px] bg-white flex items-center justify-center shrink-0 transition-all ${
                        isCompleted ? "border-emerald-500 text-emerald-500" :
                        isActive ? "border-primary text-primary shadow-lg shadow-primary/20 scale-110" :
                        "border-gray-200 text-gray-300"
                      }`}>
                         {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <span className="text-xs font-bold">{s.id}</span>}
                      </div>
                      <div className={`flex flex-col flex-1 ${isActive ? "opacity-100" : "opacity-40"}`}>
                        <h4 className={`font-bold text-sm ${isActive ? "text-gray-900" : "text-gray-500"}`}>{s.title}</h4>
                        <span className="text-[10px] font-bold text-gray-400 mt-0.5">{s.desc}</span>
                      </div>
                    </div>
                  );
                })}
             </nav>
          </div>

          {/* Right Column: Step Content */}
          <div className="lg:col-span-3">
             <div className="max-w-3xl animate-in fade-in slide-in-from-right-8 duration-700">
                
                {step === 1 && (
                  <section className="glass-card p-8 md:p-12 border-gray-100 shadow-xl overflow-hidden animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center">
                          <User className="text-primary w-6 h-6" />
                       </div>
                       <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">기본 정보를 알려주세요</h2>
                    </div>

                    <div className="space-y-8">
                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">성함</label>
                        <input 
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ name: e.target.value })}
                          placeholder="실명을 입력해주세요"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-900 placeholder:text-gray-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">주전공 / 학과</label>
                        <input 
                          type="text"
                          value={formData.major}
                          onChange={(e) => setFormData({ major: e.target.value })}
                          placeholder="예: 컴퓨터공학부, 소프트웨어학과"
                          className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-5 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-900 placeholder:text-gray-300"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-widest">학적 상태</label>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                          {STATUS_OPTIONS.map(opt => (
                            <button
                              key={opt.id}
                              onClick={() => setFormData({ status: opt.id })}
                              className={`p-4 rounded-xl border text-sm font-bold transition-all ${
                                formData.status === opt.id 
                                  ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                  : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-16 flex justify-end">
                      <button 
                        onClick={nextStep}
                        disabled={!formData.name || !formData.major}
                        className="flex items-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                      >
                        다음 분석 단계 <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </section>
                )}

                {step === 2 && (
                  <section className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                          <Target className="text-emerald-500 w-6 h-6" />
                       </div>
                       <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">지향하는 커리어 목표를 선택하세요</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {ROLES.map((role) => {
                        const isSelected = formData.interest_role === role.id;
                        return (
                          <button
                            key={role.id}
                            onClick={() => setFormData({ interest_role: role.id })}
                            className={`flex flex-col items-start p-6 rounded-2xl border transition-all group ${
                              isSelected 
                                ? `bg-primary border-primary text-white shadow-xl shadow-primary/20` 
                                : "bg-white border-gray-100 text-gray-900 hover:border-primary/30 hover:bg-gray-50"
                            }`}
                          >
                            <span className={`font-extrabold text-lg mb-1 ${isSelected ? "text-white" : "group-hover:text-primary transition-colors"}`}>{role.label}</span>
                            <p className={`text-xs font-semibold text-left ${isSelected ? "text-white/70" : "text-gray-400"}`}>{role.desc}</p>
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-16 flex justify-between">
                      <button onClick={prevStep} className="text-gray-400 font-bold hover:text-gray-900 transition-colors uppercase tracking-widest text-xs">이전 단계로</button>
                      <button 
                        onClick={nextStep}
                        disabled={!formData.interest_role}
                        className="flex items-center gap-2 bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg active:scale-[0.98] disabled:opacity-50"
                      >
                        기술 역량 진단 시작 <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </section>
                )}

                {step === 3 && (
                  <section className="animate-in fade-in slide-in-from-right-8 duration-500 shadow-xl glass-card p-10">
                    <div className="flex items-center gap-3 mb-8">
                       <div className="w-12 h-12 rounded-2xl bg-purple-50 border border-purple-100 flex items-center justify-center">
                          <Code className="text-purple-500 w-6 h-6" />
                       </div>
                       <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">보유한 핵심 기술이 있나요?</h2>
                    </div>
                    <p className="text-gray-400 font-bold mb-10 text-sm">경험해 본 기술을 선택하시면 더욱 정교한 마일스톤 제안이 가능합니다.</p>

                    <div className="flex flex-wrap gap-2 mb-10">
                      {SKILLS_LIST.map((skill) => {
                        const isSelected = formData.skills.includes(skill);
                        return (
                          <button
                            key={skill}
                            onClick={() => toggleSkill(skill)}
                            className={`px-5 py-2.5 rounded-xl border text-sm font-bold transition-all ${
                              isSelected 
                                ? "bg-gray-900 border-gray-900 text-white shadow-md" 
                                : "bg-white border-gray-200 text-gray-500 hover:border-gray-800 hover:text-gray-900"
                            }`}
                          >
                            {skill}
                          </button>
                        );
                      })}
                    </div>

                    <div className="mt-16 flex justify-between gap-4">
                      <button onClick={prevStep} className="text-gray-400 font-bold hover:text-gray-900 transition-colors uppercase tracking-widest text-xs">이전 단계로</button>
                      <button 
                        onClick={nextStep}
                        className="flex items-center gap-2 bg-primary text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg shadow-primary/40 active:scale-[0.98]"
                      >
                        최종 분석 결과 생성 <Sparkles className="w-5 h-5" />
                      </button>
                    </div>
                  </section>
                )}

                {step === 4 && (
                  <section className="flex flex-col items-center justify-center text-center py-20 animate-in zoom-in duration-700">
                    <div className="relative w-40 h-40 mb-12">
                      <div className="absolute inset-0 rounded-full border-4 border-primary/10" />
                      <div className="absolute inset-0 rounded-full border-t-4 border-primary animate-spin" style={{ animationDuration: '1.5s' }} />
                      <div className="absolute inset-0 flex items-center justify-center">
                         <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
                            <Sparkles className="w-10 h-10 text-primary" />
                         </div>
                      </div>
                    </div>
                    
                    <h2 className="text-5xl font-black text-gray-900 mb-6 tracking-tighter">
                      거의 다 되었습니다!
                    </h2>
                    <p className="text-gray-500 text-xl font-semibold max-w-lg leading-relaxed mb-12">
                      당신의 데이터를 바탕으로 AI가 <span className="text-primary font-bold">128개의 커리어 지표</span>를 머신러닝 분석하여 맞춤 정예 로드맵을 구축하고 있습니다.
                    </p>

                    <button
                      onClick={handleComplete}
                      disabled={isSubmitting}
                      className="group relative flex items-center gap-4 bg-gray-900 text-white px-12 py-5 rounded-2xl font-extrabold text-lg hover:scale-105 transition-all shadow-xl disabled:opacity-50 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 className="animate-spin" /> : (
                        <>나만의 성장 지도 확인 <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" /></>
                      )}
                    </button>
                  </section>
                )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

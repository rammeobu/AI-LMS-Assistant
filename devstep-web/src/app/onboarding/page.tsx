"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User,
  MapPin,
  Target, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2,
  ChevronRight,
  Loader2
} from "lucide-react";
import { useOnboardingStore } from "@/store/useOnboardingStore";
import { completeUnifiedOnboarding } from "@/app/actions/user";

const ROLES = [
  { id: "frontend", label: "프론트엔드", desc: "사용자 인터페이스 및 웹 기술" },
  { id: "backend", label: "백엔드", desc: "서버 아키텍처 및 DB 설계" },
  { id: "fullstack", label: "풀스택", desc: "프론트와 백엔드 통합 개발" },
  { id: "ai_ml", label: "AI / 머신러닝", desc: "데이터 모델링 및 엔진 개발" },
  { id: "data_eng", label: "데이터 엔지니어", desc: "파이프라인 및 데이터 인프라" },
  { id: "mobile", label: "모바일 앱", desc: "iOS 및 Android 네이티브 앱" },
];

const REGIONS = [
  { id: "seoul", label: "서울" },
  { id: "gyeonggi", label: "경기" },
  { id: "incheon", label: "인천" },
  { id: "chungcheong", label: "충청" },
  { id: "gyeongsang", label: "경상" },
  { id: "jeolla", label: "전라" },
  { id: "gangwon", label: "강원" },
  { id: "jeju", label: "제주" },
  { id: "overseas", label: "해외" },
];

const STEPS = [
  { id: 1, title: "기본 정보", desc: "성함 및 거주 지역" },
  { id: 2, title: "관심 커리어", desc: "목표 직무 설정" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { 
    step, nextStep, prevStep, formData, setFormData, reset 
  } = useOnboardingStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize store on mount
  useEffect(() => {
    return () => reset();
  }, [reset]);

  const handleComplete = async () => {
    setIsSubmitting(true);
    try {
      await completeUnifiedOnboarding({
        name: formData.name,
        region: formData.region,
        interests: [formData.interest_role],
      });
      router.push("/dashboard");
    } catch (error) {
      console.error("Onboarding error:", error);
      alert("정보 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-outfit">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden text-primary/5">
         <Sparkles className="absolute top-20 right-20 w-64 h-64 opacity-20" />
      </div>

      <div className="container mx-auto px-6 py-12 lg:py-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          
          {/* Progress Header */}
          <div className="flex items-center justify-between mb-16">
            <div className="flex items-center gap-4">
              {STEPS.map((s) => (
                <div key={s.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    step >= s.id ? "bg-primary border-primary text-white" : "border-gray-200 text-gray-300"
                  }`}>
                    {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                  </div>
                  {s.id === 1 && <div className={`w-12 h-0.5 rounded-full ${step > 1 ? "bg-primary" : "bg-gray-100"}`} />}
                </div>
              ))}
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Step {step} of 2</span>
              <h3 className="text-lg font-bold text-gray-900">{STEPS[step-1].title}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Content Area */}
            <div className="md:col-span-12">
              
              {step === 1 && (
                <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                      만나서 반가워요! <br/>
                      <span className="text-primary">기본 프로필</span>을 완성해볼까요?
                    </h2>
                    <p className="text-gray-500 font-medium">서비스 이용을 위한 최소한의 정보만 알려주세요.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Nickname Input */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                        <User className="w-3 h-3" /> 닉네임
                      </label>
                      <input 
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ name: e.target.value })}
                        placeholder="활동할 닉네임을 입력하세요"
                        className="w-full bg-gray-50 border border-gray-100 rounded-2xl p-6 focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-900 text-xl"
                      />
                    </div>

                    {/* Region Selection */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                        <MapPin className="w-3 h-3" /> 대략적인 거주 지역
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {REGIONS.map(reg => (
                          <button
                            key={reg.id}
                            onClick={() => setFormData({ region: reg.id })}
                            className={`py-3 rounded-xl border text-sm font-bold transition-all ${
                              formData.region === reg.id 
                                ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" 
                                : "bg-white border-gray-100 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {reg.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-8 flex justify-end">
                    <button 
                      onClick={nextStep}
                      disabled={!formData.name || !formData.region}
                      className="group flex items-center gap-3 bg-gray-900 text-white px-12 py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl disabled:opacity-50 active:scale-[0.98]"
                    >
                      다음 단계로
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </section>
              )}

              {step === 2 && (
                <section className="animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
                  <div className="space-y-4">
                    <h2 className="text-4xl font-black text-gray-900 tracking-tighter">
                      어떤 <span className="text-primary">커리어</span>를 <br/>
                      지향하고 계신가요?
                    </h2>
                    <p className="text-gray-500 font-medium">가장 관심 있는 직무 하나를 선택해 주세요.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ROLES.map((role) => {
                      const isSelected = formData.interest_role === role.id;
                      return (
                        <button
                          key={role.id}
                          onClick={() => setFormData({ interest_role: role.id })}
                          className={`flex flex-col items-start p-6 rounded-2xl border transition-all text-left ${
                            isSelected 
                              ? `bg-primary border-primary text-white shadow-xl shadow-primary/20` 
                              : "bg-white border-gray-100 text-gray-900 hover:border-primary/30 hover:bg-gray-50"
                          }`}
                        >
                          <span className={`font-extrabold text-lg mb-1`}>{role.label}</span>
                          <p className={`text-xs font-semibold ${isSelected ? "text-white/70" : "text-gray-400"}`}>{role.desc}</p>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-8 flex items-center justify-between">
                    <button onClick={prevStep} className="text-gray-400 font-bold hover:text-gray-900 transition-colors uppercase tracking-widest text-xs">이전 단계로</button>
                    <button 
                      onClick={handleComplete}
                      disabled={!formData.interest_role || isSubmitting}
                      className="group flex items-center gap-3 bg-primary text-white px-12 py-5 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/30 disabled:opacity-50 active:scale-[0.98]"
                    >
                      {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                        <>
                          온보딩 완료 및 대시보드 입장
                          <Sparkles className="w-5 h-5" />
                        </>
                      )}
                    </button>
                  </div>
                </section>
              )}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

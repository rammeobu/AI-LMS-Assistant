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
];

export default function OnboardingPage() {
  const router = useRouter();
  const { 
    step, formData, setFormData, reset 
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
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary border-primary text-white flex items-center justify-center text-sm font-bold shadow-lg shadow-primary/20">
                  <User className="w-5 h-5" />
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">Final Step</span>
              <h3 className="text-lg font-bold text-gray-900">{STEPS[0].title}</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            
            {/* Content Area */}
            <div className="md:col-span-12">
              
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
                    onClick={handleComplete}
                    disabled={!formData.name || !formData.region || isSubmitting}
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
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

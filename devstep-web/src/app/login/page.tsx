import Image from "next/image";
import AuthForm from "@/components/auth/AuthForm";
import Link from "next/link";
import { Sparkles, Target, Rocket } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-white">
      
      {/* Left Panel: Graphic & Branding (Hidden on mobile) */}
      <div className="hidden lg:flex w-[55%] relative bg-black overflow-hidden flex-col justify-between p-12">
        {/* Dynamic Dark Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-gray-900 to-black z-0" />
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0 mix-blend-overlay" />
        
        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full mix-blend-screen filter blur-[120px] opacity-40 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-screen filter blur-[120px] opacity-30" />

        {/* Top Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
            <span className="text-black font-extrabold text-xl font-outfit">D</span>
          </div>
          <span className="text-white font-extrabold text-2xl font-outfit tracking-tight">DevStep.</span>
        </div>

        {/* Center Copy */}
        <div className="relative z-10 mb-20 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
             <Sparkles className="w-4 h-4 text-yellow-300" />
             <span className="text-white text-xs font-bold tracking-wide uppercase">AI Career Navigator</span>
          </div>
          <h1 className="text-5xl lg:text-6xl text-white font-extrabold leading-[1.1] tracking-tighter mb-6">
            커리어 플랜의<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
              완벽한 나침반
            </span>
          </h1>
          <p className="text-gray-300 text-lg font-medium leading-relaxed">
            방황하는 주니어 개발자와 취준생을 위한 맞춤형 AI 역량 진단. 매일 작은 액션 플랜을 실천하며 당신만의 성장 지도를 완성하세요.
          </p>

          <div className="mt-12 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                 <Target className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">객관적 스펙 핏 분석</h4>
                <p className="text-gray-400 text-sm">마일스톤 달성을 위한 최적의 스터디와 해커톤을 모니터링합니다.</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                 <Rocket className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <h4 className="text-white font-bold text-base">스마트 어젠다 타임라인</h4>
                <p className="text-gray-400 text-sm">학사 일정과 겹치지 않는 효율적인 페이스 메이커.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer Info */}
        <div className="relative z-10 flex justify-between items-center border-t border-white/10 pt-8">
          <p className="text-gray-500 text-sm font-medium">© 2026 DevStep Inc. AI-Driven Analytics.</p>
          <div className="flex gap-4">
             <div className="flex -space-x-2">
                {[1,2,3,4].map(idx => (
                  <div key={idx} className="w-8 h-8 rounded-full border-2 border-gray-900 bg-gray-800 flex items-center justify-center overflow-hidden">
                    <img src={`https://i.pravatar.cc/100?img=${idx * 10}`} alt="avatar" className="w-full h-full object-cover" />
                  </div>
                ))}
             </div>
             <div className="flex flex-col justify-center">
                <span className="text-white text-xs font-bold leading-tight">10,000+</span>
                <span className="text-gray-500 text-[10px] font-bold">크루 합류</span>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Auth Form Module */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center relative px-6 md:px-16 overflow-y-auto bg-[#FDFDFD]">
        
        {/* Mobile Header (Only visible on small screens) */}
        <div className="absolute top-8 left-6 lg:hidden flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md">
            <span className="text-white font-extrabold text-lg font-outfit">D</span>
          </div>
          <span className="text-gray-900 font-extrabold text-xl font-outfit tracking-tight">DevStep.</span>
        </div>
        
        {/* Top Right Actions */}
        <div className="absolute top-8 right-8 hidden md:block">
           <Link href="/dashboard" className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors">
             대시보드 미리보기
           </Link>
        </div>

        <AuthForm />

      </div>

    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";

export default function AuthForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleLogin = (provider: string) => {
    setIsLoading(provider);
    // Mocking an async login request
    setTimeout(() => {
      router.push("/dashboard");
    }, 1200);
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="text-center mb-10">
        <div className="w-12 h-12 bg-primary rounded-xl mx-auto mb-6 shadow-lg flex items-center justify-center transition-transform hover:scale-105 duration-300">
          <span className="text-white font-extrabold text-2xl font-outfit tracking-tighter">D</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">환영합니다</h1>
        <p className="text-sm text-gray-500 font-medium">DevStep과 함께 고속 성장을 시작하세요.</p>
      </div>

      <div className="flex flex-col gap-4 mb-8">
        
        {/* Kakao Auth Mock */}
        <button 
          onClick={() => handleLogin('kakao')}
          disabled={isLoading !== null}
          className="w-full relative flex items-center justify-center p-4 bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] font-bold rounded-2xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100 group"
        >
          {isLoading === 'kakao' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              {/* Kakao logo path mock */}
              <svg className="w-5 h-5 absolute left-5" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 4.64c-6.96 0-12.64 4.48-12.64 10.08 0 3.52 2.32 6.64 5.76 8.48l-1.44 5.44c-.16.56.4.96.88.64l6.4-4.24c.32 0 .64.08.96.08 6.96 0 12.64-4.48 12.64-10.08S22.96 4.64 16 4.64z" fill="#000"/>
              </svg>
              카카오로 3초 만에 시작하기
            </>
          )}
        </button>

        {/* Github Auth Mock */}
        <button 
          onClick={() => handleLogin('github')}
          disabled={isLoading !== null}
          className="w-full relative flex items-center justify-center p-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
        >
          {isLoading === 'github' ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <svg className="w-5 h-5 absolute left-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              Github 계정으로 로그인
            </>
          )}
        </button>

        {/* Google Auth Mock (using generic SVG) */}
        <button 
          onClick={() => handleLogin('google')}
          disabled={isLoading !== null}
          className="w-full relative flex items-center justify-center p-4 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-2xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
        >
            {isLoading === 'google' ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
            <>
              <svg className="w-5 h-5 absolute left-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google 계정으로 로그인
            </>
          )}
        </button>

      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-white text-gray-500 font-medium">또는 이메일로 계속하기</span>
        </div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); handleLogin('email'); }}>
        <div>
          <input 
            type="email" 
            placeholder="이메일 주소" 
            className="w-full px-5 py-4 border border-gray-200 rounded-2xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
          />
        </div>
        <button 
          type="submit"
          disabled={isLoading !== null}
          className="w-full py-4 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-2xl transition-all shadow-sm flex items-center justify-center gap-2 group disabled:opacity-70"
        >
          {isLoading === 'email' ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              계속하기 <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <p className="mt-8 text-center text-xs text-gray-400 font-medium leading-relaxed">
        계속 진행함으로써 DevStep의 <a href="#" className="underline hover:text-gray-600 transition-colors">이용약관</a> 및 <a href="#" className="underline hover:text-gray-600 transition-colors">개인정보처리방침</a>에 동의하게 됩니다.
      </p>

    </div>
  );
}

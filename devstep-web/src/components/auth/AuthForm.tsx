"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { Provider } from "@supabase/supabase-js";
import { signInWithEmail, signUpWithEmail } from "@/app/actions/auth";

export default function AuthForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const supabase = createClient();

  // 마운트 시 상태 초기화 및 이미 로그인된 경우 리다이렉트
  useEffect(() => {
    const handlePageShow = (event: PageTransitionEvent) => {
      // bfcache(뒤로가기 캐시)로부터 복구된 경우 로딩 상태 초기화
      if (event.persisted) {
        setIsLoading(null);
        setErrorMessage(null);
      }
    };

    window.addEventListener('pageshow', handlePageShow);
    
    // 초기 로드 시에도 기본적으로 초기화
    setIsLoading(null);
    setErrorMessage(null);

    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        router.push("/dashboard");
      }
    };
    checkSession();

    return () => {
      window.removeEventListener('pageshow', handlePageShow);
    };
  }, [router, supabase.auth]);

  // OAuth 처리
  const handleOAuth = async (provider: Provider) => {
    setIsLoading(provider);
    setErrorMessage(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      console.error(`${provider} login error:`, error.message);
      setErrorMessage(`${provider} 로그인 중 오류가 발생했습니다.`);
      setIsLoading(null);
    }
  };

  // 이메일 로그인/회원가입 처리
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading('email');
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    
    let result;
    if (mode === 'signup') {
      result = await signUpWithEmail(formData);
    } else {
      result = await signInWithEmail(formData);
    }

    if (result?.error) {
      setErrorMessage(result.error);
      setIsLoading(null);
    } else if (result?.success) {
      if (mode === 'signup' && result.message) {
        alert(result.message);
      }
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="w-full max-w-sm mx-auto flex flex-col justify-center animate-in fade-in slide-in-from-bottom-8 duration-700">
      
      <div className="text-center mb-10">
        <div className="w-12 h-12 bg-primary rounded-xl mx-auto mb-6 shadow-lg flex items-center justify-center transition-transform hover:scale-105 duration-300">
          <span className="text-white font-extrabold text-2xl font-outfit tracking-tighter">D</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-3">
          {mode === 'signup' ? '고속 성장 시작하기' : '다시 오신 것을 환영합니다'}
        </h1>
        <p className="text-sm text-gray-500 font-medium">
          {mode === 'signup' ? 'DevStep과 함께 커리어 지도를 완성하세요.' : '로그인하여 나침바를 확인하세요.'}
        </p>
      </div>

      {errorMessage && (
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-2xl flex items-start gap-3 animate-in fade-in zoom-in duration-300">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <p className="text-sm font-bold text-rose-600 leading-tight">{errorMessage}</p>
        </div>
      )}

      <div className="flex flex-col gap-3 mb-8">
        {/* Social Buttons */}
        <button 
          onClick={() => handleOAuth('kakao')}
          disabled={isLoading !== null}
          className="w-full relative flex items-center justify-center p-4 bg-[#FEE500] hover:bg-[#FDD800] text-[#191919] font-bold rounded-2xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-70 group"
        >
          {isLoading === 'kakao' ? <Loader2 className="w-5 h-5 animate-spin" /> : '카카오로 시작하기'}
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => handleOAuth('github')}
            disabled={isLoading !== null}
            className="flex items-center justify-center gap-2 p-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading === 'github' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Github'}
          </button>
          <button 
            onClick={() => handleOAuth('google')}
            disabled={isLoading !== null}
            className="flex items-center justify-center gap-2 p-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 font-bold rounded-2xl transition-all shadow-sm active:scale-[0.98] disabled:opacity-70"
          >
            {isLoading === 'google' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Google'}
          </button>
        </div>
      </div>

      <div className="relative mb-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
        <div className="relative flex justify-center text-xs"><span className="px-4 bg-white text-gray-400 font-bold uppercase tracking-widest">or email</span></div>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input 
          name="email"
          type="email" 
          placeholder="이메일 주소" 
          required
          className="w-full px-5 py-4 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
        />
        <input 
          name="password"
          type="password" 
          placeholder="비밀번호" 
          required
          className="w-full px-5 py-4 border border-gray-100 rounded-2xl bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-sm font-medium"
        />
        
        <button 
          type="submit"
          disabled={isLoading !== null}
          className="w-full py-4 bg-gray-900 hover:bg-black text-white font-bold rounded-2xl transition-all shadow-xl shadow-gray-200 flex items-center justify-center gap-2 group disabled:opacity-70"
        >
          {isLoading === 'email' ? <Loader2 className="w-5 h-5 animate-spin" /> : (
            <>
              {mode === 'signup' ? '계정 만들기' : '로그인'} 
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>
      </form>

      <div className="mt-8 text-center pt-2 border-t border-gray-50">
        <button 
          onClick={() => setMode(mode === 'signup' ? 'login' : 'signup')}
          className="text-sm font-bold text-gray-500 hover:text-primary transition-colors duration-200"
        >
          {mode === 'signup' ? '이미 계정이 있으신가요? 로그인' : '처음이신가요? 회원가입'}
        </button>
      </div>

      <p className="mt-8 text-center text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
        By continuing, you agree to our <br/>
        <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>
      </p>

    </div>
  );
}

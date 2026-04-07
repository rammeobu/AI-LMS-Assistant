"use client";
import Link from "next/link";
import { Compass, Mail, Lock, User, School, BookOpen, Target, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password) {
      setError("모든 필드를 입력해 주세요.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (res.ok) {
        // 회원가입 성공 후 자동 로그인 시도
        const loginRes = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (!loginRes?.error) {
          setStep(2); // 로그인까지 성공하면 2단계 프로필 설정으로 넘어감
        } else {
          router.push("/login");
        }
      } else {
        const data = await res.json();
        setError(data.message || "회원가입에 실패했습니다.");
      }
    } catch (err) {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #4f46e5)" }}>
              <Compass className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl gradient-text">AI Career Navigator</span>
          </Link>
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#e8eaf6" }}>
            {step === 1 ? "계정 만들기" : "프로필 설정"}
          </h1>
          <p className="text-sm" style={{ color: "#9ca3af" }}>
            {step === 1 ? "간단한 정보 입력으로 시작하세요" : "AI 분석을 위한 기본 정보를 입력하세요"}
          </p>
        </div>

        {/* Steps indicator */}
        <div className="flex items-center justify-center gap-3 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                style={{
                  background: step >= s ? "linear-gradient(135deg, #7c3aed, #4f46e5)" : "rgba(30, 31, 59, 0.8)",
                  color: step >= s ? "white" : "#6b7280",
                  border: step >= s ? "none" : "1px solid rgba(124, 58, 237, 0.2)",
                }}
              >
                {s}
              </div>
              {s < 2 && (
                <div className="w-16 h-0.5" style={{ background: step > 1 ? "linear-gradient(90deg, #7c3aed, #4f46e5)" : "rgba(124, 58, 237, 0.15)" }} />
              )}
            </div>
          ))}
        </div>

        <div className="glass-card p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {step === 1 ? (
            <div className="space-y-4">
              {/* Social */}
              <div className="space-y-3 mb-6">
                <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80" style={{ background: "#ffffff", color: "#1f2937" }}>
                  <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                  Google로 회원가입
                </button>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 h-px" style={{ background: "rgba(124, 58, 237, 0.15)" }} />
                <span className="text-xs" style={{ color: "#6b7280" }}>또는 이메일로 가입</span>
                <div className="flex-1 h-px" style={{ background: "rgba(124, 58, 237, 0.15)" }} />
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="floating-label">이름</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7280" }} />
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="홍길동" className="input-field pl-11" />
                  </div>
                </div>
                <div>
                  <label className="floating-label">이메일</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7280" }} />
                    <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="name@example.com" className="input-field pl-11" />
                  </div>
                </div>
                <div>
                  <label className="floating-label">비밀번호</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7280" }} />
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="8자 이상 입력하세요" className="input-field pl-11" />
                  </div>
                </div>

                <button type="submit" disabled={loading} className="btn-gradient w-full flex items-center justify-center gap-2 py-3 mt-2">
                  {loading ? "처리중..." : "다음 단계"}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="floating-label">학교</label>
                <div className="relative">
                  <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7280" }} />
                  <input type="text" placeholder="서울대학교" className="input-field pl-11" />
                </div>
              </div>
              <div>
                <label className="floating-label">전공</label>
                <div className="relative">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7280" }} />
                  <input type="text" placeholder="컴퓨터공학과" className="input-field pl-11" />
                </div>
              </div>
              <div>
                <label className="floating-label">학년</label>
                <select className="input-field">
                  <option value="">선택하세요</option>
                  <option value="1">1학년</option>
                  <option value="2">2학년</option>
                  <option value="3">3학년</option>
                  <option value="4">4학년</option>
                  <option value="5">대학원</option>
                </select>
              </div>
              <div>
                <label className="floating-label">관심 직무</label>
                <div className="relative">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7280" }} />
                  <input type="text" placeholder="백엔드 개발자" className="input-field pl-11" />
                </div>
              </div>
              <div>
                <label className="floating-label">목표 분야</label>
                <select className="input-field">
                  <option value="">선택하세요</option>
                  <option value="it">IT/소프트웨어</option>
                  <option value="data">데이터/AI</option>
                </select>
              </div>

              <div className="flex gap-3 mt-2">
                <Link href="/dashboard" className="flex-1 btn-gradient flex items-center justify-center gap-2 py-3">
                  시작하기
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          <p className="text-center text-sm mt-6" style={{ color: "#9ca3af" }}>
            이미 계정이 있으신가요?{" "}
            <Link href="/login" className="font-semibold" style={{ color: "#7c3aed" }}>로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

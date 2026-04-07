"use client";
import Link from "next/link";
import { Compass, Mail, Lock, ArrowRight } from "lucide-react";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("이메일 또는 비밀번호가 잘못되었습니다.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err) {
      setError("로그인 중 오류가 발생했습니다.");
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
          <h1 className="text-2xl font-bold mb-2" style={{ color: "#e8eaf6" }}>돌아오신 것을 환영합니다</h1>
          <p className="text-sm" style={{ color: "#9ca3af" }}>계속하려면 로그인하세요</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80" style={{ background: "#ffffff", color: "#1f2937" }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
              Google로 계속하기
            </button>
            <button className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 hover:opacity-80" style={{ background: "#FEE500", color: "#1f2937" }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="#3C1E1E"><path d="M12 3C6.48 3 2 6.48 2 10.8c0 2.76 1.84 5.18 4.6 6.56-.2.72-.72 2.6-.83 3-.13.48.18.47.37.34.15-.1 2.4-1.63 3.36-2.3.82.12 1.66.2 2.5.2 5.52 0 10-3.48 10-7.8S17.52 3 12 3z"/></svg>
              카카오로 계속하기
            </button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: "rgba(124, 58, 237, 0.15)" }} />
            <span className="text-xs" style={{ color: "#6b7280" }}>또는 이메일로 로그인</span>
            <div className="flex-1 h-px" style={{ background: "rgba(124, 58, 237, 0.15)" }} />
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm text-center">
              {error}
            </div>
          )}

          {/* Email/Password */}
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <div>
                <label className="floating-label">이메일</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7280" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="input-field pl-11"
                  />
                </div>
              </div>
              <div>
                <label className="floating-label">비밀번호</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7280" }} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="비밀번호를 입력하세요"
                    className="input-field pl-11"
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 mb-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 rounded" style={{ accentColor: "#7c3aed" }} />
                <span className="text-sm" style={{ color: "#9ca3af" }}>로그 유지</span>
              </label>
              <a href="#" className="text-sm font-medium" style={{ color: "#7c3aed" }}>비밀번호 찾기</a>
            </div>

            <button type="submit" className="btn-gradient w-full flex items-center justify-center gap-2 py-3">
              로그인
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#9ca3af" }}>
            아직 계정이 없으신가요?{" "}
            <Link href="/register" className="font-semibold" style={{ color: "#7c3aed" }}>회원가입</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

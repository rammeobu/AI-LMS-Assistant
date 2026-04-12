"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Save, 
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from "lucide-react";
import { getUserProfile, updateUserProfile } from "@/app/actions/user";
import { UserProfile } from "@/types/user";

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [newSkill, setNewSkill] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      const { data, error } = await getUserProfile();
      if (error || !data) {
        console.error("Failed to fetch profile:", error);
        router.push("/login");
        return;
      }
      setProfile(data);
      setIsLoading(false);
    };
    fetchProfile();
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    setIsSaving(true);
    setSaveStatus('idle');

    const result = await updateUserProfile({
      name: profile.name,
      avatar_url: profile.avatar_url,
    });

    if (result.success) {
      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } else {
      setSaveStatus('error');
    }
    setIsSaving(false);
  };

  const addSkill = () => {
    if (newSkill.trim() && profile && !profile.skills?.includes(newSkill.trim())) {
      setProfile({
        ...profile,
        skills: [...(profile.skills || []), newSkill.trim()]
      });
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    if (profile) {
      setProfile({
        ...profile,
        skills: (profile.skills || []).filter(s => s !== skillToRemove)
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 pt-24 font-outfit">
      <div className="max-w-3xl mx-auto px-4">
        
        {/* Header Navigation */}
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold text-sm">돌아가기</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden"
        >
          {/* Cover / Profile Header */}
          <div className="h-32 bg-gradient-to-r from-primary/10 via-purple-500/10 to-pink-500/10 relative" />
          
          <div className="px-8 pb-10">
            <div className="relative -mt-12 mb-8 flex items-end gap-6">
              <div className="w-24 h-24 rounded-3xl bg-white p-1.5 shadow-lg relative">
                <div className="w-full h-full rounded-[22px] bg-gray-100 overflow-hidden border border-gray-100 flex items-center justify-center">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="profile" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-gray-400" />
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white">
                  <span className="text-xs font-bold">LV.1</span>
                </div>
              </div>
              <div className="mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{profile?.name || "사용자"}</h1>
                <p className="text-gray-500 text-sm font-medium">{profile?.email}</p>
              </div>
            </div>

            <div className="space-y-12">
              {/* Account Settings Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" /> 기본 계정 정보
                  </h2>
                </div>
                
                <form onSubmit={handleSave} className="space-y-6 bg-gray-50/50 p-6 rounded-3xl border border-gray-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Nickname Input */}
                    <div className="space-y-4">
                      <label className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                        <User className="w-4 h-4" /> 닉네임
                      </label>
                      <input 
                        type="text"
                        value={profile?.name || ""}
                        onChange={(e) => setProfile(prev => prev ? {...prev, name: e.target.value} : null)}
                        placeholder="활동할 닉네임을 입력하세요"
                        className="w-full bg-white border border-gray-100 rounded-2xl p-4 focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-gray-900"
                      />
                    </div>

                    {/* Email (Readonly) */}
                    <div className="space-y-2 opacity-60">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest px-1">
                        이메일 (변경 불가)
                      </label>
                      <div className="w-full px-5 py-4 bg-gray-100 border border-gray-100 rounded-2xl font-medium text-gray-500 flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        {profile?.email}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <button 
                      type="submit"
                      disabled={isSaving}
                      className="px-8 py-3.5 bg-gray-900 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-black transition-all disabled:opacity-50"
                    >
                      {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      변경사항 저장
                    </button>
                  </div>
                </form>
              </section>

              {/* Career Diagnostic Section */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" /> 커리어 정밀 진단 데이터
                  </h2>
                </div>

                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-[32px] p-8 text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] -mr-32 -mt-32" />
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-3">상세 진단 정보 관리를 원하시나요?</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
                      전공, 핵심 기술, 지향하는 커리어 도메인 등 분석에 필요한 데이터는 
                      정밀 진단 프로세스를 통해 더욱 정교하게 업데이트할 수 있습니다. 
                      기존 데이터를 유지한 채로 수정이 가능합니다.
                    </p>
                    
                    <button 
                      onClick={() => router.push("/setup/point-a")}
                      className="flex items-center gap-3 px-6 py-4 bg-white text-gray-900 rounded-2xl font-bold hover:bg-primary hover:text-white transition-all group/btn"
                    >
                      커리어 정밀 진단 수정하기
                      <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </section>

              {/* Feedback Toast */}
              <AnimatePresence>
                {saveStatus !== 'idle' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className={`fixed bottom-10 left-1/2 -translate-x-1/2 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 font-bold z-50 ${
                      saveStatus === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                    }`}
                  >
                    {saveStatus === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {saveStatus === 'success' ? '프로필이 성공적으로 업데이트되었습니다.' : '저장에 실패했습니다. 다시 시도해주세요.'}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-xs text-gray-400 font-medium">
          프로필 정보는 AI 분석 및 커리어 로드맵 추천에 활용됩니다.
        </p>
      </div>
    </div>
  );
}

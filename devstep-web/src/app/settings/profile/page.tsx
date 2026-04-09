"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Briefcase, 
  GraduationCap, 
  Code2, 
  Save, 
  ArrowLeft,
  X,
  Plus,
  Loader2,
  CheckCircle2,
  AlertCircle
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
      major: profile.major,
      status: profile.status,
      interest_role: profile.interest_role,
      skills: profile.skills,
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

            <form onSubmit={handleSave} className="space-y-8">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                    <User className="w-3 h-3" /> 이름
                  </label>
                  <input 
                    type="text"
                    value={profile?.name || ""}
                    onChange={(e) => setProfile(prev => prev ? {...prev, name: e.target.value} : null)}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-gray-800"
                    placeholder="이름을 입력하세요"
                  />
                </div>

                {/* Major Input */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                    <GraduationCap className="w-3 h-3" /> 전공
                  </label>
                  <input 
                    type="text"
                    value={profile?.major || ""}
                    onChange={(e) => setProfile(prev => prev ? {...prev, major: e.target.value} : null)}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-gray-800"
                    placeholder="예: 컴퓨터공학"
                  />
                </div>

                {/* Status Select */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                    <CheckCircle2 className="w-3 h-3" /> 현재 상태
                  </label>
                  <select 
                    value={profile?.status || ""}
                    onChange={(e) => setProfile(prev => prev ? {...prev, status: e.target.value} : null)}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-gray-800 appearance-none"
                  >
                    <option value="student">재학생</option>
                    <option value="graduate">졸업예정자/졸업생</option>
                    <option value="jobseeker">취업 준비 중</option>
                    <option value="junior">주니어 직장인</option>
                  </select>
                </div>

                {/* Interest Role */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                    <Briefcase className="w-3 h-3" /> 관심 직무
                  </label>
                  <input 
                    type="text"
                    value={profile?.interest_role || ""}
                    onChange={(e) => setProfile(prev => prev ? {...prev, interest_role: e.target.value} : null)}
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-gray-800"
                    placeholder="예: 백엔드 개발자"
                  />
                </div>
              </div>

              {/* Skills Section */}
              <div className="space-y-4 pt-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 px-1">
                  <Code2 className="w-3 h-3" /> 보유 기술 스택
                </label>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <AnimatePresence>
                    {profile?.skills?.map((skill) => (
                      <motion.span
                        key={skill}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary/5 text-primary rounded-xl text-sm font-bold border border-primary/10 group active:scale-95 transition-transform"
                      >
                        {skill}
                        <button 
                          type="button"
                          onClick={() => removeSkill(skill)}
                          className="p-0.5 hover:bg-primary/10 rounded-full transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  
                  <div className="relative inline-flex items-center">
                    <input 
                      type="text"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addSkill();
                        }
                      }}
                      placeholder="기술 추가 (예: React, Node.js)"
                      className="px-3 py-1.5 bg-white border border-dashed border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-48"
                    />
                    <button 
                      type="button"
                      onClick={addSkill}
                      className="absolute right-2 p-1 text-gray-400 hover:text-primary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Submit / Feedback */}
              <div className="pt-8 border-t border-gray-50 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-3">
                  <AnimatePresence mode="wait">
                    {saveStatus === 'success' && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-xl text-sm font-bold"
                      >
                        <CheckCircle2 className="w-4 h-4" /> 성공적으로 저장되었습니다.
                      </motion.div>
                    )}
                    {saveStatus === 'error' && (
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2 text-rose-600 bg-rose-50 px-4 py-2 rounded-xl text-sm font-bold"
                      >
                        <AlertCircle className="w-4 h-4" /> 저장에 실패했습니다. 다시 시도해주세요.
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full md:w-auto px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-black transition-all shadow-xl shadow-gray-200 disabled:opacity-70 group"
                >
                  {isSaving ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      프로필 저장하기
                      <Save className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
        </motion.div>

        <p className="mt-8 text-center text-xs text-gray-400 font-medium">
          프로필 정보는 AI 분석 및 커리어 로드맵 추천에 활용됩니다.
        </p>
      </div>
    </div>
  );
}

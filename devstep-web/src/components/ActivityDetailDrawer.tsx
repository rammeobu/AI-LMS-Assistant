"use client";

import { X, CalendarPlus, CheckCircle2, ShieldAlert, Code2, ChevronRight, Users, ExternalLink, MapPin, Calendar, Loader2, Plus, Minus, Send, Info } from "lucide-react";
import { useEffect, useState } from "react";
import { addActivityToCalendar } from "../app/actions/calendarActions";
import { createTeamPost, getTeamPostsByActivity, applyToTeam } from "../app/actions/teamActions";

interface ActivityDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Record<string, any> | null;
}

const TECH_STACKS = ["React", "Next.js", "TypeScript", "Node.js", "Python", "SpringBoot", "Designer", "PM", "Flutter"];

export default function ActivityDetailDrawer({ isOpen, onClose, activity }: ActivityDetailDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  
  // 모집글 관련 상태
  const [isPosting, setIsPosting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingTeams, setIsLoadingTeams] = useState(false);
  const [teamList, setTeamList] = useState<any[]>([]);

  // 모집글 입력 폼 상태
  const [postTitle, setPostTitle] = useState("");
  const [maxMembers, setMaxMembers] = useState(4);
  const [selectedStacks, setSelectedStacks] = useState<string[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen && activity?.id) {
      document.body.style.overflow = "hidden";
      setIsAdded(false);
      setIsPosting(false);
      
      // 드로어 열릴 때 해당 활동의 팀 리스트 가져오기
      fetchTeams(activity.id);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen, activity]);

  const fetchTeams = async (crawlingId: number) => {
    setIsLoadingTeams(true);
    try {
      const res = await getTeamPostsByActivity(crawlingId);
      if (res.success) {
        setTeamList(res.data || []);
      }
    } finally {
      setIsLoadingTeams(false);
    }
  };

  if (!mounted) return null;

  const handleAddToCalendar = async () => {
    if (!activity?.id || isAdding || isAdded) return;
    setIsAdding(true);
    try {
      const res = await addActivityToCalendar(Number(activity.id));
      if (res.success) setIsAdded(true);
      else alert(res.error || "실패");
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmitPost = async () => {
    if (!activity?.id || !postTitle) return;
    setIsSubmitting(true);
    try {
      const res = await createTeamPost({
        crawlingId: activity.id,
        title: postTitle,
        description: "", // 필요 시 추가 입력 구현 가능
        requiredStacks: selectedStacks,
        maxMembers: maxMembers
      });
      if (res.success) {
        setIsPosting(false);
        setPostTitle("");
        setSelectedStacks([]);
        // 새 게시글 작성 후 리스트 새로고침
        await fetchTeams(activity.id);
      } else {
        alert(res.error);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApply = async (postId: string) => {
    const msg = prompt("함께하고 싶은 열정을 간단히 적어주세요!");
    if (!msg) return;
    const res = await applyToTeam(postId, msg);
    if (res.success) {
      alert("지원이 완료되었습니다! 팀장의 확인을 기다려주세요.");
      await fetchTeams(activity!.id);
    } else {
      alert(res.error);
    }
  };

  const toggleStack = (stack: string) => {
    setSelectedStacks(prev => 
      prev.includes(stack) ? prev.filter(s => s !== stack) : [...prev, stack]
    );
  };

  return (
    <>
      <div className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`} onClick={onClose} />

      <div className={`fixed top-0 right-0 h-[100dvh] w-full max-w-2xl bg-white shadow-2xl z-[101] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        <div className="sticky top-0 bg-white/95 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 bg-primary rounded-full shadow-[0_0_10px_rgba(37,99,235,0.5)] animate-pulse"></div>
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Live Recruiting Hub</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="w-5 h-5 text-gray-400" /></button>
        </div>

        {activity && (
          <div className="p-6 md:p-10 flex flex-col gap-10">
            {/* 상단 기본 정보 */}
            <div className="flex flex-col gap-5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-primary bg-primary/5 border border-primary/10 px-2.5 py-1 rounded-lg uppercase tracking-wider">{activity.tag}</span>
              </div>
              <h2 className="text-3xl font-black text-gray-900 leading-[1.2] tracking-tighter">{activity.title}</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-3xl border border-gray-50">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-primary"><Users className="w-5 h-5" /></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Host</p>
                      <p className="text-sm font-bold text-gray-700">{activity.organization || "제공처 미지정"}</p>
                    </div>
                 </div>
                 <div className="flex items-center gap-4 p-5 bg-gray-50/50 rounded-3xl border border-gray-50">
                    <div className="p-3 bg-white rounded-2xl shadow-sm text-primary"><Calendar className="w-5 h-5" /></div>
                    <div>
                      <p className="text-[10px] font-black text-gray-300 uppercase tracking-widest">Deadline</p>
                      <p className="text-sm font-bold text-gray-700">{activity.period || "상시 모집"}</p>
                    </div>
                 </div>
              </div>
            </div>

            {/* 상세 설명 */}
            <div className="bg-white rounded-[32px] border border-gray-100 p-8 shadow-sm relative group overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-[0.03] rotate-12 transition-transform group-hover:rotate-0"><Info className="w-20 h-20 text-black" /></div>
               <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                 <div className="w-1.5 h-5 bg-primary rounded-full"></div>
                 활동 상세 인자
               </h3>
               <div className="text-gray-600 leading-[1.8] text-base whitespace-pre-wrap font-medium">
                  {activity.description || "본 활동에 대한 구체적인 설명이 아직 로드되지 않았습니다."}
               </div>
            </div>

            {/* 액션 버튼 그룹 */}
            <div className="flex flex-col sm:flex-row gap-4">
              {activity.homepage && (
                <a href={activity.homepage} target="_blank" className="flex-1 py-5 bg-gray-900 text-white font-black rounded-3xl text-sm flex justify-center items-center gap-2.5 hover:bg-black transition-all shadow-xl shadow-gray-200">
                   <ExternalLink className="w-5 h-5" /> 공식 사이트 방문
                </a>
              )}
              <button onClick={handleAddToCalendar} disabled={isAdding || isAdded} className={`flex-1 py-5 font-black rounded-3xl text-sm flex justify-center items-center gap-2.5 border transition-all ${isAdded ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-white text-primary border-primary/20 hover:bg-primary/5"}`}>
                {isAdding ? <Loader2 className="w-5 h-5 animate-spin" /> : (isAdded ? <CheckCircle2 className="w-5 h-5" /> : <CalendarPlus className="w-5 h-5" />)}
                {isAdded ? "관심 활동 저장됨" : "내 보드에 추가"}
              </button>
            </div>

            <div className="h-px bg-gray-100/50 w-full" />

            {/* 실시간 커뮤니티 섹션 (DB 연동 완료) */}
            <div className="flex flex-col gap-6">
              <div className="flex justify-between items-end">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">함께 도전할 동료</h3>
                  <p className="text-sm text-gray-400 font-bold mt-2">DB에 등록된 {teamList.length}개의 모집 소식이 있습니다.</p>
                </div>
                {!isPosting && (
                  <button onClick={() => setIsPosting(true)} className="px-6 py-3.5 bg-primary text-white rounded-2xl text-xs font-black shadow-lg shadow-primary/25 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                    <Plus className="w-4 h-4" /> 모집 시작하기
                  </button>
                )}
              </div>

              {isPosting ? (
                <div className="bg-gray-50 border-2 border-primary/10 rounded-[40px] p-8 shadow-inner animate-in slide-in-from-bottom-5 duration-500">
                  <div className="flex justify-between items-center mb-8">
                    <div className="flex items-center gap-2">
                       <div className="p-2 bg-primary rounded-lg text-white"><Code2 className="w-5 h-5" /></div>
                       <h4 className="font-black text-gray-900 text-lg tracking-tight">팀 빌딩 제안서</h4>
                    </div>
                    <button onClick={() => setIsPosting(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="space-y-8">
                    <div className="group">
                      <label className="text-[10px] font-black text-gray-400 mb-2.5 block uppercase tracking-[0.2em] group-focus-within:text-primary transition-colors">공고 제목</label>
                      <input value={postTitle} onChange={e => setPostTitle(e.target.value)} placeholder="팀의 아이덴티티가 담긴 멋진 제목!" className="w-full px-5 py-4.5 rounded-2xl border-gray-100 bg-white placeholder:text-gray-300 focus:ring-4 focus:ring-primary/5 focus:border-primary text-base font-bold transition-all" />
                    </div>

                    <div>
                      <label className="text-[10px] font-black text-gray-400 mb-4 block uppercase tracking-[0.2em]">필요한 팀원 스택</label>
                      <div className="flex flex-wrap gap-2.5">
                        {TECH_STACKS.map(stack => (
                          <button key={stack} onClick={() => toggleStack(stack)} className={`px-5 py-2.5 rounded-2xl text-[11px] font-black transition-all ${selectedStacks.includes(stack) ? "bg-primary text-white shadow-xl shadow-primary/30 -translate-y-1" : "bg-white text-gray-400 border border-gray-100 hover:text-primary hover:border-primary/20"}`}>
                            {stack}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-gray-50 shadow-sm transition-all hover:shadow-md">
                      <div>
                        <span className="text-[10px] font-black text-gray-400 block mb-1 uppercase tracking-widest">Team Size</span>
                        <p className="text-sm text-gray-500 font-bold">리더 포함 모집 정원</p>
                      </div>
                      <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100">
                        <button onClick={() => setMaxMembers(m => Math.max(2, m-1))} className="w-10 h-10 bg-white shadow-sm text-gray-400 rounded-xl flex items-center justify-center hover:text-primary hover:shadow transition-all"><Minus className="w-5 h-5" /></button>
                        <span className="text-2xl font-black text-primary min-w-[32px] text-center">{maxMembers}</span>
                        <button onClick={() => setMaxMembers(m => Math.min(10, m+1))} className="w-10 h-10 bg-white shadow-sm text-gray-400 rounded-xl flex items-center justify-center hover:text-primary hover:shadow transition-all"><Plus className="w-5 h-5" /></button>
                      </div>
                    </div>

                    <button onClick={handleSubmitPost} disabled={isSubmitting || !postTitle} className="w-full py-5.5 bg-primary text-white font-black rounded-[32px] shadow-[0_20px_40px_-10px_rgba(37,99,235,0.4)] flex justify-center items-center gap-3 hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 text-base tracking-tight">
                      {isSubmitting ? <Loader2 className="animate-spin w-6 h-6" /> : <Send className="w-6 h-6" />}
                      팀 모집 공고 게시하기
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-5">
                  {isLoadingTeams ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-3 text-primary animate-pulse">
                      <Loader2 className="w-10 h-10 animate-spin" />
                      <p className="text-xs font-black uppercase tracking-widest">📡 Connecting to Team-DB...</p>
                    </div>
                  ) : teamList.length === 0 ? (
                    <div className="py-20 text-center bg-gray-50/50 rounded-[48px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-4 group hover:bg-primary/5 transition-all">
                       <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110"><Plus className="w-10 h-10 text-gray-100" /></div>
                       <p className="text-gray-400 font-black text-xs uppercase tracking-widest">No active recruitment found</p>
                    </div>
                  ) : (
                    teamList.map((team, i) => (
                      <div key={i} className="group p-8 rounded-[40px] border border-gray-50 bg-white hover:border-primary/30 hover:shadow-[0_30px_60px_-15px_rgba(37,99,235,0.08)] transition-all relative overflow-hidden">
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                              <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-600 text-[9px] font-black rounded-xl border border-emerald-100 tracking-[0.1em] shadow-sm">ACTIVE RECRUIT</span>
                              <div className="h-4 w-px bg-gray-100" />
                              <span className="text-[10px] text-gray-400 font-black flex items-center gap-1.5 whitespace-nowrap"><div className="w-1.5 h-1.5 bg-gray-200 rounded-full" /> {team.leader?.name || "익명"} LEADER</span>
                            </div>
                            <h4 className="text-xl font-extrabold text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-relaxed tracking-tight">{team.title}</h4>
                          </div>
                          <button onClick={() => handleApply(team.id)} className="shrink-0 px-8 py-4 bg-gray-900 text-white text-[11px] font-black rounded-2xl hover:bg-primary hover:shadow-xl hover:shadow-primary/20 transition-all active:scale-95">JOIN CREW</button>
                        </div>
                        <div className="mt-8 flex flex-wrap gap-2">
                          {team.required_stacks?.map((s: string) => (
                            <span key={s} className="px-3.5 py-1.5 bg-gray-50 text-gray-400 text-[10px] font-black rounded-2xl border border-gray-50 group-hover:bg-primary/5 group-hover:text-primary transition-all tracking-tight">{s}</span>
                          ))}
                        </div>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/2 rounded-full -mr-16 -mt-16 group-hover:bg-primary/5 transition-all" />
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

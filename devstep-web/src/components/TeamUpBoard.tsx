"use client";

import { CheckCircle2, ChevronRight, Code2, ShieldAlert, Loader2, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllTeamPosts, applyToTeam } from "../app/actions/teamActions";

export default function TeamUpBoard() {
  const [teams, setTeams] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    setIsLoading(true);
    const res = await getAllTeamPosts();
    if (res.success) {
      setTeams(res.data || []);
    }
    setIsLoading(false);
  };

  const handleApply = async (postId: string) => {
    const msg = prompt("함께하고 싶은 열정을 간단히 적어주세요!");
    if (!msg) return;
    const res = await applyToTeam(postId, msg);
    if (res.success) {
      alert("지원이 완료되었습니다!");
      fetchTeams();
    } else {
      alert(res.error);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-primary animate-pulse">
        <Loader2 className="w-10 h-10 animate-spin" />
        <p className="text-xs font-black uppercase tracking-widest">Loading Live Recruitment...</p>
      </div>
    );
  }

  if (teams.length === 0) {
    return (
      <div className="py-20 text-center bg-gray-50/50 rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-4">
        <Users className="w-10 h-10 text-gray-200" />
        <p className="text-gray-400 font-bold">진행 중인 팀원 모집이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {teams.map((team) => (
        <div key={team.id} className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-white hover:border-primary/20 hover:shadow-lg relative overflow-hidden group">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <span className="px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">
                {team.status === 'recruiting' ? '모집중' : '모집완료'}
              </span>
              <span className="text-xs font-bold text-gray-400">
                {team.activity?.organization || "자체 프로젝트"}
              </span>
            </div>
            
            <h3 className="text-lg font-black text-gray-900 mb-2 group-hover:text-primary transition-colors">{team.title}</h3>
            
            {team.activity && (
              <p className="text-xs text-gray-400 font-medium mb-4 flex items-center gap-1">
                📅 {team.activity.title}
              </p>
            )}

            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-gray-400" />
              {team.required_stacks?.map((stack: string) => (
                <span key={stack} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 text-[10px] font-bold rounded-lg group-hover:bg-primary/5 group-hover:text-primary transition-all">
                  {stack}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-end gap-3 min-w-[180px]">
            <div className="flex flex-col items-end mb-1">
              <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">Leader</span>
              <span className="text-sm font-bold text-gray-700">{team.leader?.name || "익명"}</span>
            </div>
            
            <button 
              onClick={() => handleApply(team.id)}
              className="w-full px-5 py-2.5 bg-gray-900 text-white hover:bg-primary transition-all rounded-xl text-xs font-black flex justify-center items-center gap-2 shadow-sm"
            >
              팀 합류 신청 <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/2 rounded-full -mr-12 -mt-12 group-hover:bg-primary/5 transition-all" />
        </div>
      ))}
    </div>
  );
}

"use client";

import { X, CalendarPlus, CheckCircle2, ShieldAlert, Code2, ChevronRight, Users, ExternalLink, MapPin, Calendar, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { addActivityToCalendar } from "../app/actions/calendarActions";

interface ActivityDetailDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Record<string, any> | null;
}

export default function ActivityDetailDrawer({ isOpen, onClose, activity }: ActivityDetailDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setIsAdded(false); 
      console.log("[Drawer] Opened with activity:", activity);
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen, activity]);

  if (!mounted) return null;

  const handleAddToCalendar = async () => {
    if (!activity?.id) {
      console.error("[Drawer] ABORT - No activity ID found");
      alert("활동 정보를 찾을 수 없습니다.");
      return;
    }
    
    if (isAdding || isAdded) return;
    
    console.log(`[Drawer] CLICK - Attempting to add crawlingId: ${activity.id}`);
    setIsAdding(true);
    
    try {
      const res = await addActivityToCalendar(Number(activity.id));
      console.log("[Drawer] SERVER RESPONSE:", res);
      
      if (res.success) {
        setIsAdded(true);
      } else {
        console.error("[Drawer] SERVER ERROR:", res.error);
        alert(res.error || "일정 추가에 실패했습니다.");
      }
    } catch (err) {
      console.error("[Drawer] UNEXPECTED CLIENT ERROR:", err);
      alert("서버와 통신하는 중 오류가 발생했습니다.");
    } finally {
      setIsAdding(false);
    }
  };

  const dummyTeams = [
    { title: `${activity?.title || ''} 스터디 및 토이 프로젝트 팀원 모집`, req: ["React", "Spring"], match: 85, status: "모집중 (1/4)" },
    { title: "같이 과제 공략하실 분 (매주 화요일 저녁)", req: ["Node.js"], match: 40, status: "모집중 (2/3)" },
    { title: "사이드 프로젝트로 이어서 하실 백엔드 1분!", req: ["Python", "FastAPI"], match: 60, status: "모집중 (3/4)", highlight: true },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      <div className={`fixed top-0 right-0 h-[100dvh] w-full max-w-2xl bg-white shadow-2xl z-[101] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] flex flex-col overflow-y-auto ${isOpen ? "translate-x-0" : "translate-x-full"}`}>

        <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex justify-between items-center z-10">
          <span className="text-xs font-bold text-gray-400">Activity Details &amp; Team Matching</span>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {activity && (
          <div className="p-6 md:p-8 flex flex-col gap-8">

            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="w-full md:w-48 h-48 rounded-2xl shrink-0 shadow-md" style={{ background: activity.gradient || 'linear-gradient(135deg, #f6d365, #fda085)' }}>
              </div>

              <div className="flex flex-col flex-1">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded w-fit mb-3 flex items-center gap-1.5">
                  <ActivityTypeIndicator type={activity.tag || "기본태그"} /> {activity.tag}
                </span>
                <h2 className="text-2xl font-extrabold text-gray-900 leading-tight mb-2">{activity.title}</h2>

                {activity.organization && (
                  <p className="text-sm font-bold text-primary/70 mb-1">🏢 {activity.organization}</p>
                )}

                {activity.period && (
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mb-1">
                    <Calendar className="w-4 h-4" /> {activity.period}
                  </p>
                )}

                {activity.target && (
                  <p className="text-sm text-gray-500 font-medium flex items-center gap-1.5 mb-3">
                    <MapPin className="w-4 h-4" /> 대상: {activity.target}
                  </p>
                )}

                <div className="flex flex-col sm:flex-row gap-3 mt-2">
                  {activity.homepage && (
                    <a
                      href={activity.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-3 bg-gray-900 text-white font-bold rounded-xl text-sm flex justify-center items-center gap-2 hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" /> 홈페이지 바로가기
                    </a>
                  )}
                  <button 
                    id="add-to-calendar-btn"
                    onClick={handleAddToCalendar}
                    disabled={isAdding || isAdded}
                    className={`flex-1 py-3 font-bold rounded-xl text-sm flex justify-center items-center gap-2 transition-all shadow-sm ${
                      isAdded 
                        ? "bg-emerald-50 text-emerald-600 border border-emerald-100 cursor-default" 
                        : "bg-primary text-white hover:bg-primary/90"
                    } disabled:opacity-70`}
                  >
                    {isAdding ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isAdded ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : (
                      <CalendarPlus className="w-4 h-4" />
                    )}
                    {isAdding ? "추가 중..." : isAdded ? "캘린더에 추가됨" : "내 캘린더에 추가"}
                  </button>
                </div>
              </div>
            </div>

            {activity.description && (
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-6">
                <h3 className="text-sm font-bold text-gray-900 mb-3">📄 상세 내용</h3>
                <p className="text-sm text-gray-600 font-medium leading-relaxed whitespace-pre-line">
                  {activity.description}
                </p>
              </div>
            )}

            <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
              <h3 className="text-sm font-bold text-gray-900 flex items-center gap-2 mb-4">
                ✨ AI 스펙 핏 리포트
              </h3>
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                현재 사용자님의 역량 레이더와 비교할 때, 이 활동은 <span className="font-extrabold text-primary">&apos;{activity.tag}&apos;</span> 분야의 공백을 완벽하게 메워줍니다. 해당 수료증을 획득 시 <b>총점 12% 상승 효율</b>을 기대할 수 있습니다.
              </p>
            </div>

            <hr className="border-gray-100" />

            <div>
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Users className="w-5 h-5 text-primary" /> 이 활동을 준비하는 동료들
                  </h3>
                  <p className="text-xs text-gray-500 mt-1 font-medium">활동 인증서를 공유하며 함께 빌드업 할 팀원을 모집하세요.</p>
                </div>
                <button className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                  모집글 쓰기
                </button>
              </div>

              <div className="flex flex-col gap-4">
                {dummyTeams.map((team, i) => (
                  <div key={i} className={`p-5 rounded-2xl border transition-all hover:shadow-md bg-white ${team.highlight ? "border-primary/40 ring-1 ring-primary/20" : "border-gray-100"}`}>
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] font-bold rounded">
                            {team.status}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-gray-900 mb-3">{team.title}</h4>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <Code2 className="w-3.5 h-3.5 text-gray-400" />
                          {team.req.map(stack => (
                            <span key={stack} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-500 text-[10px] rounded-full">
                              {stack}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col items-end min-w-[100px]">
                        <span className="text-[10px] font-bold text-gray-400 mb-1">스펙 매칭률</span>
                        {team.match >= 80 ? (
                          <span className="flex items-center gap-1 text-sm font-extrabold text-emerald-600">
                            <CheckCircle2 className="w-4 h-4" /> {team.match}%
                          </span>
                        ) : team.match >= 50 ? (
                          <span className="flex items-center gap-1 text-sm font-extrabold text-orange-500">
                            <ShieldAlert className="w-4 h-4" /> {team.match}%
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-sm font-bold text-gray-400">
                            {team.match}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-50">
                      <button className="w-full py-2 bg-gray-50 hover:bg-primary hover:text-white transition-colors rounded-lg text-xs font-bold flex justify-center items-center gap-1.5 border border-gray-100 hover:border-primary">
                        나의 스펙 인증서 첨부하여 지원 <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}
      </div>
    </>
  );
}

function ActivityTypeIndicator({ type }: { type: string }) {
  if (type.includes("공모전")) return <span>🏆</span>;
  if (type.includes("대외활동")) return <span>🌍</span>;
  if (type.includes("스터디")) return <span>📚</span>;
  if (type.includes("해커톤")) return <span>⚡</span>;
  if (type.includes("교육")) return <span>🎓</span>;
  if (type.includes("서포터즈")) return <span>📣</span>;
  if (type.includes("채용")) return <span>💼</span>;
  return <span>💻</span>;
}

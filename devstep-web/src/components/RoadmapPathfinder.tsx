import { useState, useEffect } from "react";
import Link from "next/link";
import { getOnboardingSurvey } from "@/app/actions/user";
import { getAIMatchedActivities } from "@/app/actions/match";
import { 
  CheckCircle2, 
  CalendarPlus, 
  ChevronRight, 
  ChevronDown,
  ChevronUp,
  Target,
  Sparkles,
  Zap,
  Loader2,
  CheckCircle,
  Circle,
  PlayCircle,
  X,
  BookOpen,
  ArrowRight
} from "lucide-react";
import { getActiveRoadmap, updateTopicStatus } from "@/app/actions/roadmap";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function RoadmapPathfinder() {
  const [selectedJob, setSelectedJob] = useState("");
  const [isSubTasksExpanded, setIsSubTasksExpanded] = useState(false);

  // AI Matching States
  const [aiActivities, setAiActivities] = useState<any[]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // AI Roadmap Data States
  const [roadmap, setRoadmap] = useState<any>(null);
  const [isRoadmapLoading, setIsRoadmapLoading] = useState(true);
  const [roadmapError, setRoadmapError] = useState<string | null>(null);

  // Topic Detail (Side Panel) States
  const [selectedTopic, setSelectedTopic] = useState<any>(null);

  // Onboarding status check
  const [hasSurvey, setHasSurvey] = useState<boolean | null>(null); // null: checking, false: no survey, true: exists

  const fetchRoadmap = async () => {
    const { data, error } = await getActiveRoadmap();
    if (error) {
      setRoadmapError(error);
      setIsRoadmapLoading(false);
      return null;
    } else if (data) {
      setRoadmap(data);
      setRoadmapError(null);
      // 더 이상 생성 중이 아니면 로딩 종료
      if (data.status !== "generating") {
        setIsRoadmapLoading(false);
      }
      return data;
    } else {
      setIsRoadmapLoading(false);
      return null;
    }
  };

  // ── Polling Logic (비동기 생성 대응) ──
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let isMounted = true;

    const poll = async () => {
      if (!isMounted) return;

      const latest = await fetchRoadmap();
      
      // 상태가 여전히 생성 중이면 다시 폴링 예약
      if (latest && (latest.status === "generating" || latest.status === "pending")) {
        timeoutId = setTimeout(poll, 3000);
      }
    };

    if (isRoadmapLoading || (roadmap && (roadmap.status === "generating" || roadmap.status === "pending"))) {
      timeoutId = setTimeout(poll, 3000);
    }

    return () => {
      isMounted = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isRoadmapLoading, roadmap?.status]);

  // ── Initialization Fetch ──
  useEffect(() => {
    async function init() {
      // 1. 유저 목표 직무 및 진단 데이터 존재 여부 확인
      const { data: surveyData } = await getOnboardingSurvey();
      if (surveyData && surveyData.point_a) {
        setHasSurvey(true);
        setSelectedJob(surveyData.point_a.target_job || (surveyData.point_a.interests?.[0] || ""));
      } else {
        setHasSurvey(false);
      }
      // 2. 활성화된 로드맵 가져오기
      await fetchRoadmap();
    }
    init();
  }, []);

  // ── 토픽 상태 변경 함수 ──
  const handleToggleTopic = async (topicId: string, currentStatus: string) => {
    const nextStatus = currentStatus === "completed" ? "todo" : currentStatus === "todo" ? "in_progress" : "completed";
    const res = await updateTopicStatus(topicId, nextStatus as any);
    if ((res as any).status === "success" || res.data) {
      // 로드맵 데이터 로컬 업데이트 (빠른 UI 반응 위해)
      setRoadmap((prev: any) => {
        if (!prev) return prev;
        const newRoadmap = { ...prev };
        newRoadmap.milestones = newRoadmap.milestones.map((m: any) => ({
          ...m,
          topics: m.topics.map((t: any) => t.id === topicId ? { ...t, status: nextStatus } : t)
        }));
        return newRoadmap;
      });
    }
  };

  // ── 데이터 변환: Backend Roadmap -> UI Steps ──
  const roadmapSteps = roadmap?.milestones?.map((m: any, idx: number) => {
    const totalTopics = m.topics.length;
    const completedTopics = m.topics.filter((t: any) => t.status === "completed").length;
    const inProgressTopics = m.topics.filter((t: any) => t.status === "in_progress").length;
    
    let status = "pending";
    if (completedTopics === totalTopics && totalTopics > 0) status = "completed";
    else if (completedTopics > 0 || inProgressTopics > 0) status = "current";
    else if (idx === 0) status = "current"; // 첫 단계는 기본적으로 진행 유도

    return {
      id: m.id,
      title: m.title,
      status: status,
      desc: `${completedTopics}/${totalTopics} 달성`,
      subTasks: m.topics.map((t: any) => ({
        id: t.id,
        title: t.title,
        status: t.status,
        content: t.content_md
      })),
      raw: m
    };
  }) || [];

  const currentIndex = roadmapSteps.findIndex((s: any) => s.status === "current");
  const [selectedStepIdx, setSelectedStepIdx] = useState(0);

  // Selected StepIndex 동기화 (로드맵 최초 로드 시)
  useEffect(() => {
    if (roadmapSteps.length > 0 && currentIndex !== -1) {
      setSelectedStepIdx(currentIndex);
    }
  }, [roadmapSteps.length]);

  const selectedStep = roadmapSteps[selectedStepIdx];

  // ── AI 추천 로직 (마일스톤이나 직무가 바뀔 때 실행) ──
  useEffect(() => {
    async function fetchAIRecommendations() {
      if (!selectedJob) return;
      
      setIsAILoading(true);
      setAiError(null);

      // 현재 선택된 마일스톤의 모든 토픽에서 기술 스택 추출 (Flatten)
      let targetSkills: string[] = [];
      if (selectedStep && selectedStep.subTasks) {
        const skillsSet = new Set<string>();
        selectedStep.subTasks.forEach((task: any) => {
          if (task.required_skills) {
            task.required_skills.forEach((s: string) => skillsSet.add(s));
          }
        });
        targetSkills = Array.from(skillsSet);
      }

      // 기술 스택이 없으면 직무 기반, 있으면 기술 스택 기반 매칭
      const { data, error } = await getAIMatchedActivities(selectedJob, targetSkills.length > 0 ? targetSkills : undefined);
      
      if (error) {
        setAiError(error);
        setAiActivities([]);
      } else if (data) {
        setAiActivities(data.matches || []);
      }
      setIsAILoading(false);
    }
    fetchAIRecommendations();
  }, [selectedJob, selectedStep?.id]);


  return (
    <>
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      {/* Simple Job Display */}
      <div className="glass-card overflow-hidden">
          <div className="w-full flex items-center justify-between p-5 bg-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <h2 className="text-sm font-bold text-gray-500">현재 설정된 목표 직무</h2>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-bold text-gray-900">{selectedJob || "진단 데이터 로드 중..."}</p>
                  <span className="text-[10px] bg-primary/10 text-primary font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Verified by AI</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link 
                href="/setup/point-a"
                className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-gray-600 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl transition-all group"
              >
                <Zap className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                직무 변경 (정밀 진단 다시 받기)
              </Link>
            </div>
          </div>
        </div>

        {/* Focus: Master-Detail Architecture Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8 glass-card min-h-[600px] mt-2 border border-gray-100 shadow-sm relative items-start">
          
          {/* LEFT COLUMN: Master List (Sticky) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 bg-gray-50/50 lg:bg-transparent p-6 lg:pb-6 lg:border-r border-gray-100">
             <h3 className="font-bold text-lg text-gray-900 mb-8 px-2">마일스톤 챕터</h3>
             
             <div className="relative flex flex-col gap-10 lg:gap-8 ml-3">
                {/* Vertical Connective Line */}
                <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gray-200 z-0" />
                
                {roadmapSteps.length > 0 ? (
                  roadmapSteps.map((step: any, idx: number) => {
                    const isCompleted = step.status === "completed";
                    const isCurrent = step.status === "current";
                    const isSelected = selectedStepIdx === idx;

                    return (
                      <div 
                        key={idx} 
                        onClick={() => {
                          setSelectedStepIdx(idx);
                          setIsSubTasksExpanded(false);
                        }}
                        className={`relative z-10 flex items-start gap-4 cursor-pointer group transition-all duration-300`}
                      >
                       {/* Node Circle */}
                       <div className={`w-8 h-8 rounded-full border-[3px] bg-white flex items-center justify-center shrink-0 transition-colors mt-0.5 ${
                          isCompleted ? "border-emerald-500 text-emerald-500 shadow-sm z-10" :
                          isCurrent && isSelected ? "border-primary text-primary shadow-[0_0_15px_rgba(85,82,250,0.4)] z-10 scale-110" :
                          isCurrent && !isSelected ? "border-primary/50 text-primary/50 z-10" :
                          isSelected ? "border-gray-800 bg-gray-800 text-white z-10 scale-110" :
                          "border-gray-300 hover:border-gray-400 z-10"
                       }`}>
                          {isCompleted && <CheckCircle2 className="w-5 h-5 text-emerald-500 border-none bg-white rounded-full" />}
                          {!isCompleted && isCurrent && <div className="w-2.5 h-2.5 bg-primary rounded-full animate-pulse" />}
                       </div>

                       {/* Node Text Content */}
                       <div className={`flex flex-col flex-1 transition-all ${isSelected ? "opacity-100 -translate-y-0.5" : "opacity-50 group-hover:opacity-80"}`}>
                         <h4 className={`font-bold text-sm leading-tight transition-colors ${
                            isSelected && isCurrent ? "text-primary text-base" : 
                            isSelected ? "text-gray-900 text-base" : 
                            isCompleted ? "text-gray-600 line-through decoration-gray-300" :
                            "text-gray-600"
                          }`}>
                           {step.title}
                         </h4>
                         <span className={`text-[10px] sm:text-[11px] font-bold mt-1.5 px-2 py-0.5 rounded w-fit sm:whitespace-nowrap ${
                           isCompleted ? "bg-emerald-50 text-emerald-700 font-medium" :
                           isCurrent ? "bg-primary/10 text-primary" : 
                           "bg-white border border-gray-200 text-gray-500"
                         }`}>
                           {step.desc}
                         </span>
                       </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex flex-col items-center gap-3 p-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                    <Loader2 className="w-8 h-8 text-primary animate-spin" />
                    <p className="text-sm font-bold text-gray-500">로드맵 생성 대기 중...</p>
                  </div>
                )}
              </div>
           </div>

           <div className="lg:col-span-3 p-6 lg:p-8 animate-in slide-in-from-right-4 fade-in duration-300" key={selectedStepIdx}>
              
              {(!roadmap && hasSurvey === false) ? (
                // Case 1: 정밀 진단을 안 한 경우
                <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-20 px-6">
                  <div className="w-20 h-20 bg-amber-50 rounded-3xl flex items-center justify-center border border-amber-100 shadow-sm">
                    <Target className="w-10 h-10 text-amber-500" />
                  </div>
                  <div className="max-w-md">
                    <h2 className="text-2xl font-black text-gray-900 mb-3">아직 정밀 진단 전이시네요!</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      AI 로드맵을 설계하기 위해서는 현재의 기술 스택과<br/> 
                      지향하는 목표를 먼저 파악해야 합니다.
                    </p>
                  </div>
                  <Link 
                    href="/setup/point-a"
                    className="flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-primary/20"
                  >
                    커리어 정밀 진단 시작하기
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              ) : (!roadmap && hasSurvey === true && !isRoadmapLoading) ? (
                // Case 2: 진단은 했으나 생성된 로드맵이 없는 경우
                <div className="flex flex-col items-center justify-center h-full gap-6 text-center py-20 px-6">
                  <div className="w-20 h-20 bg-primary/5 rounded-3xl flex items-center justify-center border border-primary/10 shadow-sm">
                    <Sparkles className="w-10 h-10 text-primary" />
                  </div>
                  <div className="max-w-md">
                    <h2 className="text-2xl font-black text-gray-900 mb-3">로드맵을 생성할 준비가 되었습니다</h2>
                    <p className="text-gray-500 font-medium leading-relaxed">
                      작성해주신 진단 데이터를 바탕으로<br/>
                      Gemini AI가 최적의 이직 패스를 설계해 드립니다.
                    </p>
                  </div>
                  <button 
                    onClick={() => {
                      // 여기에 로드맵 생성 트리거 로직 추가 가능
                      // 현재는 진단 페이지 마지막에서 자동 트리거됨을 가정
                      window.location.href = "/setup/point-a"; // 다시 진단 페이지로 가거나 명시적 생성 액션 호출
                    }}
                    className="flex items-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-gray-200"
                  >
                    AI 로드맵 생성 시작
                    <Zap className="w-5 h-5 text-yellow-400" />
                  </button>
                </div>
              ) : (!selectedStep || (roadmap && roadmap.status === "generating" && (!roadmap.milestones || roadmap.milestones.length === 0))) ? (
                // Case 3: 생성 중인 경우 (진행 상황 표시)
                <div className="flex flex-col items-center justify-center h-full gap-5 text-center py-12">
                   <div className="relative">
                      <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center animate-pulse">
                          <Sparkles className="w-12 h-12 text-primary" />
                      </div>
                      <div className="absolute inset-0 w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                   </div>
                   <div>
                     <h2 className="text-2xl font-black text-gray-900 mb-2">
                        {roadmap?.title || "당신을 위한 최적의 커리어를 설계 중입니다"}
                     </h2>
                     <p className="text-sm text-gray-500 font-medium leading-relaxed">
                       Gemini AI 모델이 직무 역량과 관심사를 분석하여<br/>
                       성공적인 이직을 위한 하이브리드 로드맵을 구성하고 있습니다.
                     </p>
                   </div>
                   <div className="flex items-center gap-2 mt-4 bg-gray-50 px-4 py-2 rounded-full border border-gray-100">
                      <span className="text-xs font-bold text-primary animate-pulse">AI 엔진 가동 중...</span>
                   </div>
                </div>
              ) : selectedStep && (!selectedStep.subTasks || selectedStep.subTasks.length === 0) ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center py-12">
                   <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center animate-spin">
                       <Loader2 className="w-8 h-8 text-primary" />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-gray-900 mb-1">상세 내용을 작성하고 있습니다</h3>
                     <p className="text-sm text-gray-500">이 단계에 필요한 핵심 토픽과 활동을 곧 불러옵니다...</p>
                   </div>
                </div>
              ) : (
                <>
                {/* Detailed Header Group */}
                <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                  <div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md mb-3 inline-block ${
                       selectedStep.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                       selectedStep.status === "current" ? "bg-primary text-white" :
                       "bg-gray-200 text-gray-600"
                    }`}>
                      {selectedStep.status === "completed" ? "✅ 달성 완료" : selectedStep.status === "current" ? "🔥 현재 집중 목표" : "🔒 진행 예정 (Locked)"}
                    </span>
                    <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{selectedStep.title}</h2>
                    <p className="text-sm font-medium text-gray-500 mt-2">이 마일스톤을 달성하여 핵심 역량을 확보하고 다음 단계로 진출하세요.</p>
                  </div>
                </div>

                {/* Milestone Progress Bar Component */}
                {selectedStep.status === "current" && (
                  <div className="mb-8 bg-white border border-gray-100 p-6 md:p-8 rounded-2xl shadow-sm">
                    <div className="flex justify-between items-end mb-4">
                      <div>
                        <span className="text-xs font-bold text-primary uppercase tracking-widest block mb-1">Target Milestone Progress</span>
                        <h5 className="font-bold text-gray-900 text-lg">핵심 과제 진행률</h5>
                      </div>
                      {(() => {
                        const total = selectedStep.subTasks.length;
                        const done = selectedStep.subTasks.filter((t: any) => t.status === 'completed').length;
                        const percent = Math.round((done / total) * 100) || 0;
                        return (
                          <div className="text-right">
                            <span className="text-xs font-bold text-gray-500 mr-2">누적 달성률</span>
                            <span className="text-4xl font-extrabold text-primary">{percent}<span className="text-xl">%</span></span>
                          </div>
                        );
                      })()}
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200 shadow-inner">
                      <div className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out relative" style={{ 
                        width: `${Math.round((selectedStep.subTasks.filter((t: any) => t.status === 'completed').length / (selectedStep.subTasks.length || 1)) * 100)}%` 
                      }}>
                         <div className="absolute inset-0 bg-white/20 w-full rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                )}

                {/* Sub-Tasks Menu Bar (Expandable) */}
                {selectedStep.subTasks && selectedStep.subTasks.length > 0 && (
                  <div className="mb-8 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                    <button 
                      onClick={() => setIsSubTasksExpanded(!isSubTasksExpanded)}
                      className="w-full p-5 bg-gray-50/80 flex items-center justify-between border-b border-gray-100 transition-colors hover:bg-gray-100/80 focus:outline-none"
                    >
                      <div className="flex items-center gap-2.5">
                        <h4 className="font-bold text-gray-900 text-base">상세 태스크 진행 현황</h4>
                        <span className="text-xs bg-primary text-white font-bold px-2 py-0.5 rounded-full shadow-sm">
                          {selectedStep.subTasks.filter((t: any) => t.status !== "todo" && t.status !== "completed").length}개 진행 중
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                        {isSubTasksExpanded ? "태스크 줄이기" : "전체 흐름 보기"}
                        {isSubTasksExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </div>
                    </button>
                    
                    <div className="p-3">
                      <ul className="flex flex-col gap-1">
                        {selectedStep.subTasks.map((task: any, idx: number) => {
                          const isCurrent = task.status === "in_progress";
                          const isCompleted = task.status === "completed";

                          if (!isSubTasksExpanded && !isCurrent && !isCompleted && idx > 0) return null;

                          return (
                            <li 
                              key={idx} 
                              className={`flex items-center gap-3 p-4 rounded-xl transition-all animate-in fade-in slide-in-from-top-2 duration-300 cursor-pointer group/item ${isCurrent ? "bg-primary/5 border border-primary/10 shadow-sm" : "hover:bg-gray-50 border border-transparent"}`}
                              onClick={() => setSelectedTopic(task)}
                            >
                              <div 
                                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${
                                  isCompleted ? "border-emerald-500 bg-emerald-500 text-white" : 
                                  isCurrent ? "border-primary bg-white shadow-sm" : "border-gray-200 bg-white"
                                } hover:scale-110`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleToggleTopic(task.id, task.status);
                                }}
                              >
                                {isCompleted ? <CheckCircle className="w-4 h-4" /> : isCurrent ? <PlayCircle className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-gray-300" />}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between">
                                  <span className={`font-bold text-sm transition-colors ${
                                    isCompleted ? "text-gray-400 line-through decoration-gray-300" :
                                    isCurrent ? "text-primary font-black scale-[1.02] origin-left" : "text-gray-700"
                                  }`}>
                                    {task.title}
                                  </span>
                                  <ArrowRight className="w-4 h-4 text-gray-300 opacity-0 group-hover/item:opacity-100 group-hover/item:translate-x-1 transition-all" />
                                </div>
                                {task.content && (
                                  <p className="text-[11px] text-gray-400 font-medium mt-1 line-clamp-1 opacity-70">
                                    {task.content.substring(0, 100)}...
                                  </p>
                                ) || (
                                  <p className="text-[11px] text-gray-300 italic mt-1">상세 가이드를 보려면 클릭하세요</p>
                                )}
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Recommendation Feed — AI Matched Data */}
                {selectedStep.status !== "pending" && (
                  <>
                    <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-lg border-t border-gray-100 pt-8 mt-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      마일스톤 돌파를 위한 AI 추천 액션
                    </h4>
                    
                    {isAILoading ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 animate-pulse">
                          <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                          <p className="text-sm font-bold text-primary">Gemini AI가 이 마일스톤에 최적인 맞춤 활동을 분석하여 매칭 중입니다...</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[1, 2].map((i) => (
                            <div key={i} className="bg-gray-50 border border-gray-100 p-5 rounded-xl h-44 animate-pulse" />
                          ))}
                        </div>
                      </div>
                    ) : aiActivities.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {aiActivities.map((activity: any) => (
                          <div key={activity.activity_id} className="bg-white border border-gray-100 p-5 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col group cursor-pointer relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Sparkles className="w-12 h-12 text-primary" />
                             </div>
                             <div className="flex justify-between items-start mb-3">
                               <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                                 AI 매칭률 {activity.score}%
                               </span>
                             </div>
                             <h5 className="font-extrabold text-gray-900 text-base mb-2 leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                               {activity.title}
                             </h5>
                             <p className="text-xs text-gray-500 mb-5 flex-1 font-medium bg-gray-50 p-3 rounded-lg border border-gray-100 line-clamp-3">
                               {activity.reason}
                             </p>
                             <button className="w-full py-2.5 bg-white hover:bg-primary hover:text-white text-gray-700 transition-colors rounded-lg text-sm font-bold flex items-center justify-center gap-2 border border-gray-200 shadow-sm hover:border-primary">
                               <CalendarPlus className="w-4 h-4" /> 캘린더에 일정 추가
                             </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-10 bg-gray-50 text-gray-400 rounded-xl text-center text-sm font-medium border border-gray-100 border-dashed">
                        유효한 추천 활동이 없습니다. 온보딩 정보를 업데이트해 보세요.
                      </div>
                    )}

                    <button className="w-full mt-6 py-3 flex items-center justify-center gap-1.5 text-sm font-bold text-primary bg-primary/5 hover:bg-primary/10 border border-primary/10 transition-colors rounded-xl">
                      맞춤형 추천 액션 모두 보기 <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}
                </>
              )}
        </div>
      </div>
    </div>
    
    {/* ── Topic Detail Side Panel ── */}
    <AnimatePresence>
      {selectedTopic && (
        <>
          {/* Overlay */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedTopic(null)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100]"
          />
          
          {/* Panel */}
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-white shadow-2xl z-[101] overflow-hidden flex flex-col border-l border-gray-100"
          >
            {/* Panel Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-black text-gray-900 leading-tight">상세 학습 가이드</h3>
                  <p className="text-[10px] uppercase font-black text-primary tracking-widest">AI Mentor Instruction</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedTopic(null)}
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto p-8 bg-gray-50/30">
              <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-primary/20" />
                
                <h2 className="text-2xl font-black text-gray-900 mb-6 leading-tight">
                  {selectedTopic.title}
                </h2>

                <div className="prose prose-sm max-w-none prose-headings:font-black prose-headings:text-gray-900 prose-p:text-gray-600 prose-p:leading-relaxed prose-strong:text-primary prose-code:bg-gray-100 prose-code:p-1 prose-code:rounded">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {selectedTopic.content || "상세 가이드 내용이 없습니다."}
                  </ReactMarkdown>
                </div>

                {/* Status Quick Action */}
                <div className="mt-12 flex items-center justify-between pt-8 border-t border-gray-100">
                   <div>
                     <p className="text-xs font-bold text-gray-400 mb-1">Current Progress</p>
                     <span className={`text-xs font-black px-2 py-1 rounded-md uppercase tracking-tight ${
                        selectedTopic.status === "completed" ? "bg-emerald-100 text-emerald-700" :
                        selectedTopic.status === "in_progress" ? "bg-primary/20 text-primary" : "bg-gray-100 text-gray-600"
                     }`}>
                        {selectedTopic.status}
                     </span>
                   </div>
                   <button 
                    onClick={() => {
                      handleToggleTopic(selectedTopic.id, selectedTopic.status);
                      // Update local state for the panel as well
                      const nextStatus = selectedTopic.status === "completed" ? "todo" : selectedTopic.status === "todo" ? "in_progress" : "completed";
                      setSelectedTopic({...selectedTopic, status: nextStatus});
                    }}
                    className={`px-6 py-3 rounded-2xl font-bold text-sm transition-all shadow-md active:scale-95 ${
                      selectedTopic.status === "completed" ? "bg-gray-100 text-gray-500" : "bg-primary text-white hover:bg-primary/90"
                    }`}
                   >
                     {selectedTopic.status === "completed" ? "다시 학습하기" : "학습 완료로 표시"}
                   </button>
                </div>
              </div>

              {/* Tips Section */}
              <div className="mt-6 p-6 bg-amber-50 rounded-2xl border border-amber-100/50 flex gap-4">
                 <Sparkles className="w-6 h-6 text-amber-500 shrink-0" />
                 <div>
                    <h5 className="font-bold text-amber-900 text-sm mb-1">AI 멘토의 팁</h5>
                    <p className="text-xs text-amber-800/80 leading-relaxed font-medium">
                      제시된 실습 가이드를 따라 직접 코드로 구현해보는 것이 가장 빠릅니다. 
                      관련 기술 스택을 마스터하면 로드맵 매칭률이 상승합니다.
                    </p>
                 </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
    </>
  );
}

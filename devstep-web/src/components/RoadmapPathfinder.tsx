"use client";

import { useState } from "react";
import { CheckCircle2, Circle, ChevronDown, ChevronUp, Search, CalendarPlus, ChevronRight } from "lucide-react";

export default function RoadmapPathfinder() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("개발/데이터");
  const [selectedJob, setSelectedJob] = useState("백엔드 엔지니어");
  const [isTimelineExpanded, setIsTimelineExpanded] = useState(false);

  // Mega Menu Data
  const categories = ["개발/데이터", "인프라/보안", "기획/PM", "디자인"];
  const subCategories: Record<string, string[]> = {
    "개발/데이터": ["백엔드 엔지니어", "프론트엔드 개발자", "AI 엔지니어", "데이터 분석가", "풀스택 개발자", "임베디드 SW"],
    "인프라/보안": ["DevOps 엔지니어", "클라우드 아키텍트", "보안 컨설턴트", "서버 관리자", "DBA"],
    "기획/PM": ["서비스 기획자", "프로덕트 오너 (PO)", "프로젝트 매니저 (PM)", "사업 기획"],
    "디자인": ["UI/UX 디자이너", "프로덕트 디자이너", "인터랙션 디자이너", "그래픽 디자이너"],
  };

  // Flattened array for searching
  const allJobs = Object.values(subCategories).flat();
  const searchResults = searchQuery.trim() !== "" 
    ? allJobs.filter(job => job.toLowerCase().includes(searchQuery.toLowerCase()))
    : subCategories[activeCategory] || [];

  // Dummy Roadmap Data
  const roadmapSteps = [
    { title: "Java / CS 기초 탑재", status: "completed", desc: "학점 연계 (완료)" },
    { title: "알고리즘 코딩테스트", status: "completed", desc: "백준 Gold 5 (완료)" },
    { title: "Spring/JPA 포트폴리오", status: "current", desc: "현재 집중 목표" },
    { title: "대용량 트래픽 최적화", status: "pending", desc: "Redis 캐싱 (예정)" },
    { title: "인턴십 직무 면접", status: "pending", desc: "카카오 채용 연계형 (예정)" },
  ];

  const currentIndex = roadmapSteps.findIndex(s => s.status === "current");
  
  // Decide which steps to show based on expansion state
  let visibleSteps = roadmapSteps;
  if (!isTimelineExpanded) {
    const startObj = Math.max(0, currentIndex - 1);
    const endObj = Math.min(roadmapSteps.length - 1, currentIndex + 1);
    visibleSteps = roadmapSteps.slice(startObj, endObj + 1);
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">직무 로드맵 최적화 맵</h1>
        <p className="text-gray-500 mt-2 font-medium">원하시는 직무를 검색하고 현재 달성해야 할 마일스톤에 집중하세요.</p>
      </header>

      {/* Accordion Mega Menu for Job Search */}
      <div className="glass-card overflow-hidden">
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="w-full flex items-center justify-between p-5 bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Search className="w-5 h-5 text-primary" />
            </div>
            <div className="text-left">
              <h2 className="text-sm font-bold text-gray-500">현재 탐색 중인 직무</h2>
              <p className="text-lg font-bold text-gray-900">{selectedJob}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-primary">직무 변경하기</span>
            {isMenuOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </div>
        </button>

        {isMenuOpen && (
          <div className="border-t border-gray-100 flex flex-col animate-in slide-in-from-top-4 duration-300">
            {/* Search Input Filter */}
            <div className="p-4 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
              <Search className="w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="관심 있는 직무를 직접 검색해 보세요. (예: 프론트엔드)" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm font-medium outline-none text-gray-800 placeholder-gray-400"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-xs text-primary font-bold hover:underline">지우기</button>
              )}
            </div>

            <div className="flex flex-col md:flex-row h-72">
              {/* Left Category List (Hidden during search) */}
              {!searchQuery && (
                <div className="w-full md:w-1/3 border-r border-gray-100 bg-gray-50/50 overflow-y-auto">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full text-left px-6 py-4 font-bold text-sm transition-colors border-b border-gray-100 ${
                        activeCategory === cat ? "bg-white text-primary border-r-2 border-r-primary shadow-sm" : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              {/* Right Sub-category List */}
              <div className={`w-full p-6 bg-white overflow-y-auto ${!searchQuery ? "md:w-2/3" : ""}`}>
                <h3 className="text-sm font-bold text-gray-400 mb-4">
                  {searchQuery ? `'${searchQuery}' 검색 결과` : `${activeCategory} 세부 업직종`}
                </h3>
                {searchResults.length === 0 ? (
                  <p className="text-sm text-gray-500 py-4 text-center">검색된 직무가 없습니다.</p>
                ) : (
                  <div className={`grid grid-cols-1 gap-3 ${searchQuery ? "sm:grid-cols-3" : "sm:grid-cols-2"}`}>
                    {searchResults.map((job) => (
                      <button
                        key={job}
                        onClick={() => {
                          setSelectedJob(job);
                          setIsMenuOpen(false);
                          setSearchQuery("");
                        }}
                        className={`flex items-center gap-2 p-3 border rounded-xl text-sm font-semibold transition-all ${
                          selectedJob === job ? "border-primary bg-primary/5 text-primary shadow-sm" : "border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50/50"
                        }`}
                      >
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${selectedJob === job ? "border-primary" : "border-gray-300"}`}>
                          {selectedJob === job && <div className="w-2 h-2 bg-primary rounded-full" />}
                        </div>
                        {job}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Focused Timeline Panel */}
      <div className="glass-card p-8 mt-2 relative min-h-[600px] flex flex-col">
        <div className="flex justify-between items-center mb-12">
           <h3 className="font-bold text-lg text-gray-900">맞춤형 성장 타임라인</h3>
           <button 
             onClick={() => setIsTimelineExpanded(!isTimelineExpanded)}
             className="text-sm font-semibold text-primary hover:underline"
           >
             {isTimelineExpanded ? "축소하기" : "전체 체계도 보기"}
           </button>
        </div>

        {/* Timeline Visuals */}
        <div className={`flex flex-row items-center relative transition-all duration-700 ${isTimelineExpanded ? "justify-between" : "justify-center gap-12 sm:gap-24"}`}>
           {visibleSteps.map((step, idx) => {
             const isCompleted = step.status === "completed";
             const isCurrent = step.status === "current";
             const isPending = step.status === "pending";
             
             // Scale Logics
             const scaleClass = !isTimelineExpanded && isCurrent ? "scale-150 transform-origin-center z-20" : (!isTimelineExpanded ? "scale-75 opacity-60 z-10" : "scale-100");
             // Absolute Connector Logic
             const isLastVisible = idx === visibleSteps.length - 1;

             return (
               <div key={step.title} className="flex flex-col items-center relative w-[180px]">
                 {/* Node */}
                 <div 
                    onClick={() => isCurrent && !isTimelineExpanded && setIsTimelineExpanded(true)}
                    className={`relative flex flex-col items-center gap-4 transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${scaleClass} ${isCurrent && !isTimelineExpanded ? "cursor-pointer" : ""}`}
                 >
                   <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 bg-white transition-colors duration-300 ${
                     isCompleted ? "border-green-600 text-green-600 shadow-sm" :
                     isCurrent ? "border-primary text-primary shadow-[0_0_20px_rgba(85,82,250,0.4)]" :
                     "border-gray-200 text-gray-300"
                   }`}>
                     {isCompleted ? <CheckCircle2 className="w-6 h-6" /> : <Circle className="w-4 h-4 fill-current" />}
                   </div>

                   <div className={`text-center transition-all ${isTimelineExpanded ? "mt-2" : "mt-4"}`}>
                     <h3 className={`font-bold mb-1 leading-tight ${
                       isCompleted ? "text-green-800" :
                       isCurrent ? "text-primary text-lg" : 
                       "text-gray-400"
                     }`}>
                       {step.title}
                     </h3>
                     <p className={`text-xs font-bold px-2 py-0.5 rounded-md inline-block ${
                       isCompleted ? "bg-green-50 text-green-700" :
                       isCurrent ? "bg-primary/10 text-primary" : 
                       "text-gray-400"
                     }`}>
                       {step.desc}
                     </p>
                   </div>
                   
                   {/* Click Ripple Hint */}
                   {!isTimelineExpanded && isCurrent && (
                     <span className="absolute -top-3 -right-3 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded-full font-bold animate-bounce shadow-md pointer-events-none">
                       Click!
                     </span>
                   )}
                 </div>

                 {/* Connecting Line (Only draw if not the last visible item) */}
                 {!isLastVisible && (
                   <div className={`absolute left-[50%] h-[3px] -z-10 rounded-full transition-all duration-500 ${
                     !isTimelineExpanded ? "top-6 w-[250px] sm:w-[350px]" : "top-6 w-full min-w-[50px] lg:min-w-[120px]"
                   } ${isCompleted ? "bg-green-500" : "bg-gray-100"}`} />
                 )}
               </div>
             );
           })}
        </div>

        {/* Inline Recommendation Feed (Current Node Underneath Space) */}
        {!isTimelineExpanded && (
           <div className="mt-16 sm:mt-24 w-full flex flex-col items-center animate-in slide-in-from-bottom-8 fade-in relative">
              {/* Connector line dropping down from the current node */}
              <div className="w-[2px] h-12 sm:h-16 bg-gradient-to-b from-primary/30 to-transparent absolute -top-12 sm:-top-16 left-1/2 -translate-x-1/2" />
              
              <div className="w-full max-w-4xl bg-primary/5 border border-primary/10 rounded-2xl p-6 md:p-8 relative">
                 {/* Milestone Progress Bar */}
                 <div className="mb-8 bg-white border border-gray-100 p-5 rounded-xl shadow-sm">
                   <div className="flex justify-between items-end mb-3">
                     <div>
                       <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Target Milestone</span>
                       <h5 className="font-bold text-gray-900 text-base">Spring/JPA 포트폴리오 완성</h5>
                     </div>
                     <div className="text-right">
                       <span className="text-[11px] font-bold text-gray-500 mr-2">현재 진행률</span>
                       <span className="text-3xl font-extrabold text-primary">65%</span>
                     </div>
                   </div>
                   <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden border border-gray-200 inset-shadow-sm">
                     <div className="bg-gradient-to-r from-primary to-purple-500 h-full rounded-full transition-all duration-1000 ease-out" style={{ width: '65%' }} />
                   </div>
                   <p className="text-xs font-semibold text-gray-500 mt-3 text-right">🔥 목표 달성까지 포트폴리오 1개, 기술 면접 스터디 1개가 더 필요합니다.</p>
                 </div>

                 <h4 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-lg">
                   🎯 현재 목표 달성을 위한 추천 피드
                 </h4>
                 
                 {/* Feed Cards (Expanded Number) */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Inline Card 1 */}
                    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
                       <span className="text-[10px] font-bold text-orange-600 bg-orange-100 px-2 py-0.5 rounded flex w-fit mb-2">마감 임박</span>
                       <h5 className="font-bold text-gray-900 text-sm mb-1 leading-tight line-clamp-2">네이버클라우드 캠프 백엔드 심화과정</h5>
                       <p className="text-xs text-gray-500 mb-4 flex-1">포트폴리오 스펙 +20% 증가 예상</p>
                       <button className="w-full py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 transition-colors rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-gray-200 hover:border-primary">
                         <CalendarPlus className="w-3.5 h-3.5" /> 캘린더에 추가
                       </button>
                    </div>

                    {/* Inline Card 2 */}
                    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
                       <span className="text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded flex w-fit mb-2">상시 스터디</span>
                       <h5 className="font-bold text-gray-900 text-sm mb-1 leading-tight line-clamp-2">인프런 주최 - 김영한 스프링 JPA 멘토링</h5>
                       <p className="text-xs text-gray-500 mb-4 flex-1">부족한 기본기 +15% 보완 예상</p>
                       <button className="w-full py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 transition-colors rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-gray-200 hover:border-primary">
                         <CalendarPlus className="w-3.5 h-3.5" /> 캘린더에 추가
                       </button>
                    </div>

                    {/* Inline Card 3 */}
                    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
                       <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded flex w-fit mb-2">포트폴리오 빌드</span>
                       <h5 className="font-bold text-gray-900 text-sm mb-1 leading-tight line-clamp-2">오픈소스 컨트리뷰톤 2026 참가</h5>
                       <p className="text-xs text-gray-500 mb-4 flex-1">유지보수 및 협업 점수 향상</p>
                       <button className="w-full py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 transition-colors rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-gray-200 hover:border-primary">
                         <CalendarPlus className="w-3.5 h-3.5" /> 캘린더에 추가
                       </button>
                    </div>

                    {/* Inline Card 4 */}
                    <div className="bg-white border border-gray-100 p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col">
                       <span className="text-[10px] font-bold text-purple-600 bg-purple-100 px-2 py-0.5 rounded flex w-fit mb-2">자격증</span>
                       <h5 className="font-bold text-gray-900 text-sm mb-1 leading-tight line-clamp-2">SQLD 데이터베이스 전문가 시험 일정</h5>
                       <p className="text-xs text-gray-500 mb-4 flex-1">JPA 기반 성능 최적화 베이스</p>
                       <button className="w-full py-2 bg-gray-50 hover:bg-primary hover:text-white text-gray-600 transition-colors rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 border border-gray-200 hover:border-primary">
                         <CalendarPlus className="w-3.5 h-3.5" /> 캘린더에 추가
                       </button>
                    </div>
                 </div>

                 <button className="w-full mt-5 py-2 flex items-center justify-center gap-1 text-sm font-semibold text-primary hover:bg-primary/10 border border-transparent hover:border-primary/20 transition-colors rounded-lg">
                   더 많은 추천 활동 보기 <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
           </div>
        )}
      </div>
    </div>
  );
}

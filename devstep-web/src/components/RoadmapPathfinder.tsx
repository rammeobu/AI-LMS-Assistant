import { useState, useEffect } from "react";
import { getAIMatchedActivities } from "@/app/actions/match";
import { 
  CheckCircle2, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  CalendarPlus, 
  ChevronRight, 
  User as UserIcon, 
  Code2, 
  Globe, 
  Cloud, 
  Bot, 
  Gamepad2, 
  Lock,
  ArrowRight,
  Plus,
  Sparkles
} from "lucide-react";

export default function RoadmapPathfinder() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("개발/데이터");
  const [selectedJob, setSelectedJob] = useState("백엔드 엔지니어");
  const [isSubTasksExpanded, setIsSubTasksExpanded] = useState(false);

  // AI Matching States
  const [aiActivities, setAiActivities] = useState<any[]>([]);
  const [isAILoading, setIsAILoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Fetch AI Matched Activities
  useEffect(() => {
    async function fetchAIRecommendations() {
      setIsAILoading(true);
      setAiError(null);
      const { data, error } = await getAIMatchedActivities(selectedJob);
      
      if (error) {
        setAiError(error);
        setAiActivities([]);
      } else if (data) {
        setAiActivities(data.matches || []);
      }
      setIsAILoading(false);
    }
    fetchAIRecommendations();
  }, [selectedJob]);

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

  // Dummy Roadmap Data with SubTasks
  const roadmapSteps = [
    { title: "Java / CS 기초 탑재", status: "completed", desc: "학점 연계 (완료)", subTasks: [] },
    { title: "알고리즘 코딩테스트", status: "completed", desc: "백준 Gold 5 (완료)", subTasks: [] },
    { 
      title: "Spring/JPA 포트폴리오", 
      status: "current", 
      desc: "현재 집중 목표",
      subTasks: [
        { title: "인프런 스프링 MVC 1편 완강", status: "completed" },
        { title: "JPA 기본 구조 및 엔티티 매핑 설계", status: "completed" },
        { title: "도커(Docker) 기반 로컬 통합 환경 구성", status: "current" },
        { title: "Spring Security OAuth2 소셜 로그인 연동", status: "current" },
        { title: "Github Actions CI/CD 파이프라인 구축", status: "pending" },
        { title: "AWS EC2 클라우드 무중단 배포", status: "pending" },
      ]
    },
    { title: "대용량 트래픽 최적화", status: "pending", desc: "Redis 캐싱 (예정)", subTasks: [] },
    { title: "인턴십 직무 면접", status: "pending", desc: "카카오 채용 연계형 (예정)", subTasks: [] },
  ];

  const currentIndex = roadmapSteps.findIndex(s => s.status === "current");
  const [selectedStepIndex, setSelectedStepIndex] = useState(currentIndex);

  const selectedStep = roadmapSteps[selectedStepIndex];

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
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

        {/* Focus: Master-Detail Architecture Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8 glass-card min-h-[600px] mt-2 border border-gray-100 shadow-sm relative items-start">
          
          {/* LEFT COLUMN: Master List (Sticky) */}
          <div className="lg:col-span-1 lg:sticky lg:top-24 bg-gray-50/50 lg:bg-transparent p-6 lg:pb-6 lg:border-r border-gray-100">
             <h3 className="font-bold text-lg text-gray-900 mb-8 px-2">마일스톤 챕터</h3>
             
             <div className="relative flex flex-col gap-10 lg:gap-8 ml-3">
               {/* Vertical Connective Line */}
               <div className="absolute left-[15px] top-4 bottom-4 w-[2px] bg-gray-200 z-0" />
               
               {roadmapSteps.map((step, idx) => {
                 const isCompleted = step.status === "completed";
                 const isCurrent = step.status === "current";
                 const isSelected = selectedStepIndex === idx;

                 return (
                   <div 
                     key={idx} 
                     onClick={() => {
                       setSelectedStepIndex(idx);
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
               })}
             </div>
          </div>

          {/* RIGHT COLUMN: Detail View Panel */}
          <div className="lg:col-span-3 p-6 lg:p-8 animate-in slide-in-from-right-4 fade-in duration-300" key={selectedStepIndex}>
             
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
                   <div className="text-right">
                     <span className="text-xs font-bold text-gray-500 mr-2">누적 달성률</span>
                     <span className="text-4xl font-extrabold text-primary">65<span className="text-xl">%</span></span>
                   </div>
                 </div>
                 <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden border border-gray-200 shadow-inner">
                   <div className="bg-gradient-to-r from-primary via-indigo-500 to-purple-500 h-full rounded-full transition-all duration-1000 ease-out relative" style={{ width: '65%' }}>
                      <div className="absolute inset-0 bg-white/20 w-full rounded-full animate-pulse" />
                   </div>
                 </div>
                 <p className="text-sm font-semibold text-gray-600 mt-4 text-right">🔥 해당 목표 달성까지 포트폴리오 <span className="text-primary font-bold">1개</span>, 직무 스터디 <span className="text-primary font-bold">1개</span>가 더 필요합니다.</p>
               </div>
             )}

             {/* Sub-Tasks Menu Bar (Expandable) */}
             {selectedStep.status === "current" && selectedStep.subTasks && selectedStep.subTasks.length > 0 && (
               <div className="mb-8 border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm">
                 <button 
                   onClick={() => setIsSubTasksExpanded(!isSubTasksExpanded)}
                   className="w-full p-5 bg-gray-50/80 flex items-center justify-between border-b border-gray-100 transition-colors hover:bg-gray-100/80 focus:outline-none"
                 >
                   <div className="flex items-center gap-2.5">
                     <h4 className="font-bold text-gray-900 text-base">상세 태스크 진행 현황</h4>
                     <span className="text-xs bg-primary text-white font-bold px-2 py-0.5 rounded-full shadow-sm">
                       {selectedStep.subTasks.filter(t => t.status === "current").length}개 진행 중
                     </span>
                   </div>
                   <div className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                     {isSubTasksExpanded ? "태스크 줄이기" : "전체 흐름 보기"}
                     {isSubTasksExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                   </div>
                 </button>
                 
                 <div className="p-3">
                   <ul className="flex flex-col gap-1">
                     {selectedStep.subTasks.map((task, idx) => {
                       const isCurrent = task.status === "current";
                       const isCompleted = task.status === "completed";
                       const isPending = task.status === "pending";

                       // If not expanded, only show "current" tasks
                       if (!isSubTasksExpanded && !isCurrent) return null;

                       return (
                         <li key={idx} className={`flex items-center gap-3 p-3 rounded-xl transition-all animate-in fade-in slide-in-from-top-2 duration-300 ${isCurrent ? "bg-primary/5 border border-primary/10" : "hover:bg-gray-50"}`}>
                           <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border-2 ${
                             isCompleted ? "border-emerald-500 bg-emerald-500 text-white" : 
                             isCurrent ? "border-primary bg-white shadow-sm" : "border-gray-200 bg-gray-50"
                           }`}>
                             {isCompleted && <CheckCircle2 className="w-3 h-3" />}
                             {isCurrent && <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />}
                           </div>
                           <span className={`font-medium text-sm flex-1 transition-colors ${
                             isCompleted ? "text-gray-400 line-through decoration-gray-300" :
                             isCurrent ? "text-primary font-extrabold" : "text-gray-500"
                           }`}>
                             {task.title}
                           </span>
                           {isCurrent && (
                             <span className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md">
                               수행 중
                             </span>
                           )}
                         </li>
                       );
                     })}
                   </ul>
                 </div>
               </div>
             )}

             {selectedStep.status === "completed" && (
               <div className="mb-8 bg-emerald-50/50 border border-emerald-100 p-6 rounded-2xl text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
                  <h4 className="text-lg font-bold text-emerald-800 mb-1">이미 달성한 마일스톤입니다!</h4>
                  <p className="text-sm text-emerald-600 font-medium">학점 연계 과정을 통해 성공적으로 기초를 다졌습니다.</p>
               </div>
             )}

             {selectedStep.status === "pending" && (
               <div className="mb-8 bg-gray-50 border border-gray-200 border-dashed p-10 rounded-2xl text-center">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                    <span className="text-2xl">🔒</span>
                  </div>
                  <h4 className="text-lg font-bold text-gray-700 mb-2">이전 단계를 먼저 클리어하세요</h4>
                  <p className="text-sm text-gray-500 font-medium">현재 진행 중인 목표를 100% 달성하면 다음 추천 패스웨이가 열립니다.</p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2].map((i) => (
                        <div key={i} className="bg-gray-50 border border-gray-100 p-5 rounded-xl h-44 animate-pulse" />
                      ))}
                    </div>
                  ) : aiError ? (
                    <div className="p-10 bg-red-50 text-red-600 rounded-xl text-center text-sm font-medium border border-red-100">
                      추천 데이터를 가져오지 못했습니다: {aiError}
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

        </div>
      </div>
    </div>
  );
}

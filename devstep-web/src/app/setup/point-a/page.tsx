"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
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
  Sparkles,
  Loader2,
  Terminal,
  Zap,
  Target,
  MessageSquare,
  Clock,
  Briefcase,
  Award,
  Users,
  TrendingUp,
  Layout
} from "lucide-react";

export default function UnifiedSurveyPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isScanning, setIsScanning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  
  // Point A + Point B 통합 데이터 상태
  const [surveyData, setSurveyData] = useState({
    // Point A Fields
    skills: ["Python", "FastAPI", "React", "PostgreSQL"],
    baseline: "3학년 (전공 심화)",
    status: ["알고리즘/코테 준비", "사이드 프로젝트 진행 중"],
    experience: "Lv.2 외부 데이터 연동",
    interests: [] as string[],
    
    // Point B Fields
    careerGaps: [] as string[], // Step 5: 이력서 결핍
    targetDomain: [] as string[], // Step 6: 타겟 도메인
    availableResource: "미들형", // Step 7: 가용 리소스
    freeIdea: "" // Step 8: 자유 아이디어
  });

  const handleFinishSurvey = () => {
    setIsFinished(true);
    // 실제 환경에서는 여기서 DB 업데이트 (서버 액션 호출)를 진행합니다.
    setTimeout(() => {
      router.push("/dashboard?tab=roadmap");
    }, 2500);
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full text-center"
        >
          <div className="w-24 h-24 bg-primary/10 rounded-[32px] flex items-center justify-center mx-auto mb-8">
            <CheckCircle2 className="w-12 h-12 text-primary" />
          </div>
          <h2 className="text-3xl font-black text-gray-900 mb-4">모든 진단이 완료되었습니다!</h2>
          <p className="text-gray-500 font-bold mb-8 italic">사용자님의 현재와 미래를 잇는 최적의 로드맵을 생성 중입니다...</p>
          <div className="flex flex-col items-center gap-2">
             <Loader2 className="w-8 h-8 text-primary animate-spin" />
             <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Generating Roadmap...</span>
          </div>
        </motion.div>
      </div>
    );
  }

  // 상단 헤더 텍스트 동적 결정
  const isPhaseA = currentStep <= 4;
  const headerTitle = isPhaseA ? "나의 현재 위치(Point A) 설정" : "나의 목표 지점(Point B) 설정";
  const headerDesc = isPhaseA 
    ? "정확한 진단은 성공적인 커리어 설계의 시작입니다. 현재의 기술 스택을 정렬해보세요."
    : "어떤 이력서를 만들고 싶나요? 미래의 나를 위한 결핍과 방향성을 설정합니다.";

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="text-center mb-12">
          <AnimatePresence mode="wait">
            <motion.div 
              key={isPhaseA ? "phaseA" : "phaseB"}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-bold mb-4 transition-colors ${
                isPhaseA ? "bg-primary/5 border-primary/10 text-primary" : "bg-purple-50 border-purple-100 text-purple-600"
              }`}>
                {isPhaseA ? <Sparkles className="w-3.5 h-3.5" /> : <Zap className="w-3.5 h-3.5" />}
                {isPhaseA ? "PHASE 1: CURRENT STATUS" : "PHASE 2: FUTURE GOALS"}
              </div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-4">{headerTitle}</h1>
              <p className="text-gray-500 font-medium max-w-2xl mx-auto whitespace-pre-line text-lg">
                {headerDesc}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Survey Wizard Card */}
        <div className="bg-white rounded-[40px] shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden min-h-[640px] flex flex-col relative transition-all duration-500">
          {/* Progress Bar */}
          <div className="h-2 bg-gray-100 w-full overflow-hidden">
            <motion.div 
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / 8) * 100}%` }}
              className={`h-full transition-all duration-500 ${isPhaseA ? "bg-primary" : "bg-purple-500"}`}
            />
          </div>

          <div className="p-8 md:p-14 flex-1 flex flex-col">
            {/* Step Content */}
            <AnimatePresence mode="wait">
              {/* Point A: Steps 1-4 */}
              {currentStep === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-10 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20">
                      <Terminal className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">GitHub 스택 스캐닝</h2>
                      <p className="text-gray-500 font-bold">주력 기술 스택을 자동으로 추출합니다.</p>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-3xl p-10 border border-gray-100 flex flex-col items-center justify-center min-h-[300px] relative overflow-hidden">
                    {!isScanning ? (
                      <button onClick={() => { setIsScanning(true); setTimeout(() => setIsScanning(false), 2000); }} className="px-10 py-5 bg-gray-900 text-white rounded-[24px] font-bold flex items-center gap-3 hover:bg-black transition-all shadow-2xl active:scale-95 group">
                        <Terminal className="w-6 h-6 group-hover:animate-pulse" /> 깃허브 연동 및 스택 추출하기
                      </button>
                    ) : (
                      <div className="flex flex-col items-center gap-6">
                        <Loader2 className="w-16 h-16 text-primary animate-spin" />
                        <div className="text-center">
                          <p className="text-gray-900 text-xl font-black animate-pulse">레포지토리 분석 중...</p>
                          <p className="text-gray-400 text-sm font-bold mt-1">당신의 코드를 읽고 있습니다.</p>
                        </div>
                      </div>
                    )}
                    {!isScanning && surveyData.skills.length > 0 && (
                      <div className="mt-4 text-center animate-in fade-in zoom-in-95 duration-700">
                        <p className="text-xs font-bold text-gray-400 mb-6 uppercase tracking-[0.2em]">추출된 주요 키워드</p>
                        <div className="flex flex-wrap justify-center gap-3 max-w-lg">
                          {["Python", "FastAPI", "MySQL", "React", "Next.js", "TypeScript", "Spring"].map((skill) => {
                            const isActive = surveyData.skills.includes(skill);
                            return (
                              <button key={skill} onClick={() => { setSurveyData(prev => ({ ...prev, skills: isActive ? prev.skills.filter(s => s !== skill) : [...prev.skills, skill] })); }}
                                className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all border-2 ${isActive ? "bg-primary border-primary text-white shadow-lg shadow-primary/20" : "bg-white border-gray-100 text-gray-400 hover:border-gray-200"}`}>
                                {skill}
                              </button>
                            );
                          })}
                          <button className="px-5 py-2.5 rounded-2xl text-sm font-black border-2 border-dashed border-gray-200 text-gray-300 flex items-center gap-1.5 hover:border-gray-400 hover:text-gray-500 transition-all">
                            <Plus className="w-4 h-4" /> 직접 추가
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <UserIcon className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">베이스라인 조사</h2>
                      <p className="text-gray-500 font-bold">당신의 현재 소속과 준비 상태를 알려주세요.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-12">
                    <section>
                      <label className="text-xs font-black text-gray-400 mb-5 block uppercase tracking-[0.15em]">현재 학년 및 과정</label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["1~2학년", "3학년 (전공 심화)", "4학년 (취업 준비)", "졸업생"].map(opt => (
                          <button key={opt} onClick={() => setSurveyData(prev => ({ ...prev, baseline: opt }))}
                            className={`p-5 rounded-2xl border-2 text-sm font-black transition-all ${surveyData.baseline === opt ? "bg-primary border-primary text-white shadow-xl shadow-primary/20 scale-[1.02]" : "bg-white border-gray-100 text-gray-500 hover:border-gray-200"}`}>
                            {opt}
                          </button>
                        ))}
                      </div>
                    </section>
                    <section>
                      <label className="text-xs font-black text-gray-400 mb-5 block uppercase tracking-[0.15em]">현재 집중하고 있는 활동 (중복 선택)</label>
                      <div className="flex flex-wrap gap-3">
                        {["정보처리기사", "코딩테스트 대비", "CS 전공 공부", "사이드 프로젝트", "어학 성적", "포트폴리오 정리"].map(opt => {
                          const isActive = surveyData.status.includes(opt);
                          return (
                            <button key={opt} onClick={() => setSurveyData(prev => ({ ...prev, status: isActive ? prev.status.filter(s => s !== opt) : [...prev.status, opt] }))}
                              className={`px-7 py-3.5 rounded-full border-2 text-sm font-black transition-all ${isActive ? "bg-gray-900 border-gray-900 text-white shadow-2xl shadow-gray-300" : "bg-white border-gray-100 text-gray-500 hover:border-gray-900"}`}>
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </section>
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 flex-1">
                   <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
                      <TrendingUp className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">실전 경험치 평가</h2>
                      <p className="text-gray-500 font-bold">프로젝트 수행 경험의 깊이를 선택해주세요.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {[
                      { lv: "Lv.1 베이직 튜토리얼", desc: "강의 과정을 충실히 따라하며 기본적인 CRUD 동작 원리를 이해하고 구현해 본 수준입니다." },
                      { lv: "Lv.2 외부 데이터 활용", desc: "OpenAPI 등을 연동하여 데이터를 불러오고 필터링하여 유의미한 정보를 노출해 본 수준입니다." },
                      { lv: "Lv.3 아키텍처 커스터마이징", desc: "라이브러리를 커스텀하거나 성능 향상을 위해 DB 설계를 직접 최적화해 본 수준입니다." },
                      { lv: "Lv.4 실서비스 배포 및 운영", desc: "CI/CD를 구축하고 실제 사용자 피드백을 받아 배포된 라이브 서비스를 운영해 본 수준입니다." },
                    ].map((item) => {
                      const isActive = surveyData.experience === item.lv;
                      return (
                        <button key={item.lv} onClick={() => setSurveyData(prev => ({ ...prev, experience: item.lv }))}
                          className={`flex flex-col md:flex-row md:items-center p-8 rounded-[28px] border-2 text-left transition-all gap-4 ${isActive ? "bg-primary border-primary text-white shadow-2xl shadow-primary/20 translate-x-1" : "bg-white border-gray-100 text-gray-900 hover:bg-gray-50 hover:border-primary/20"}`}>
                          <div className={`px-4 py-2 rounded-xl text-xs font-black shrink-0 ${isActive ? "bg-white/20" : "bg-primary/10 text-primary"}`}>{item.lv.split(' ')[0]}</div>
                          <div className="flex-1">
                            <h4 className="font-black mb-1">{item.lv}</h4>
                            <p className={`text-xs font-bold leading-relaxed ${isActive ? "text-white/80" : "text-gray-400"}`}>{item.desc}</p>
                          </div>
                          {isActive && <CheckCircle2 className="w-6 h-6 text-white shrink-0 hidden md:block" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {currentStep === 4 && (
                <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 flex-1">
                   <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <Sparkles className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">흥미 분야 선택</h2>
                      <p className="text-gray-500 font-bold">당신의 심장이 가장 뜨겁게 뛰는 분야를 골라주세요.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {[
                      { id: "backend", label: "웹 서버 / API", icon: Globe },
                      { id: "infra", label: "SRE / 클라우드", icon: Cloud },
                      { id: "ai", label: "AI 모델링 / 빅데이터", icon: Bot },
                      { id: "game", label: "게임 제작 / 실시간", icon: Gamepad2 },
                      { id: "sec", label: "정보보호 / 해킹방어", icon: Lock },
                      { id: "mobile", label: "모바일 앱 / 크로스플랫폼", icon: Terminal },
                    ].map((item) => {
                      const Icon = item.icon;
                      const isActive = surveyData.interests.includes(item.id);
                      return (
                        <button key={item.id} onClick={() => { setSurveyData(prev => ({ ...prev, interests: isActive ? prev.interests.filter(i => i !== item.id) : [...prev.interests, item.id] })); }}
                          className={`flex flex-col items-center justify-center p-10 rounded-[32px] border-2 transition-all gap-6 group ${isActive ? "bg-primary border-primary text-white shadow-2xl shadow-primary/20 -translate-y-2" : "bg-white border-gray-100 text-gray-900 hover:border-primary/40 hover:bg-primary/5"}`}>
                          <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center transition-all ${isActive ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary"}`}><Icon className="w-8 h-8" /></div>
                          <span className="text-sm font-black whitespace-nowrap">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* Point B: Steps 5-8 */}
              {currentStep === 5 && (
                <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                      <Target className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">이력서의 빈칸(결핍) 찾기</h2>
                      <p className="text-gray-500 font-bold">현재 포트폴리오에서 가장 채우고 싶은 경험은 무엇인가요?</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      { id: "collab", label: "🤝 타 직군과의 협업 경험", desc: "기획자, 디자이너와 소통하며 하나의 프로덕트를 완성해 보고 싶어요.", icon: Users },
                      { id: "award", label: "🏆 임팩트 있는 수상 경력", desc: "이력서 상단에 적을 수 있는 해커톤/공모전 수상 타이틀이 필요해요.", icon: Award },
                      { id: "mentor", label: "👨‍💻 현업 시니어 멘토링", desc: "내 코드가 실무에서도 통하는지 시니어의 코드 리뷰를 받고 싶어요.", icon: Briefcase },
                      { id: "leading", label: "🚀 대규모 프로젝트 리딩", desc: "가벼운 토이 프로젝트 말고, 몇 달간 깊게 파고드는 메인 프로젝트가 필요해요.", icon: Zap },
                    ].map((item) => {
                      const isActive = surveyData.careerGaps.includes(item.id);
                      return (
                        <button key={item.id} 
                          onClick={() => {
                            setSurveyData(prev => ({
                              ...prev,
                              careerGaps: isActive 
                                ? prev.careerGaps.filter(i => i !== item.id) 
                                : prev.careerGaps.length < 2 ? [...prev.careerGaps, item.id] : [prev.careerGaps[1], item.id]
                            }));
                          }}
                          className={`flex flex-col items-start p-7 rounded-[28px] border-2 text-left transition-all gap-4 ${isActive ? "bg-purple-600 border-purple-600 text-white shadow-2xl shadow-purple-200" : "bg-white border-gray-100 text-gray-900 hover:bg-purple-50 hover:border-purple-200"}`}>
                          <h4 className="font-black text-lg">{item.label}</h4>
                          <p className={`text-sm font-bold leading-relaxed ${isActive ? "text-white/80" : "text-gray-400"}`}>{item.desc}</p>
                          <div className="mt-auto pt-4 flex w-full justify-end">
                             <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isActive ? "bg-white border-white text-purple-600" : "border-gray-200"}`}>
                                {isActive && <CheckCircle2 className="w-4 h-4" />}
                             </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {currentStep === 6 && (
                <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                      <Layout className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">타켓 도메인 (흥미 분야)</h2>
                      <p className="text-gray-500 font-bold">다음 프로젝트를 한다면 어떤 주제를 다뤄보고 싶나요?</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 justify-center py-10">
                    {[
                      "🤖 AI / 데이터 에이전트", "☁️ 백엔드 / 대용량 서버", "🎮 게임 엔진 최적화", 
                      "🌍 공공데이터 연동 서비스", "🔒 네트워크 / 보안", "📱 모바일 크로스플랫폼",
                      "🎨 디자인 시스템 / 인터랙션", "🧪 QA / 자동화 테스트", "🏗️ 인프라 / DevOps"
                    ].map(domain => {
                      const isActive = surveyData.targetDomain.includes(domain);
                      return (
                        <button key={domain}
                          onClick={() => {
                            setSurveyData(prev => ({
                              ...prev,
                              targetDomain: isActive ? prev.targetDomain.filter(d => d !== domain) : [...prev.targetDomain, domain]
                            }));
                          }}
                          className={`px-8 py-4 rounded-[20px] text-lg font-black transition-all border-2 ${
                            isActive 
                              ? "bg-purple-600 border-purple-600 text-white shadow-xl shadow-purple-200 scale-105" 
                              : "bg-white border-gray-100 text-gray-400 hover:border-purple-400 hover:text-purple-600"
                          }`}
                        >
                          {domain}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {currentStep === 7 && (
                <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                      <Clock className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">가용 리소스 (시간/일정)</h2>
                      <p className="text-gray-500 font-bold">현재 활동에 투자할 수 있는 여유 시간은 어느 정도인가요?</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-6 max-w-2xl mx-auto py-8">
                    {[
                      { id: "라이트형", label: "🌱 라이트형", desc: "학업/알바 등과 병행해야 해서, 주말 위주로 가볍게 참여하고 싶어요." },
                      { id: "미들형", label: "🔥 미들형", desc: "평일 저녁과 주말을 활용해 어느 정도 몰입할 수 있어요." },
                      { id: "올인형", label: "🚀 올인형", desc: "휴학/방학이라서 온전히 서비스를 파고들 수 있습니다." }
                    ].map(res => {
                      const isActive = surveyData.availableResource === res.id;
                      return (
                        <button key={res.id}
                          onClick={() => setSurveyData(prev => ({ ...prev, availableResource: res.id }))}
                          className={`p-8 rounded-[32px] border-2 text-left transition-all flex items-center gap-6 ${
                            isActive 
                              ? "bg-purple-600 border-purple-600 text-white shadow-2xl shadow-purple-200 translate-x-3" 
                              : "bg-white border-gray-100 text-gray-900 hover:bg-purple-50"
                          }`}
                        >
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${isActive ? "bg-white/20" : "bg-purple-50 text-purple-600"}`}>
                             {isActive ? <CheckCircle2 /> : res.label[0]}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-xl mb-1">{res.label}</h4>
                            <p className={`text-sm font-bold ${isActive ? "text-white/70" : "text-gray-400"}`}>{res.desc}</p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {currentStep === 8 && (
                <motion.div key="step8" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-12 flex-1">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
                      <MessageSquare className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-black text-gray-900">LLM 매칭을 위한 자유 선언</h2>
                      <p className="text-gray-500 font-bold">머릿속에 맴도는 아이디어나 기획이 있다면 편하게 던져주세요!</p>
                    </div>
                  </div>
                  <div className="relative group">
                    <textarea 
                      value={surveyData.freeIdea}
                      onChange={(e) => setSurveyData(prev => ({ ...prev, freeIdea: e.target.value }))}
                      placeholder="예: 기상청 OpenAPI를 활용해서 조건부 알림을 주는 캘린더 서비스를 만들고 싶어요."
                      className="w-full min-h-[240px] p-10 rounded-[40px] bg-gray-50 border-2 border-gray-100 focus:border-purple-600 focus:bg-white transition-all outline-none font-bold text-gray-900 resize-none placeholder:text-gray-300"
                    />
                    <div className="absolute top-4 right-10 flex gap-2">
                       <div className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg text-[10px] font-black uppercase tracking-widest">Natural Language Entry</div>
                    </div>
                  </div>
                  <div className="flex justify-center italic text-gray-400 text-sm font-medium">💡 구체적일수록 LLM이 더 정확한 공모전과 대외활동을 추천해드립니다.</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="mt-16 pt-10 flex items-center justify-between border-t border-gray-100">
              <button 
                onClick={() => currentStep > 1 && setCurrentStep(curr => curr - 1)}
                disabled={currentStep === 1}
                className="px-8 py-4 text-sm font-black text-gray-400 hover:text-gray-900 transition-colors disabled:opacity-0 flex items-center gap-2"
              >
                <ArrowRight className="w-5 h-5 rotate-180" />
                이전 단계
              </button>
              
              <div className="flex items-center gap-3">
                {currentStep === 8 && (
                   <button 
                    onClick={handleFinishSurvey}
                    className="px-8 py-4 text-sm font-black text-gray-400 hover:text-purple-600 transition-colors"
                  >
                    건너뛰기
                  </button>
                )}
                <button 
                  onClick={() => {
                    if (currentStep < 8) setCurrentStep(curr => curr + 1);
                    else handleFinishSurvey();
                  }}
                  className={`px-12 py-5 rounded-[24px] font-black text-lg shadow-2xl flex items-center gap-3 hover:scale-[1.02] active:scale-95 transition-all text-white ${
                    isPhaseA ? "bg-primary shadow-primary/10" : "bg-purple-600 shadow-purple-200"
                  }`}
                >
                  {currentStep === 8 ? "진단 완료 및 로드맵 생성" : "다음 단계로"}
                  <ArrowRight className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

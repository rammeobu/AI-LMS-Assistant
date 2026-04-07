"use client";

import { AlertCircle, Calendar, CheckCircle2, ChevronRight, Star } from "lucide-react";
import RadarChart from "@/components/RadarChart";
import Link from "next/link";

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">내 커리어 대시보드</h1>
        <p className="text-gray-500 mt-2 font-medium">현재 역량을 진단하고 AI가 추천하는 보완 활동을 확인하세요.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <section className="lg:col-span-1 glass-card p-6 h-[400px] flex flex-col relative overflow-hidden">
          <div className="flex items-center justify-between mb-2 z-10">
            <h2 className="text-lg font-bold text-gray-800">역량 레이더 (AI 분석)</h2>
          </div>
          <div className="flex-1 w-full relative z-10">
            <RadarChart />
          </div>
        </section>

        <section className="col-span-1 lg:col-span-2 flex flex-col gap-4">
          <div className="glass-card p-6 flex-1 flex flex-col justify-center">
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3 p-4 bg-green-50 rounded-2xl border border-green-100">
                <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-green-900 mb-1">Strong Point</h3>
                  <p className="text-sm text-green-700 leading-relaxed">
                    프론트엔드 및 협업(Git) 능력이 목표 직무(백엔드 엔지니어) 대비 상위 10% 수준입니다. 다양한 팀 단위 프로젝트 경험이 강점으로 꼽힙니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-orange-50 rounded-2xl border border-orange-100">
                <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5 shrink-0" />
                <div>
                  <h3 className="font-bold text-orange-900 mb-1">Gap Analysis (Needs Improvement)</h3>
                  <p className="text-sm text-orange-700 leading-relaxed">
                    백엔드 프레임워크(Spring Boot 등) 기반의 대규모 트래픽 처리 경험과 서버 배포 운영 경험이 목표치(75점) 대비 부족(40점)합니다.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 h-28">
            <div className="glass-card flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">목표 달성률</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">45</span>
                  <span className="text-sm font-medium text-gray-400">%</span>
                </div>
              </div>
            </div>
            <div className="glass-card flex items-center justify-between p-5">
              <div>
                <p className="text-sm font-semibold text-gray-500 mb-1">활동 가능 일정</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-gray-900">여유</span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="mt-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">지금 필요한 맞춤 추천 🎯</h2>
          <Link href="/dashboard?tab=feed" className="text-sm font-semibold text-primary flex items-center hover:underline">
            추천 피드 더보기 <ChevronRight className="w-4 h-4 ml-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[ 
            { tag: "보완: 백엔드", tagColor: "bg-orange-100 text-orange-700", title: "네이버 클라우드 해커톤 2026", duration: "1주일 남음", points: "+15%" },
            { tag: "보완: 자격증", tagColor: "bg-blue-100 text-blue-700", title: "정보처리기사 실기 스터디", duration: "모집중", points: "+20%" },
            { tag: "강점 강화", tagColor: "bg-green-100 text-green-700", title: "오픈소스 기여 프로젝트", duration: "상시 모집", points: "+5%" },
          ].map((item, i) => (
            <div key={i} className="glass-card p-5 group cursor-pointer hover:shadow-md transition-all hover:-translate-y-1 relative">
              <span className={`inline-flex px-2.5 py-1 rounded-md text-xs font-bold mb-3 ${item.tagColor}`}>
                {item.tag}
              </span>
              <h3 className="font-bold text-lg text-gray-900 mb-2 leading-tight pr-6 group-hover:text-primary transition-colors">{item.title}</h3>
              <p className="text-sm text-gray-500 flex items-center gap-2 mb-4">
                <Calendar className="w-3.5 h-3.5" /> {item.duration}
              </p>
              <div className="w-full h-[1px] bg-gray-100 mb-4" />
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-500">예상 역량 상승</span>
                <span className="text-sm font-extrabold text-primary">{item.points}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

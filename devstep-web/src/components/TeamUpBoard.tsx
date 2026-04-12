"use client";

import { CheckCircle2, ChevronRight, Code2, ShieldAlert } from "lucide-react";

export default function TeamUpBoard() {
  const dummyTeams = [
    { title: "Next.js + SpringBoot 쇼핑몰 토이 프로젝트 팀원 구합니다", req: ["React", "Spring", "MySQL"], match: 85, status: "모집중 (1/4)" },
    { title: "네이버 지도 API 활용한 혼밥 맛집 지도 앱 사이드 플젝", req: ["Swift", "Node.js"], match: 35, status: "모집중 (2/3)" },
    { title: "2026 데브톤에 백엔드로 참여하실 분 구합니다!", req: ["Python", "FastAPI", "Redis"], match: 60, status: "모집중 (3/4)", highlight: true },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-end mb-2">
        <button className="px-5 py-2.5 bg-primary text-white font-semibold rounded-xl hover:bg-primary/90 transition-colors shadow-sm">
          모집글 작성
        </button>
      </div>

      <div className="flex flex-col gap-4 mt-4">
        {dummyTeams.map((team, i) => (
          <div key={i} className={`glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all hover:bg-white hover:border-gray-200 ${team.highlight ? "ring-2 ring-primary/20" : ""}`}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-md">
                  {team.status}
                </span>
                <span className="text-sm font-medium text-gray-500">조회수 142</span>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-3">{team.title}</h3>
              <div className="flex items-center gap-2">
                <Code2 className="w-4 h-4 text-gray-400" />
                {team.req.map(stack => (
                  <span key={stack} className="px-2 py-0.5 bg-gray-50 border border-gray-100 text-gray-600 text-xs rounded-full">
                    {stack}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 min-w-[200px]">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-gray-500 mb-1">나와의 스펙 핏 (AI 매칭)</span>
                {team.match >= 80 ? (
                  <span className="flex items-center gap-1.5 text-lg font-extrabold text-green-600">
                    <CheckCircle2 className="w-5 h-5" /> {team.match}% 적합
                  </span>
                ) : team.match >= 50 ? (
                  <span className="flex items-center gap-1.5 text-lg font-extrabold text-orange-500">
                    <ShieldAlert className="w-5 h-5" /> {team.match}% (보통)
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5 text-lg font-extrabold text-gray-400">
                    {team.match}% (핏 낮음)
                  </span>
                )}
              </div>
              
              <button className="w-full sm:w-auto px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 hover:text-primary transition-all rounded-lg text-sm font-bold flex justify-center items-center gap-2">
                인증서 첨부하여 지원 <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

"use client";
import { useState } from "react";
import {
  Map, CheckCircle2, Circle, ChevronDown, ChevronRight,
  BookOpen, ExternalLink, Target, Zap,
} from "lucide-react";
import { mockRoadmap } from "@/lib/mock-data";

export default function RoadmapPage() {
  const [expandedStage, setExpandedStage] = useState<number>(1);

  const totalItems = mockRoadmap.stages.reduce((acc, s) => acc + s.items.length, 0);
  const completedItems = mockRoadmap.stages.reduce((acc, s) => acc + s.items.filter(i => i.completed).length, 0);
  const progress = Math.round((completedItems / totalItems) * 100);

  const stageColors = ["#7c3aed", "#4f46e5", "#06b6d4"];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#e8eaf6" }}>
          🗺️ 학습 <span className="gradient-text">로드맵</span>
        </h1>
        <p className="text-sm" style={{ color: "#9ca3af" }}>
          목표 직무 <span style={{ color: "#7c3aed" }}>{mockRoadmap.targetJob}</span>를 위한 단계별 학습 경로입니다
        </p>
      </div>

      {/* Progress Overview */}
      <div className="glass-card p-6 mb-8 gradient-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold" style={{ color: "#e8eaf6" }}>전체 진행률</h3>
          <span className="text-lg font-bold gradient-text">{progress}%</span>
        </div>
        <div className="progress-bar mb-3" style={{ height: "12px" }}>
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="flex items-center justify-between text-xs" style={{ color: "#6b7280" }}>
          <span>완료: {completedItems}/{totalItems} 항목</span>
          <span>예상 소요: {mockRoadmap.stages.reduce((acc, s) => acc + parseInt(s.duration), 0)}개월+</span>
        </div>
      </div>

      {/* Roadmap Timeline */}
      <div className="space-y-4">
        {mockRoadmap.stages.map((stage, index) => {
          const isExpanded = expandedStage === index;
          const stageCompleted = stage.items.filter(i => i.completed).length;
          const stageTotal = stage.items.length;
          const stageProgress = Math.round((stageCompleted / stageTotal) * 100);
          const color = stageColors[index];

          return (
            <div key={index} className="glass-card overflow-hidden">
              {/* Stage Header */}
              <button
                onClick={() => setExpandedStage(isExpanded ? -1 : index)}
                className="w-full flex items-center gap-4 p-6 text-left transition-all duration-200"
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: `${color}15`, border: `1px solid ${color}30` }}
                >
                  {stage.completed ? (
                    <CheckCircle2 className="w-7 h-7" style={{ color }} />
                  ) : (
                    <span className="text-lg font-bold" style={{ color }}>{stage.level}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold" style={{ color: "#e8eaf6" }}>{stage.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: `${color}15`, color }}>
                      {stage.level}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs" style={{ color: "#6b7280" }}>예상 {stage.duration}</span>
                    <span className="text-xs" style={{ color }}>
                      {stageCompleted}/{stageTotal} 완료
                    </span>
                  </div>
                  <div className="progress-bar mt-2" style={{ height: "4px" }}>
                    <div className="h-full rounded-full" style={{ width: `${stageProgress}%`, background: color, transition: "width 0.5s ease" }} />
                  </div>
                </div>
                {isExpanded ? (
                  <ChevronDown className="w-5 h-5 shrink-0" style={{ color: "#6b7280" }} />
                ) : (
                  <ChevronRight className="w-5 h-5 shrink-0" style={{ color: "#6b7280" }} />
                )}
              </button>

              {/* Stage Items */}
              {isExpanded && (
                <div className="px-6 pb-6 fade-in">
                  <div className="space-y-3 ml-7 border-l-2 pl-6" style={{ borderColor: `${color}30` }}>
                    {stage.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="relative flex items-start gap-4 p-4 rounded-xl transition-all duration-200"
                        style={{
                          background: item.completed ? `${color}08` : "rgba(30, 31, 59, 0.5)",
                          border: `1px solid ${item.completed ? `${color}20` : "rgba(124, 58, 237, 0.08)"}`,
                        }}
                      >
                        {/* Timeline dot */}
                        <div
                          className="absolute -left-9 top-5 w-4 h-4 rounded-full"
                          style={{
                            background: item.completed ? color : "rgba(30, 31, 59, 0.8)",
                            border: `2px solid ${item.completed ? color : "rgba(124, 58, 237, 0.3)"}`,
                          }}
                        />

                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {item.completed ? (
                              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "#10b981" }} />
                            ) : (
                              <Circle className="w-4 h-4 shrink-0" style={{ color: "#6b7280" }} />
                            )}
                            <h4
                              className="text-sm font-semibold"
                              style={{
                                color: item.completed ? "#9ca3af" : "#e8eaf6",
                                textDecoration: item.completed ? "line-through" : "none",
                              }}
                            >
                              {item.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-2 ml-6">
                            <BookOpen className="w-3 h-3" style={{ color: "#6b7280" }} />
                            <span className="text-xs" style={{ color: "#6b7280" }}>{item.resource}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* AI Tip */}
      <div className="glass-card p-6 mt-6 gradient-border">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(124, 58, 237, 0.1)" }}>
            <Zap className="w-5 h-5" style={{ color: "#7c3aed" }} />
          </div>
          <div>
            <h3 className="text-sm font-bold mb-1" style={{ color: "#e8eaf6" }}>AI 학습 팁</h3>
            <p className="text-sm" style={{ color: "#9ca3af" }}>
              현재 중급 단계의 &lsquo;REST API 설계&rsquo;와 &lsquo;DB 설계 및 최적화&rsquo;를 먼저 완료하면
              SQLD 자격증 준비에 시너지 효과가 있습니다. 주 3회, 하루 2시간 학습을 추천합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

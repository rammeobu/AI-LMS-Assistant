"use client";
import { useState } from "react";
import {
  Users, Search, Plus, MapPin, Target, Calendar,
  MessageCircle, ChevronRight, Filter,
} from "lucide-react";
import { mockTeamPosts } from "@/lib/mock-data";

export default function TeamPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredPosts = mockTeamPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesFilter = filterStatus === "all" || post.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: "#e8eaf6" }}>
            👥 팀원 <span className="gradient-text">모집</span>
          </h1>
          <p className="text-sm" style={{ color: "#9ca3af" }}>
            같은 목표를 가진 동료를 찾고 함께 성장하세요
          </p>
        </div>
        <button className="btn-gradient flex items-center gap-2 text-sm shrink-0">
          <Plus className="w-4 h-4" /> 모집 글 작성
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "#6b7280" }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="제목, 기술, 키워드로 검색..."
            className="input-field pl-11"
          />
        </div>
        <div className="flex gap-2">
          {[
            { id: "all", label: "전체" },
            { id: "모집중", label: "모집중" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id)}
              className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
              style={{
                background: filterStatus === f.id ? "rgba(124, 58, 237, 0.15)" : "rgba(30, 31, 59, 0.5)",
                color: filterStatus === f.id ? "#7c3aed" : "#9ca3af",
                border: filterStatus === f.id ? "1px solid rgba(124, 58, 237, 0.3)" : "1px solid rgba(124, 58, 237, 0.08)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Team Posts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredPosts.map((post, i) => (
          <div
            key={post.id}
            className="glass-card p-6 cursor-pointer slide-up"
            style={{ opacity: 0, animationDelay: `${i * 0.1}s` }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #06b6d4)" }}
                >
                  {post.author.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-bold" style={{ color: "#e8eaf6" }}>{post.author}</p>
                  <p className="text-xs" style={{ color: "#6b7280" }}>
                    {post.school} · {post.major}
                  </p>
                </div>
              </div>
              <span className="badge-success badge text-xs">{post.status}</span>
            </div>

            {/* Title & Description */}
            <h3 className="text-base font-bold mb-2" style={{ color: "#e8eaf6" }}>{post.title}</h3>
            <p className="text-sm mb-3 line-clamp-2" style={{ color: "#9ca3af" }}>{post.description}</p>

            {/* Meta */}
            <div className="flex items-center gap-3 mb-3 text-xs" style={{ color: "#6b7280" }}>
              <span className="flex items-center gap-1">
                <Target className="w-3 h-3" /> {post.targetJob}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" /> {post.currentMembers}/{post.maxMembers}명
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {post.createdAt}
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {post.skills.map((skill) => (
                <span key={skill} className="text-xs px-2 py-1 rounded-md" style={{ background: "rgba(79, 70, 229, 0.1)", color: "#818cf8" }}>
                  {skill}
                </span>
              ))}
            </div>

            {/* Members Progress */}
            <div>
              <div className="flex items-center justify-between text-xs mb-1.5">
                <span style={{ color: "#6b7280" }}>모집 현황</span>
                <span style={{ color: "#a78bfa" }}>{post.currentMembers}/{post.maxMembers}</span>
              </div>
              <div className="progress-bar" style={{ height: "6px" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${(post.currentMembers / post.maxMembers) * 100}%`,
                    background: "linear-gradient(90deg, #7c3aed, #06b6d4)",
                  }}
                />
              </div>
            </div>

            {/* Apply Button */}
            <button
              className="w-full mt-4 py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-all duration-200 hover:opacity-80"
              style={{
                background: "rgba(124, 58, 237, 0.1)",
                border: "1px solid rgba(124, 58, 237, 0.2)",
                color: "#a78bfa",
              }}
            >
              <MessageCircle className="w-4 h-4" /> 지원하기
            </button>
          </div>
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-12 h-12 mx-auto mb-4" style={{ color: "#2a2b4a" }} />
          <p className="text-base font-medium mb-1" style={{ color: "#6b7280" }}>검색 결과가 없습니다</p>
          <p className="text-sm" style={{ color: "#4b5563" }}>다른 키워드로 검색해보세요</p>
        </div>
      )}
    </div>
  );
}

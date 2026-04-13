"use client";

import { Calendar, Search, Star, Filter, LayoutList, LayoutGrid, Brain, Loader2, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import ActivityDetailDrawer from "./ActivityDetailDrawer";

/* ───────── Supabase crawling_data row type ───────── */
interface CrawlingData {
  id: number;
  collected_at: string | null;
  organization: string | null;
  title: string;
  subject: string | null;
  start_date: string | null;
  end_date: string | null;
  target: string | null;
  homepage: string | null;
  description: string | null;
  created_at: string | null;
}

const PASTEL_COLORS = [
  "#fff1f2", // rose-50
  "#fff7ed", // orange-50
  "#fffbeb", // amber-50
  "#f0fdf4", // green-50
  "#ecfdf5", // emerald-50
  "#f0fdfa", // teal-50
  "#ecfeff", // cyan-50
  "#eff6ff", // blue-50
  "#eef2ff", // indigo-50
  "#f5f3ff", // violet-50
  "#faf5ff", // purple-50
  "#fdf4ff", // fuchsia-50
  "#fdf2f8", // pink-50
];

const GRADIENTS = [
  "linear-gradient(135deg, #f6d365, #fda085)",
  "linear-gradient(135deg, #84fab0, #8fd3f4)",
  "linear-gradient(135deg, #a18cd1, #fbc2eb)",
  "linear-gradient(135deg, #fbc2eb, #a6c1ee)",
  "linear-gradient(135deg, #667eea, #764ba2)",
  "linear-gradient(135deg, #f093fb, #f5576c)",
  "linear-gradient(135deg, #4facfe, #00f2fe)",
  "linear-gradient(135deg, #43e97b, #38f9d7)",
  "linear-gradient(135deg, #fa709a, #fee140)",
];

function getStatus(endDate: string | null): { label: string; color: string } {
  if (!endDate) return { label: "상시 모집", color: "bg-blue-100 text-blue-700" };

  const now = new Date();
  const end = new Date(endDate);
  const diff = end.getTime() - now.getTime();
  const daysLeft = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (daysLeft < 0) return { label: "마감", color: "bg-gray-200 text-gray-500" };
  if (daysLeft <= 7) return { label: "마감 임박", color: "bg-red-100 text-red-700" };
  return { label: "모집중", color: "bg-emerald-100 text-emerald-700" };
}

function formatPeriod(start: string | null, end: string | null): string {
  const fmt = (d: string | null) => {
    if (!d) return "미정";
    try {
      const date = new Date(d);
      return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(date.getDate()).padStart(2, "0")}`;
    } catch {
      return d;
    }
  };
  return `${fmt(start)} ~ ${fmt(end)}`;
}

function guessTags(subject: string | null, title: string): string[] {
  const tags: string[] = [];
  const text = `${subject || ""} ${title}`.toLowerCase();

  if (text.includes("공모전") || text.includes("대회") || text.includes("챌린지") || text.includes("경진대회")) tags.push("공모전/경진대회");
  if (text.includes("해커톤")) tags.push("해커톤");
  if (text.includes("학술대회")) tags.push("학술대회");
  if (text.includes("인턴") || text.includes("채용")) tags.push("채용/인턴");
  if (text.includes("교육") || text.includes("부트캠프") || text.includes("캠프")) tags.push("교육");
  if (text.includes("장학") || text.includes("지원")) tags.push("지원사업");
  if (text.includes("서포터즈") || text.includes("기자단")) tags.push("서포터즈");

  if (tags.length === 0) tags.push("활동");
  return tags;
}

export default function DiscoveryFeed() {
  const [viewMode, setViewMode] = useState<"card" | "poster">("card");
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [activities, setActivities] = useState<CrawlingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("전체");

  /* ── Fetch from Supabase ── */
  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("crawling_data")
          .select("*")
          .order("created_at", { ascending: false });

        if (fetchError) {
          console.error("Supabase fetch error:", fetchError);
          setError(fetchError.message);
          return;
        }

        setActivities(data ?? []);
      } catch (e: any) {
        console.error("Unexpected error:", e);
        setError(e.message ?? "알 수 없는 에러가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    }

    fetchActivities();
  }, []);

  /* ── Filter & Search ── */
  const filteredActivities = activities.filter((item) => {
    const matchesSearch =
      !searchQuery ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.organization && item.organization.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (item.subject && item.subject.toLowerCase().includes(searchQuery.toLowerCase()));

    const tags = guessTags(item.subject, item.title);
    const matchesFilter =
      activeFilter === "전체" ||
      (activeFilter === "공모전/경진대회" && tags.some((t) => ["공모전/경진대회", "해커톤"].includes(t))) ||
      (activeFilter === "학술대회" && tags.some((t) => ["학술대회"].includes(t))) ||
      (activeFilter === "교육/지원" && tags.some((t) => ["교육", "지원사업", "채용/인턴"].includes(t)));

    return matchesSearch && matchesFilter;
  });

  /* ── Map row → card props ── */
  const feedItems = filteredActivities.map((item, i) => {
    const status = getStatus(item.end_date);
    const tags = guessTags(item.subject, item.title);
    return {
      id: item.id,
      status: status.label,
      statusColor: status.color,
      category: item.subject || "기타",
      title: item.title,
      subtitle: item.description
        ? item.description.length > 80
          ? item.description.slice(0, 80) + "…"
          : item.description
        : item.organization
          ? `${item.organization} 주관`
          : "",
      period: formatPeriod(item.start_date, item.end_date),
      skills: tags,
      aiComment: `${item.organization || "주최기관"} 주관의 활동으로, 역량 성장에 도움이 될 수 있습니다.`,
      points: `+${Math.min(15, 5 + (i % 11))}%`,
      duration: status.label,
      tag: tags[0] || "활동",
      gradient: GRADIENTS[i % GRADIENTS.length],
      homepage: item.homepage,
      target: item.target,
      organization: item.organization,
      description: item.description,
      start_date: item.start_date,
      end_date: item.end_date,
    };
  });

  const handleCardClick = (item: any) => {
    setSelectedActivity(item);
    setIsDrawerOpen(true);
  };

  const FILTER_BUTTONS = ["전체", "공모전/경진대회", "학술대회", "교육/지원"];

  /* ── Loading state ── */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4 text-gray-400 animate-pulse">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-sm font-semibold">활동 데이터를 불러오는 중…</p>
      </div>
    );
  }

  /* ── Error state ── */
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-32 gap-4">
        <div className="text-red-400 text-4xl">⚠️</div>
        <p className="text-sm font-semibold text-gray-600">데이터를 불러오지 못했습니다</p>
        <p className="text-xs text-gray-400 max-w-md text-center">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Search + View Toggle ── */}
      <div className="flex justify-between items-center w-full mb-2 gap-3">
        <p className="text-sm text-gray-500 font-medium shrink-0">
          총 <span className="font-extrabold text-gray-900">{feedItems.length}</span>건
        </p>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input
              type="text"
              placeholder="활동 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
          </div>

          <div className="flex gap-1 bg-gray-100/80 p-1.5 rounded-xl border border-gray-200 shrink-0">
            <button
              onClick={() => setViewMode("card")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "card"
                  ? "bg-white shadow-sm text-primary"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
                }`}
              title="카드형 보기"
            >
              <LayoutList className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("poster")}
              className={`p-1.5 rounded-lg transition-all ${viewMode === "poster"
                  ? "bg-white shadow-sm text-primary"
                  : "text-gray-400 hover:text-gray-600 hover:bg-gray-200/50"
                }`}
              title="포스터형 보기"
            >
              <LayoutGrid className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* ── Filter Buttons ── */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {FILTER_BUTTONS.map((label) => (
          <button
            key={label}
            onClick={() => setActiveFilter(label)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold shrink-0 transition-colors ${activeFilter === label
                ? "bg-gray-900 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
          >
            {label === "전체" && <Filter className="w-4 h-4" />}
            {label}
          </button>
        ))}
      </div>

      {/* ── Empty state ── */}
      {feedItems.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400">
          <Search className="w-10 h-10" />
          <p className="text-sm font-semibold">검색 결과가 없습니다</p>
        </div>
      )}

      {/* ── Cards / Poster Grid ── */}
      <div
        className={`grid gap-5 transition-all ${viewMode === "card"
            ? "grid-cols-1 lg:grid-cols-2"
            : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          }`}
      >
        {feedItems.map((item, i) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item)}
            className={`glass-card group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 relative flex flex-col overflow-hidden ${viewMode === "poster" ? "h-[320px] p-0" : "p-6 h-full gap-3"
              }`}
            style={viewMode === "card" ? { backgroundColor: PASTEL_COLORS[i % PASTEL_COLORS.length] } : undefined}
          >
            {/* Poster Mode Styling */}
            {viewMode === "poster" && (
              <>
                <div className="h-44 w-full relative flex-shrink-0" style={{ background: item.gradient }}>
                  <div className="absolute top-3 right-3 text-white drop-shadow-md">
                    <button className="hover:scale-110 transition-transform">
                      <Star className="w-5 h-5 fill-white/20" />
                    </button>
                  </div>
                  <span
                    className={`absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-black w-fit bg-white/95 shadow-sm text-gray-800`}
                  >
                    {item.tag}
                  </span>
                </div>
                <div className="flex flex-col flex-1 p-4 bg-white/50">
                  <h3 className="font-bold text-gray-900 leading-snug group-hover:text-primary transition-colors text-sm mb-1 line-clamp-2">
                    {item.title}
                  </h3>
                  <div className="mt-auto flex justify-between items-center mt-3">
                    <span className="text-xs text-gray-500 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" /> {item.duration}
                    </span>
                    <span className="text-xs font-extrabold text-primary">{item.points}</span>
                  </div>
                </div>
              </>
            )}

            {/* Card Mode Styling (Detailed List) */}
            {viewMode === "card" && (
              <>
                <div className="absolute top-5 right-5 flex items-center gap-2">
                  {item.homepage && (
                    <a
                      href={item.homepage}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-gray-300 hover:text-primary transition-colors"
                      title="홈페이지 바로가기"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                  <button className="text-gray-300 hover:text-yellow-400 transition-colors">
                    <Star className="w-6 h-6" />
                  </button>
                </div>

                <div className="flex items-center gap-2 mb-1">
                  <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${item.statusColor}`}>
                    {item.status}
                  </span>
                  <span className="text-xs font-semibold text-gray-500">{item.category}</span>
                </div>

                <div>
                  <h3 className="font-extrabold text-xl text-gray-900 mb-1.5 leading-tight group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  {item.organization && (
                    <p className="text-xs text-primary/70 font-bold mb-1">🏢 {item.organization}</p>
                  )}
                  <p className="text-sm text-gray-500 font-medium mb-3">{item.subtitle}</p>
                  <p className="text-sm text-gray-400 font-medium flex items-center gap-1.5 mb-2">
                    <Calendar className="w-4 h-4" /> {item.period}
                  </p>
                  {item.target && (
                    <p className="text-xs text-gray-400 mb-4">🎯 대상: {item.target}</p>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-2">
                  {item.skills.map((skill, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-bold border border-gray-100"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="mt-auto pt-4 relative">
                  <div className="bg-primary/5 rounded-xl p-3 flex items-center gap-2.5 border border-primary/10">
                    <Brain className="w-4 h-4 text-primary shrink-0" />
                    <p className="text-xs text-primary font-bold tracking-tight">{item.aiComment}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <ActivityDetailDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} activity={selectedActivity} />
    </div>
  );
}

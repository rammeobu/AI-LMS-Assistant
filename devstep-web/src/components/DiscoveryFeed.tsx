"use client";

import { Calendar, Search, Star, Filter, LayoutList, LayoutGrid, Brain, Loader2, ExternalLink, ChevronLeft, ChevronRight, Target } from "lucide-react";
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

const ITEMS_PER_PAGE = 4;

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
    } catch { return d; }
  };
  return `${fmt(start)} ~ ${fmt(end)}`;
}

function guessTags(subject: string | null, title: string): string[] {
  const tags: string[] = [];
  const text = `${subject || ""} ${title}`.toLowerCase();
  if (text.includes("공모전") || text.includes("대회") || text.includes("챌린지")) tags.push("공모전");
  if (text.includes("해커톤")) tags.push("해커톤");
  if (text.includes("대외활동") || text.includes("봉사")) tags.push("대외활동");
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
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    async function fetchActivities() {
      try {
        setLoading(true);
        const supabase = createClient();
        const { data, error: fetchError } = await supabase
          .from("crawling_data")
          .select("*")
          .order("created_at", { ascending: false });
        if (fetchError) throw fetchError;
        setActivities(data ?? []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchActivities();
  }, []);

  const filteredActivities = activities.filter((item) => {
    const matchesSearch = !searchQuery || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.organization?.toLowerCase().includes(searchQuery.toLowerCase()));
    const tags = guessTags(item.subject, item.title);
    const matchesFilter = activeFilter === "전체" ||
      (activeFilter === "공모전" && tags.some(t => ["공모전", "해커톤"].includes(t))) ||
      (activeFilter === "대외활동" && tags.some(t => ["대외활동", "서포터즈"].includes(t))) ||
      (activeFilter === "교육/지원" && tags.some(t => ["교육", "지원사업", "채용/인턴"].includes(t)));
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredActivities.length / ITEMS_PER_PAGE);
  const currentItems = filteredActivities.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const feedItems = currentItems.map((item, i) => {
    const status = getStatus(item.end_date);
    const tags = guessTags(item.subject, item.title);
    return {
      id: item.id,
      status: status.label,
      statusColor: status.color,
      category: item.subject || "기타",
      title: item.title,
      subtitle: item.description 
        ? (item.description.length > 100 ? item.description.slice(0, 100) + "..." : item.description)
        : (item.organization ? `${item.organization} 주관 활동` : ""),
      period: formatPeriod(item.start_date, item.end_date),
      skills: tags,
      aiComment: `${item.organization || "브랜드"}의 전문 가이드입니다.`,
      points: `+${Math.min(15, 5 + (i % 11))}%`,
      tag: tags[0] || "활동",
      gradient: GRADIENTS[i % GRADIENTS.length],
      homepage: item.homepage,
      target: item.target,
      organization: item.organization,
      description: item.description,
    };
  });

  const handleCardClick = (item: any) => {
    setSelectedActivity(item);
    setIsDrawerOpen(true);
  };

  if (loading) return <div className="py-32 flex flex-col items-center justify-center gap-4 animate-pulse"><Loader2 className="w-10 h-10 animate-spin text-primary" /><p className="text-sm font-bold text-gray-400">활동 엔진 가동 중...</p></div>;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center w-full gap-3 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <p className="text-sm text-gray-400 font-bold">총 <span className="text-gray-900">{filteredActivities.length}</span>개의 활동</p>
        <div className="flex items-center gap-3">
          <div className="relative">
            <input type="text" placeholder="관심 키워드 검색..." value={searchQuery} onChange={e => {setSearchQuery(e.target.value); setCurrentPage(1);}} className="pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-xl text-sm focus:ring-primary w-40 md:w-64 transition-all" />
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
          </div>
          <div className="flex gap-1 bg-gray-100/50 p-1 rounded-xl border border-gray-100">
            <button onClick={() => setViewMode("card")} className={`p-1.5 rounded-lg transition-all ${viewMode==="card" ? "bg-white shadow-sm text-primary":"text-gray-400"}`}><LayoutList className="w-5 h-5"/></button>
            <button onClick={() => setViewMode("poster")} className={`p-1.5 rounded-lg transition-all ${viewMode==="poster" ? "bg-white shadow-sm text-primary":"text-gray-400"}`}><LayoutGrid className="w-5 h-5"/></button>
          </div>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {["전체", "공모전", "대외활동", "교육/지원"].map(label => (
          <button key={label} onClick={() => {setActiveFilter(label); setCurrentPage(1);}} className={`px-5 py-2.5 rounded-2xl text-sm font-black transition-all ${activeFilter===label ? "bg-primary text-white shadow-lg shadow-primary/20":"bg-white border border-gray-100 text-gray-500 hover:bg-gray-50"}`}>{label}</button>
        ))}
      </div>

      {feedItems.length > 0 ? (
        <div className={`grid gap-6 ${viewMode==="card" ? "grid-cols-1 lg:grid-cols-2":"grid-cols-2 lg:grid-cols-4"}`}>
          {feedItems.map((item) => (
            <div key={item.id} onClick={() => handleCardClick(item)} className="glass-card group cursor-pointer hover:shadow-2xl hover:border-primary/30 transition-all p-7 relative flex flex-col gap-4 border border-gray-100">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded text-[10px] font-black ${item.statusColor}`}>{item.status}</span>
                  <span className="text-[10px] font-bold text-gray-300 tracking-widest">{item.tag}</span>
                </div>
                <Star className="w-5 h-5 text-gray-200 group-hover:text-yellow-400 transition-colors" />
              </div>

              <div>
                <h3 className="font-black text-xl text-gray-900 leading-tight group-hover:text-primary transition-colors mb-2 line-clamp-1">{item.title}</h3>
                {item.organization && <p className="text-xs text-primary font-bold mb-3 flex items-center gap-1">🏢 {item.organization}</p>}
                <p className="text-sm text-gray-500 font-medium line-clamp-3 leading-relaxed mb-4">{item.subtitle}</p>
                
                <div className="flex flex-col gap-2">
                  <p className="text-xs text-gray-400 flex items-center gap-1.5 font-bold"><Calendar className="w-3.5 h-3.5" /> {item.period}</p>
                  {item.target && <p className="text-[11px] text-gray-400 flex items-center gap-1.5"><Target className="w-3.5 h-3.5" /> {item.target}</p>}
                </div>
              </div>

              <div className="mt-auto pt-4 flex justify-between items-center border-t border-gray-50">
                <div className="flex gap-1.5">
                   {item.skills.map(s => <span key={s} className="px-2 py-1 bg-gray-50 text-gray-400 text-[9px] font-black rounded-lg border border-gray-50">{s}</span>)}
                </div>
                <div className="flex items-center gap-1.5 bg-primary/5 px-2 py-1 rounded-lg border border-primary/10">
                  <Brain className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[10px] font-black text-primary">{item.points}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-24 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-100 flex flex-col items-center gap-4">
           <Search className="w-12 h-12 text-gray-200" />
           <p className="text-gray-400 font-black text-sm uppercase tracking-widest">No matching activities found</p>
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-3 mt-8">
          <button onClick={() => setCurrentPage(p => Math.max(1, p-1))} disabled={currentPage===1} className="w-12 h-12 flex items-center justify-center border border-gray-100 rounded-2xl hover:bg-white hover:shadow-lg transition-all disabled:opacity-20"><ChevronLeft className="w-6 h-6"/></button>
          <div className="flex gap-2">
            {[...Array(totalPages)].map((_, i) => {
              const p = i + 1;
              if (p < currentPage - 2 || p > currentPage + 2) return null;
              return (
                <button key={p} onClick={() => setCurrentPage(p)} className={`w-12 h-12 rounded-2xl text-sm font-black transition-all ${currentPage===p ? "bg-primary text-white shadow-xl shadow-primary/30":"bg-white text-gray-400 border border-gray-100 hover:border-primary/30"}`}>{p}</button>
              );
            })}
          </div>
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))} disabled={currentPage===totalPages} className="w-12 h-12 flex items-center justify-center border border-gray-100 rounded-2xl hover:bg-white hover:shadow-lg transition-all disabled:opacity-20"><ChevronRight className="w-6 h-6"/></button>
        </div>
      )}

      <ActivityDetailDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} activity={selectedActivity} />
    </div>
  );
}

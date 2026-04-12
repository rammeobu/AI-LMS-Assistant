"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import DashboardOverview from "@/components/DashboardOverview";
import DiscoveryFeed from "@/components/DiscoveryFeed";
import RoadmapPathfinder from "@/components/RoadmapPathfinder";
import CalendarSync from "@/components/CalendarSyncV2";

function DashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      {(currentTab === "dashboard" || currentTab === "ai-analysis") && <DashboardOverview />}
      {currentTab === "feed" && <DiscoveryFeed />}
      {currentTab === "roadmap" && <RoadmapPathfinder />}
      {currentTab === "calendar" && <CalendarSync />}
      {(currentTab === "settings" || currentTab === "profile") && <div>Settings Placeholder</div>}
      {currentTab === "portfolio" && <div>Portfolio Placeholder</div>}
      {currentTab === "internship" && <div>Internship Guide Placeholder</div>}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Loading Dashboard...</div>}>
      <DashboardContent />
    </Suspense>
  );
}

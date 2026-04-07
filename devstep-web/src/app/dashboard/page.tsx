"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import DashboardOverview from "@/components/DashboardOverview";
import DiscoveryFeed from "@/components/DiscoveryFeed";
import RoadmapPathfinder from "@/components/RoadmapPathfinder";
import TeamUpBoard from "@/components/TeamUpBoard";
import CalendarSync from "@/components/CalendarSync";

function DashboardContent() {
  const searchParams = useSearchParams();
  const currentTab = searchParams.get("tab") || "dashboard";

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      {currentTab === "dashboard" && <DashboardOverview />}
      {currentTab === "feed" && <DiscoveryFeed />}
      {currentTab === "roadmap" && <RoadmapPathfinder />}
      {currentTab === "team" && <TeamUpBoard />}
      {currentTab === "calendar" && <CalendarSync />}
      {currentTab === "settings" && <div>Settings Placeholder</div>}
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

"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart as RechartsRadarChart, ResponsiveContainer, Tooltip } from "recharts";

const mockRadarData = [
  { subject: "프론트엔드", level: 85, fullMark: 100 },
  { subject: "백엔드", level: 40, fullMark: 100 },
  { subject: "CS 기초", level: 75, fullMark: 100 },
  { subject: "알고리즘", level: 45, fullMark: 100 },
  { subject: "협업/Git", level: 90, fullMark: 100 },
  { subject: "오픈소스", level: 30, fullMark: 100 },
];

export default function RadarChart({ data = mockRadarData }) {
  return (
    <div className="w-full h-full min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsRadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "#64748b", fontSize: 13, fontWeight: 500 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="현재 역량"
            dataKey="level"
            stroke="var(--color-primary)"
            strokeWidth={3}
            fill="var(--color-primary)"
            fillOpacity={0.4}
            animationDuration={1500}
            animationEasing="ease-out"
          />
          <Tooltip 
            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }} 
            itemStyle={{ color: 'var(--color-primary)', fontWeight: 'bold' }}
            cursor={{ fill: 'transparent' }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}

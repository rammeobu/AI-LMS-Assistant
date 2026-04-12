"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart as RechartsRadarChart, ResponsiveContainer, Tooltip } from "recharts";

const mockRadarData = [
  { subject: "기술 역량", level: 78, fullMark: 100 },
  { subject: "실무 경험", level: 70, fullMark: 100 },
  { subject: "자격증", level: 55, fullMark: 100 },
  { subject: "프로젝트", level: 75, fullMark: 100 },
  { subject: "대외활동", level: 60, fullMark: 100 },
  { subject: "계획성", level: 65, fullMark: 100 },
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

"use client";

import { memo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart as RechartsRadar,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export const VyiralRadarChart = memo(function VyiralRadarChart({
  data,
}: {
  data: Array<{ subject: string; score: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="hsl(217 33% 22%)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }}
        />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#a855f7"
          fill="#a855f7"
          fillOpacity={0.35}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(222 47% 8%)",
            border: "1px solid hsl(217 33% 18%)",
            borderRadius: "12px",
          }}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
});

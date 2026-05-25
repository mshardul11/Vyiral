"use client";

import { memo } from "react";
import {
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart as RechartsRadar,
  ResponsiveContainer,
} from "recharts";

export const VyiralRadarChart = memo(function VyiralRadarChart({
  data,
}: {
  data: Array<{ subject: string; score: number }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsRadar data={data} cx="50%" cy="50%" outerRadius="75%">
        <PolarGrid stroke="hsl(217 33% 18%)" />
        <PolarAngleAxis
          dataKey="subject"
          tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="#8b5cf6"
          fill="#8b5cf6"
          fillOpacity={0.35}
        />
      </RechartsRadar>
    </ResponsiveContainer>
  );
});

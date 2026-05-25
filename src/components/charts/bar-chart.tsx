"use client";

import { memo } from "react";
import {
  Bar,
  BarChart as RechartsBar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const VyiralBarChart = memo(function VyiralBarChart({
  data,
  xKey,
  dataKey,
  color = "#8b5cf6",
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  dataKey: string;
  color?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBar data={data} barSize={28}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(222 47% 8%)",
            border: "1px solid hsl(217 33% 18%)",
            borderRadius: "12px",
          }}
          cursor={{ fill: "hsl(262 83% 58% / 0.1)" }}
        />
        <Bar dataKey={dataKey} fill={color} radius={[6, 6, 0, 0]} />
      </RechartsBar>
    </ResponsiveContainer>
  );
});

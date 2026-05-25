"use client";

import { memo } from "react";
import {
  Area,
  AreaChart as RechartsArea,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export const VyiralAreaChart = memo(function VyiralAreaChart({
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
      <RechartsArea data={data}>
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.35} />
            <stop offset="100%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }} axisLine={false} tickLine={false} width={48} />
        <Tooltip
          contentStyle={{
            backgroundColor: "hsl(222 47% 8%)",
            border: "1px solid hsl(217 33% 18%)",
            borderRadius: "12px",
          }}
        />
        <Area type="monotone" dataKey={dataKey} stroke={color} fill="url(#areaFill)" strokeWidth={2} />
      </RechartsArea>
    </ResponsiveContainer>
  );
});

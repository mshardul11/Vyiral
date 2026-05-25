"use client";

import { memo } from "react";
import {
  CartesianGrid,
  Line,
  LineChart as RechartsLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const tooltipStyle = {
  backgroundColor: "hsl(222 47% 8%)",
  border: "1px solid hsl(217 33% 18%)",
  borderRadius: "12px",
  fontSize: "12px",
};

export const VyiralLineChart = memo(function VyiralLineChart({
  data,
  xKey,
  lines,
}: {
  data: Array<Record<string, string | number>>;
  xKey: string;
  lines: Array<{ key: string; color: string; name?: string }>;
}) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLine data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" vertical={false} />
        <XAxis
          dataKey={xKey}
          tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          width={40}
        />
        <Tooltip contentStyle={tooltipStyle} />
        {lines.map((line) => (
          <Line
            key={line.key}
            type="monotone"
            dataKey={line.key}
            name={line.name ?? line.key}
            stroke={line.color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
        ))}
      </RechartsLine>
    </ResponsiveContainer>
  );
});

"use client";

import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const METRICS = [
  { key: "subscribers", label: "Subscribers", color: "#8b5cf6" },
  { key: "views", label: "Views", color: "#06b6d4" },
  { key: "watchTime", label: "Watch Time (hrs)", color: "#10b981" },
  { key: "ctr", label: "CTR (%)", color: "#f59e0b" },
  { key: "engagement", label: "Engagement (%)", color: "#ec4899" },
];

interface DataPoint {
  date: string;
  value: number;
}

interface TrendData {
  subscribers: DataPoint[];
  views: DataPoint[];
  watchTime: DataPoint[];
  ctr: DataPoint[];
  engagement: DataPoint[];
}

export function AnalyticsTrendChart({ data }: { data: TrendData }) {
  const [activeMetric, setActiveMetric] = useState("views");

  const active = METRICS.find((m) => m.key === activeMetric)!;
  const chartData = data[activeMetric as keyof TrendData] ?? [];

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-semibold text-foreground">Performance Trends</h3>
        <div className="flex flex-wrap gap-1.5">
          {METRICS.map((m) => (
            <button
              key={m.key}
              onClick={() => setActiveMetric(m.key)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${
                activeMetric === m.key
                  ? "text-white shadow-sm"
                  : "bg-muted/40 text-muted-foreground hover:bg-muted/60"
              }`}
              style={activeMetric === m.key ? { backgroundColor: m.color } : {}}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-60 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={`grad-${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={active.color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={active.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" vertical={false} />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={48}
              tickFormatter={(v) =>
                v >= 1000 ? `${(v / 1000).toFixed(0)}K` : String(v)
              }
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 47% 8%)",
                border: "1px solid hsl(217 33% 18%)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
              formatter={(value: number) => [
                value.toLocaleString(),
                active.label,
              ]}
            />
            <Area
              type="monotone"
              dataKey="value"
              name={active.label}
              stroke={active.color}
              fill={`url(#grad-${activeMetric})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: active.color }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

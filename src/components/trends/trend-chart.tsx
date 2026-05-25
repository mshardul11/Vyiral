"use client";

import type { Trend } from "./trends-client";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ec4899"];

export function TrendChart({ trends }: { trends: Trend[] }) {
  const weeks = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"];

  const data = weeks.map((week, i) => {
    const point: Record<string, string | number> = { week };
    trends.forEach((t) => {
      point[t.keyword.slice(0, 20)] = Math.max(
        10,
        Math.round(t.momentum * (0.3 + (i / 7) * 0.7) + (Math.random() - 0.3) * 10)
      );
    });
    return point;
  });

  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <div className="mb-4">
        <h3 className="font-semibold text-foreground">Trend Momentum Over Time</h3>
        <p className="text-xs text-muted-foreground">8-week momentum index for top trends</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" vertical={false} />
            <XAxis
              dataKey="week"
              tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 100]}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 47% 8%)",
                border: "1px solid hsl(217 33% 18%)",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "11px", paddingTop: "12px" }}
              formatter={(value) => (
                <span style={{ color: "hsl(215 20% 65%)" }}>
                  {value.length > 25 ? value.slice(0, 25) + "…" : value}
                </span>
              )}
            />
            {trends.map((t, idx) => (
              <Line
                key={t.id}
                type="monotone"
                dataKey={t.keyword.slice(0, 20)}
                stroke={COLORS[idx % COLORS.length]}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

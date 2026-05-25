"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

interface TrafficSource {
  source: string;
  percentage: number;
  color: string;
}

export function TrafficSourcesChart({ sources }: { sources: TrafficSource[] }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/50 p-5">
      <h3 className="mb-4 font-semibold text-foreground">Traffic Sources</h3>
      <div className="flex items-center gap-6">
        <div className="h-40 w-40 shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={sources}
                dataKey="percentage"
                nameKey="source"
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={68}
                strokeWidth={0}
              >
                {sources.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 8%)",
                  border: "1px solid hsl(217 33% 18%)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(v: number) => [`${v}%`]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex-1 space-y-2.5">
          {sources.map((s) => (
            <div key={s.source} className="flex items-center gap-2.5">
              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: s.color }}
              />
              <span className="flex-1 text-xs text-muted-foreground">{s.source}</span>
              <span className="text-xs font-semibold text-foreground">{s.percentage}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

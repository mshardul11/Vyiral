"use client";

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface AudienceData {
  ageGroups: Array<{ group: string; percentage: number }>;
  topCountries: Array<{ country: string; percentage: number; flag: string }>;
  genderSplit: { male: number; female: number; other: number };
  watchTime: { mobile: number; desktop: number; tv: number };
}

const AGE_COLORS = ["#8b5cf6", "#7c3aed", "#6d28d9", "#5b21b6", "#4c1d95"];

export function AudienceAnalytics({ data }: { data: AudienceData }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Age breakdown */}
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <h3 className="mb-4 font-semibold text-foreground">Age Groups</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.ageGroups} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <XAxis
                dataKey="group"
                tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(215 20% 65%)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 8%)",
                  border: "1px solid hsl(217 33% 18%)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(v: number) => [`${v}%`, "Audience"]}
              />
              <Bar dataKey="percentage" radius={[4, 4, 0, 0]}>
                {data.ageGroups.map((_, idx) => (
                  <Cell key={idx} fill={AGE_COLORS[idx % AGE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top countries */}
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <h3 className="mb-4 font-semibold text-foreground">Top Countries</h3>
        <div className="space-y-2.5">
          {data.topCountries.map((c) => (
            <div key={c.country} className="flex items-center gap-2.5">
              <span className="text-base">{c.flag}</span>
              <span className="min-w-0 flex-1 truncate text-sm text-muted-foreground">{c.country}</span>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted/40">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${c.percentage}%` }}
                  />
                </div>
                <span className="w-8 text-right text-xs font-semibold text-foreground">{c.percentage}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Gender split */}
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <h3 className="mb-4 font-semibold text-foreground">Gender Split</h3>
        <div className="space-y-3">
          {[
            { label: "Male", value: data.genderSplit.male, color: "#6366f1" },
            { label: "Female", value: data.genderSplit.female, color: "#ec4899" },
            { label: "Other", value: data.genderSplit.other, color: "#6b7280" },
          ].map((g) => (
            <div key={g.label} className="flex items-center gap-3">
              <span className="w-12 text-sm text-muted-foreground">{g.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${g.value}%`, backgroundColor: g.color }}
                />
              </div>
              <span className="w-10 text-right text-sm font-semibold text-foreground">{g.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Device breakdown */}
      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <h3 className="mb-4 font-semibold text-foreground">Watch Time by Device</h3>
        <div className="space-y-3">
          {[
            { label: "Mobile", value: data.watchTime.mobile, color: "#8b5cf6" },
            { label: "Desktop", value: data.watchTime.desktop, color: "#06b6d4" },
            { label: "TV", value: data.watchTime.tv, color: "#10b981" },
          ].map((d) => (
            <div key={d.label} className="flex items-center gap-3">
              <span className="w-14 text-sm text-muted-foreground">{d.label}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${d.value}%`, backgroundColor: d.color }}
                />
              </div>
              <span className="w-10 text-right text-sm font-semibold text-foreground">{d.value}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

const SHORTS_DATA = [
  { title: "POV: You Finally Fixed Your SEO", views: 284000, likes: 18200, shares: 4100, retention: 78 },
  { title: "The 3-second hook trick", views: 196000, likes: 12400, shares: 2800, retention: 82 },
  { title: "This killed my CTR (don't do it)", views: 147000, likes: 9100, shares: 1600, retention: 71 },
  { title: "Tag strategy in 60 seconds", views: 98000, likes: 6200, shares: 1100, retention: 69 },
  { title: "Algorithm insight no one talks about", views: 62000, likes: 4300, shares: 780, retention: 74 },
];

const CHART_DATA = SHORTS_DATA.map((s) => ({
  name: s.title.length > 22 ? s.title.slice(0, 22) + "…" : s.title,
  views: s.views,
  likes: s.likes,
}));

const OVERVIEW = [
  { label: "Total Shorts Views", value: "787K", delta: "+34%" },
  { label: "Avg Retention", value: "74.8%", delta: "+3.2%" },
  { label: "Shorts → Subs", value: "2,840", delta: "+12%" },
  { label: "Avg Engagement", value: "8.6%", delta: "+1.1%" },
];

export function ShortsAnalytics() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {OVERVIEW.map((m) => (
          <div key={m.label} className="rounded-xl border border-border/60 bg-card/50 p-4">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="mt-1 text-2xl font-bold text-foreground">{m.value}</p>
            <p className="mt-0.5 text-xs font-medium text-emerald-400">{m.delta}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <h3 className="mb-4 font-semibold text-foreground">Top Shorts Performance</h3>
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={CHART_DATA} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(217 33% 18%)" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: "hsl(215 20% 65%)", fontSize: 10 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(222 47% 8%)",
                  border: "1px solid hsl(217 33% 18%)",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(v: number, name: string) => [v.toLocaleString(), name]}
              />
              <Bar dataKey="views" name="Views" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="likes" name="Likes" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-xl border border-border/60 bg-card/50 p-5">
        <h3 className="mb-4 font-semibold text-foreground">Shorts Retention Rates</h3>
        <div className="space-y-2.5">
          {SHORTS_DATA.map((s) => (
            <div key={s.title} className="flex items-center gap-3">
              <p className="w-48 truncate text-xs text-muted-foreground">{s.title}</p>
              <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/40">
                <div
                  className="h-full rounded-full bg-violet-500"
                  style={{ width: `${s.retention}%` }}
                />
              </div>
              <span className="w-10 text-right text-xs font-semibold text-foreground">{s.retention}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

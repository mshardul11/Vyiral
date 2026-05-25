"use client";

import type { CalItem } from "./calendar-client";
import { Film, Zap, Radio, Lightbulb } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const TYPE_ICONS = { video: Film, short: Zap, live: Radio, idea: Lightbulb };
const STATUS_COLORS = {
  idea: "bg-amber-500/15 text-amber-400",
  draft: "bg-blue-500/15 text-blue-400",
  scheduled: "bg-violet-500/15 text-violet-400",
  published: "bg-emerald-500/15 text-emerald-400",
};

export function CalendarAgenda({
  items,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  view,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  year,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  month,
}: {
  items: CalItem[];
  view: "week" | "agenda";
  year: number;
  month: number;
}) {
  const sorted = [...items].sort((a, b) => a.date.localeCompare(b.date));

  const grouped = sorted.reduce(
    (acc, item) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item);
      return acc;
    },
    {} as Record<string, CalItem[]>
  );

  const dates = Object.keys(grouped).sort();

  if (dates.length === 0) {
    return (
      <div className="rounded-xl border border-border/60 bg-card/50 p-8 text-center">
        <p className="text-muted-foreground">No content scheduled yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {dates.map((date) => {
        const dayItems = grouped[date]!;
        const d = new Date(date + "T12:00:00");
        const label = d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

        return (
          <div key={date} className="rounded-xl border border-border/60 bg-card/50 p-4">
            <p className="mb-3 text-sm font-semibold text-foreground">{label}</p>
            <div className="space-y-2">
              {dayItems.map((item) => {
                const Icon = TYPE_ICONS[item.type];
                return (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-lg border border-transparent p-2 hover:border-border/40 hover:bg-white/[0.02] transition-all"
                  >
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
                      style={{ backgroundColor: `${item.color}22` }}
                    >
                      <Icon className="h-3.5 w-3.5" style={{ color: item.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">{item.title}</p>
                      <p className="text-[10px] capitalize text-muted-foreground">{item.type}</p>
                    </div>
                    <Badge className={cn("text-[10px] capitalize", STATUS_COLORS[item.status])}>
                      {item.status}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

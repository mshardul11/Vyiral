"use client";

import type { CalItem } from "./calendar-client";
import { Film, Zap, Radio, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

const TYPE_ICONS = {
  video: Film,
  short: Zap,
  live: Radio,
  idea: Lightbulb,
};

const COLUMNS: { id: CalItem["status"]; label: string; color: string }[] = [
  { id: "idea", label: "Ideas", color: "border-amber-500/40" },
  { id: "draft", label: "Draft", color: "border-blue-500/40" },
  { id: "scheduled", label: "Scheduled", color: "border-violet-500/40" },
  { id: "published", label: "Published", color: "border-emerald-500/40" },
];

export function CalendarKanban({
  items,
  onUpdate,
}: {
  items: CalItem[];
  onUpdate: (items: CalItem[]) => void;
}) {
  function moveItem(id: string, status: CalItem["status"]) {
    onUpdate(items.map((item) => (item.id === id ? { ...item, status } : item)));
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {COLUMNS.map((col) => {
        const colItems = items.filter((i) => i.status === col.id);
        return (
          <div key={col.id} className={cn("rounded-xl border bg-card/30 p-3", col.color)}>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">{col.label}</h3>
              <span className="rounded-full bg-muted/40 px-2 py-0.5 text-[10px] text-muted-foreground">
                {colItems.length}
              </span>
            </div>
            <div className="space-y-2">
              {colItems.map((item) => {
                const Icon = TYPE_ICONS[item.type];
                return (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border/60 bg-card/80 p-2.5 cursor-pointer hover:border-border transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" style={{ color: item.color }} />
                      <p className="text-xs font-medium text-foreground leading-relaxed">{item.title}</p>
                    </div>
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] text-muted-foreground">{item.date}</span>
                    </div>
                    {col.id !== "published" && (
                      <div className="mt-2 flex gap-1">
                        {COLUMNS.filter((c) => c.id !== col.id).map((c) => (
                          <button
                            key={c.id}
                            onClick={() => moveItem(item.id, c.id)}
                            className="rounded px-1.5 py-0.5 text-[9px] font-medium text-muted-foreground hover:bg-white/5 hover:text-foreground transition-colors"
                          >
                            → {c.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
              {colItems.length === 0 && (
                <div className="rounded-lg border border-dashed border-border/40 p-4 text-center">
                  <p className="text-xs text-muted-foreground/60">Drop items here</p>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

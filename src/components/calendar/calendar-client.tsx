"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Film, Zap, Radio, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { CalendarAddDialog } from "./calendar-add-dialog";
import { CalendarKanban } from "./calendar-kanban";
import { CalendarAgenda } from "./calendar-agenda";

export type CalItem = {
  id: string;
  title: string;
  type: "video" | "short" | "live" | "idea";
  status: "idea" | "draft" | "scheduled" | "published";
  date: string;
  color: string;
};

const TYPE_ICONS = {
  video: Film,
  short: Zap,
  live: Radio,
  idea: Lightbulb,
};

const INITIAL_ITEMS: CalItem[] = [
  { id: "1", title: "10 YouTube SEO Tips for 2025", type: "video", status: "scheduled", date: "2025-01-08", color: "#8b5cf6" },
  { id: "2", title: "Quick hook script formula", type: "short", status: "draft", date: "2025-01-10", color: "#06b6d4" },
  { id: "3", title: "Live Q&A — Channel strategy", type: "live", status: "scheduled", date: "2025-01-12", color: "#ef4444" },
  { id: "4", title: "Thumbnail design deep dive", type: "video", status: "idea", date: "2025-01-15", color: "#8b5cf6" },
  { id: "5", title: "Algorithm update explained", type: "short", status: "scheduled", date: "2025-01-17", color: "#06b6d4" },
  { id: "6", title: "Behind the scenes: my setup", type: "video", status: "published", date: "2025-01-03", color: "#8b5cf6" },
  { id: "7", title: "Comment sentiment analysis idea", type: "idea", status: "idea", date: "2025-01-20", color: "#f59e0b" },
  { id: "8", title: "Shorts vs long form breakdown", type: "video", status: "draft", date: "2025-01-22", color: "#8b5cf6" },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function CalendarMonthView({
  year,
  month,
  items,
  onAdd,
}: {
  year: number;
  month: number;
  items: CalItem[];
  onAdd: (date: string) => void;
}) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);
  const today = new Date();

  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const itemsByDate = items.reduce(
    (acc, item) => {
      const d = item.date;
      if (!acc[d]) acc[d] = [];
      acc[d].push(item);
      return acc;
    },
    {} as Record<string, CalItem[]>
  );

  const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="rounded-xl border border-border/60 bg-card/50">
      <div className="grid grid-cols-7 border-b border-border/40">
        {DAYS.map((d) => (
          <div key={d} className="p-2 text-center text-[11px] font-semibold text-muted-foreground">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {cells.map((day, idx) => {
          if (!day) return <div key={`empty-${idx}`} className="border-b border-r border-border/30 p-1 min-h-[88px]" />;

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const dayItems = itemsByDate[dateStr] ?? [];
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          return (
            <div
              key={day}
              className={cn(
                "group cursor-pointer border-b border-r border-border/30 p-1 min-h-[88px] hover:bg-white/[0.02] transition-colors",
                isToday && "bg-primary/5"
              )}
              onClick={() => onAdd(dateStr)}
            >
              <div
                className={cn(
                  "mb-1 flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium",
                  isToday ? "bg-primary text-white" : "text-muted-foreground"
                )}
              >
                {day}
              </div>
              <div className="space-y-0.5">
                {dayItems.slice(0, 3).map((item) => {
                  const Icon = TYPE_ICONS[item.type];
                  return (
                    <div
                      key={item.id}
                      className="flex items-center gap-1 rounded px-1 py-0.5"
                      style={{ backgroundColor: `${item.color}22` }}
                    >
                      <Icon className="h-2.5 w-2.5 shrink-0" style={{ color: item.color }} />
                      <span className="truncate text-[10px] font-medium text-foreground">
                        {item.title}
                      </span>
                    </div>
                  );
                })}
                {dayItems.length > 3 && (
                  <div className="px-1 text-[10px] text-muted-foreground">
                    +{dayItems.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

export function CalendarClient() {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [items, setItems] = useState<CalItem[]>(INITIAL_ITEMS);
  const [addDialog, setAddDialog] = useState<{ open: boolean; date?: string }>({ open: false });
  const [view, setView] = useState<"month" | "week" | "agenda" | "kanban">("month");

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  function addItem(item: Omit<CalItem, "id">) {
    setItems(prev => [...prev, { ...item, id: Date.now().toString() }]);
  }

  const stats = useMemo(() => ({
    scheduled: items.filter(i => i.status === "scheduled").length,
    ideas: items.filter(i => i.status === "idea").length,
    published: items.filter(i => i.status === "published").length,
  }), [items]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Content Calendar</h1>
          <p className="text-sm text-muted-foreground">Plan and schedule your content pipeline</p>
        </div>
        <Button
          size="sm"
          className="gap-1.5"
          onClick={() => setAddDialog({ open: true })}
        >
          <Plus className="h-4 w-4" />
          Add content
        </Button>
      </div>

      {/* Quick stats */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Scheduled", value: stats.scheduled, color: "text-violet-400" },
          { label: "Ideas", value: stats.ideas, color: "text-amber-400" },
          { label: "Published", value: stats.published, color: "text-emerald-400" },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-1.5">
            <span className={cn("text-sm font-bold", s.color)}>{s.value}</span>
            <span className="text-xs text-muted-foreground">{s.label}</span>
          </div>
        ))}
      </div>

      <Tabs value={view} onValueChange={(v) => setView(v as typeof view)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList className="h-auto gap-1 bg-card/50 p-1">
            <TabsTrigger value="month" className="text-xs">Month</TabsTrigger>
            <TabsTrigger value="week" className="text-xs">Week</TabsTrigger>
            <TabsTrigger value="agenda" className="text-xs">Agenda</TabsTrigger>
            <TabsTrigger value="kanban" className="text-xs">Kanban</TabsTrigger>
          </TabsList>

          {(view === "month" || view === "week") && (
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={prevMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="min-w-32 text-center text-sm font-semibold">
                {MONTH_NAMES[month]} {year}
              </span>
              <Button variant="outline" size="icon" className="h-7 w-7" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="month" className="mt-4">
          <CalendarMonthView
            year={year}
            month={month}
            items={items}
            onAdd={(date) => setAddDialog({ open: true, date })}
          />
        </TabsContent>

        <TabsContent value="week" className="mt-4">
          <CalendarAgenda items={items} view="week" year={year} month={month} />
        </TabsContent>

        <TabsContent value="agenda" className="mt-4">
          <CalendarAgenda items={items} view="agenda" year={year} month={month} />
        </TabsContent>

        <TabsContent value="kanban" className="mt-4">
          <CalendarKanban items={items} onUpdate={setItems} />
        </TabsContent>
      </Tabs>

      <CalendarAddDialog
        open={addDialog.open}
        defaultDate={addDialog.date}
        onClose={() => setAddDialog({ open: false })}
        onAdd={addItem}
      />
    </div>
  );
}

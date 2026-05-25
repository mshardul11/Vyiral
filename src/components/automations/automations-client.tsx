"use client";

import { useState } from "react";
import {
  Search,
  Users,
  TrendingUp,
  Shield,
  Sparkles,
  Bell,
  Zap,
  Play,
  Pause,
  Clock,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

type AutomationStatus = "active" | "paused" | "running" | "error";

interface Automation {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  status: AutomationStatus;
  trigger: string;
  lastRun?: string;
  nextRun?: string;
  runCount: number;
  category: "research" | "monitoring" | "digest" | "alerts";
}

const INITIAL_AUTOMATIONS: Automation[] = [
  {
    id: "a1",
    name: "Daily keyword scanner",
    description: "Scans trending keywords in your niche every morning at 6am and alerts you to new opportunities.",
    icon: Search,
    color: "#8b5cf6",
    status: "active",
    trigger: "Daily at 6:00 AM",
    lastRun: "Today, 6:02 AM",
    nextRun: "Tomorrow, 6:00 AM",
    runCount: 42,
    category: "research",
  },
  {
    id: "a2",
    name: "Competitor monitor",
    description: "Watches your tracked competitor channels and notifies you when they upload new content.",
    icon: Users,
    color: "#06b6d4",
    status: "active",
    trigger: "Every 4 hours",
    lastRun: "2h ago",
    nextRun: "In 2h",
    runCount: 312,
    category: "monitoring",
  },
  {
    id: "a3",
    name: "Trending topic detector",
    description: "Monitors YouTube trends and Google Trends in your niche to surface viral content opportunities early.",
    icon: TrendingUp,
    color: "#10b981",
    status: "active",
    trigger: "Every 2 hours",
    lastRun: "45m ago",
    nextRun: "In 75m",
    runCount: 628,
    category: "monitoring",
  },
  {
    id: "a4",
    name: "Weekly channel audit",
    description: "Runs an automated channel health check every Sunday night and generates an improvement report.",
    icon: Shield,
    color: "#f59e0b",
    status: "paused",
    trigger: "Sunday at 11:00 PM",
    lastRun: "7d ago",
    nextRun: "Paused",
    runCount: 8,
    category: "digest",
  },
  {
    id: "a5",
    name: "AI recommendations digest",
    description: "Compiles your top 5 AI-powered growth recommendations into a weekly email summary.",
    icon: Sparkles,
    color: "#ec4899",
    status: "active",
    trigger: "Monday at 9:00 AM",
    lastRun: "2d ago",
    nextRun: "In 5d",
    runCount: 12,
    category: "digest",
  },
  {
    id: "a6",
    name: "Performance drop alert",
    description: "Sends an instant notification when any video experiences a significant drop in views or CTR.",
    icon: Bell,
    color: "#ef4444",
    status: "active",
    trigger: "Real-time",
    lastRun: "3d ago",
    nextRun: "Ongoing",
    runCount: 7,
    category: "alerts",
  },
];

const STATUS_CONFIG: Record<AutomationStatus, { label: string; color: string }> = {
  active: { label: "Active", color: "bg-emerald-500/10 text-emerald-400" },
  paused: { label: "Paused", color: "bg-muted/40 text-muted-foreground" },
  running: { label: "Running", color: "bg-blue-500/10 text-blue-400" },
  error: { label: "Error", color: "bg-red-500/10 text-red-400" },
};

const CATEGORY_LABELS = {
  research: "Research",
  monitoring: "Monitoring",
  digest: "Digest",
  alerts: "Alerts",
};

export function AutomationsClient() {
  const [automations, setAutomations] = useState<Automation[]>(INITIAL_AUTOMATIONS);

  function toggleAutomation(id: string) {
    setAutomations((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: a.status === "active" ? "paused" : "active" }
          : a
      )
    );
  }

  const active = automations.filter((a) => a.status === "active").length;
  const totalRuns = automations.reduce((s, a) => s + a.runCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Automations</h1>
          <p className="text-sm text-muted-foreground">
            AI-powered workflow automations for your creator business
          </p>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5" disabled>
          <Zap className="h-3.5 w-3.5" />
          Create custom
          <Badge className="ml-1 bg-primary/15 text-primary text-[10px]">Pro</Badge>
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "Active automations", value: active, Icon: Activity, color: "text-emerald-400" },
          { label: "Total runs", value: totalRuns.toLocaleString(), Icon: Zap, color: "text-violet-400" },
          { label: "Time saved", value: "14h", Icon: Clock, color: "text-cyan-400" },
          { label: "Issues found", value: "23", Icon: CheckCircle2, color: "text-amber-400" },
        ].map((s) => {
          const Icon = s.Icon;
          return (
            <div key={s.label} className="rounded-xl border border-border/60 bg-card/50 p-4">
              <Icon className={cn("h-4 w-4", s.color)} />
              <p className="mt-2 text-xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Automations */}
      <div className="space-y-3">
        {(["research", "monitoring", "digest", "alerts"] as const).map((category) => {
          const catItems = automations.filter((a) => a.category === category);
          if (catItems.length === 0) return null;
          return (
            <div key={category}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/60">
                {CATEGORY_LABELS[category]}
              </p>
              <div className="space-y-2">
                {catItems.map((auto) => {
                  const Icon = auto.icon;
                  const statusCfg = STATUS_CONFIG[auto.status];
                  return (
                    <div
                      key={auto.id}
                      className="flex items-start gap-4 rounded-xl border border-border/60 bg-card/50 p-4 transition-all hover:border-border hover:bg-card/80"
                    >
                      <div
                        className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${auto.color}20` }}
                      >
                        <Icon className="h-4 w-4" style={{ color: auto.color }} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-semibold text-foreground">{auto.name}</p>
                          <Badge className={cn("text-[10px]", statusCfg.color)}>
                            {statusCfg.label}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{auto.description}</p>
                        <div className="mt-2 flex flex-wrap gap-3 text-[11px] text-muted-foreground/60">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {auto.trigger}
                          </span>
                          {auto.lastRun && (
                            <span>Last run: {auto.lastRun}</span>
                          )}
                          {auto.nextRun && (
                            <span>Next: {auto.nextRun}</span>
                          )}
                          <span>{auto.runCount} runs</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Switch
                          checked={auto.status === "active"}
                          onCheckedChange={() => toggleAutomation(auto.id)}
                        />
                        <Button variant="ghost" size="icon" className="h-7 w-7" disabled>
                          {auto.status === "active" ? (
                            <Pause className="h-3.5 w-3.5" />
                          ) : (
                            <Play className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-xl border border-dashed border-border/60 bg-card/20 p-6 text-center">
        <Zap className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
        <p className="font-medium text-foreground">Custom automations</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Create custom triggers and workflows with the Pro plan.
        </p>
        <Button size="sm" className="mt-3 gap-1.5">
          <Sparkles className="h-3.5 w-3.5" />
          Upgrade to Pro
        </Button>
      </div>
    </div>
  );
}

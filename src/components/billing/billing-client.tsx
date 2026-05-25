"use client";

import { CreditCard, Zap, BarChart3, Users, Download, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { cn } from "@/lib/utils";

const CURRENT_PLAN = {
  name: "Free",
  status: "active",
  renewsAt: null,
};

const USAGE = [
  { label: "AI generations", used: 3, limit: 5, unit: "today", icon: Zap, color: "#8b5cf6" },
  { label: "Channel audits", used: 0, limit: 1, unit: "this month", icon: BarChart3, color: "#06b6d4" },
  { label: "Competitors tracked", used: 2, limit: 2, unit: "total", icon: Users, color: "#10b981" },
  { label: "Data exports", used: 0, limit: 0, unit: "not available", icon: Download, color: "#6b7280" },
];

export function BillingClient() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold text-foreground">Billing & Usage</h1>
        <p className="text-sm text-muted-foreground">Manage your plan and track usage</p>
      </div>

      {/* Current plan */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-muted-foreground">Current plan</p>
            <div className="mt-1 flex items-center gap-2">
              <h2 className="text-2xl font-bold text-foreground">{CURRENT_PLAN.name}</h2>
              <Badge className="bg-emerald-500/10 text-emerald-400">Active</Badge>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              You are on the free plan. Upgrade to unlock unlimited AI and advanced features.
            </p>
          </div>
          <Link href="/pricing">
            <Button className="gap-1.5">
              <Zap className="h-4 w-4" />
              Upgrade plan
            </Button>
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border/40 pt-4">
          {[
            { label: "Plan", value: "Free" },
            { label: "Billing", value: "—" },
            { label: "Next renewal", value: "—" },
          ].map((s) => (
            <div key={s.label}>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-sm font-semibold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Usage */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
        <h3 className="mb-4 font-semibold text-foreground">Usage this period</h3>
        <div className="space-y-4">
          {USAGE.map((u) => {
            const Icon = u.icon;
            const percent = u.limit > 0 ? Math.round((u.used / u.limit) * 100) : 0;
            const isLocked = u.limit === 0;
            const isNearLimit = percent >= 80;

            return (
              <div key={u.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4" style={{ color: u.color }} />
                    <span className="text-sm font-medium text-foreground">{u.label}</span>
                  </div>
                  <span className={cn("text-xs font-semibold", isLocked ? "text-muted-foreground" : isNearLimit ? "text-amber-400" : "text-foreground")}>
                    {isLocked ? "Upgrade required" : `${u.used}/${u.limit} ${u.unit}`}
                  </span>
                </div>
                {!isLocked && (
                  <Progress
                    value={percent}
                    className={cn("h-1.5", isNearLimit ? "[&>div]:bg-amber-500" : "[&>div]:bg-primary")}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Pro features teaser */}
      <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-r from-violet-600/5 to-cyan-600/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <Badge className="bg-violet-500/15 text-violet-400">Pro unlocks</Badge>
        </div>
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {[
            "Unlimited AI generations",
            "Advanced analytics",
            "Video intelligence",
            "10 competitor tracking",
            "Trend discovery",
            "Automations",
          ].map((f) => (
            <div key={f} className="flex items-center gap-1.5">
              <Check className="h-3 w-3 shrink-0 text-emerald-400" />
              <span className="text-xs text-muted-foreground">{f}</span>
            </div>
          ))}
        </div>
        <Link href="/pricing">
          <Button size="sm" className="mt-4 gap-1.5">
            View all plans
          </Button>
        </Link>
      </div>

      {/* Payment method placeholder */}
      <div className="rounded-2xl border border-border/60 bg-card/50 p-5">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-foreground">Payment method</h3>
          <Button size="sm" variant="outline" disabled>
            <CreditCard className="mr-1.5 h-3.5 w-3.5" />
            Add card
          </Button>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          No payment method on file. Upgrade to a paid plan to add billing.
        </p>
      </div>
    </div>
  );
}

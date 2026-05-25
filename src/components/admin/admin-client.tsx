"use client";

import { useState } from "react";
import {
  Users,
  DollarSign,
  BarChart3,
  Zap,
  Shield,
  Bell,
  Activity,
  CheckCircle2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const MOCK_USERS = [
  { uid: "u1", email: "alice@creator.io", displayName: "Alice Chen", plan: "pro", status: "active", createdAt: "2024-10-12", aiUsage: 1842 },
  { uid: "u2", email: "bob@youtube.tv", displayName: "Bob Martinez", plan: "business", status: "active", createdAt: "2024-09-03", aiUsage: 4210 },
  { uid: "u3", email: "carol@vidgrowth.co", displayName: "Carol Kim", plan: "free", status: "active", createdAt: "2024-12-01", aiUsage: 28 },
  { uid: "u4", email: "dave@agencytools.io", displayName: "Dave Wilson", plan: "agency", status: "active", createdAt: "2024-08-14", aiUsage: 18400 },
  { uid: "u5", email: "emma@creatorstudio.net", displayName: "Emma Johnson", plan: "pro", status: "trialing", createdAt: "2025-01-05", aiUsage: 312 },
  { uid: "u6", email: "frank@grow.tube", displayName: "Frank Lee", plan: "free", status: "active", createdAt: "2025-01-08", aiUsage: 4 },
];

const PLAN_COLORS: Record<string, string> = {
  free: "bg-muted/40 text-muted-foreground",
  pro: "bg-violet-500/10 text-violet-400",
  business: "bg-blue-500/10 text-blue-400",
  agency: "bg-amber-500/10 text-amber-400",
};

const STATUS_COLORS: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-400",
  trialing: "bg-cyan-500/10 text-cyan-400",
  canceled: "bg-red-500/10 text-red-400",
  past_due: "bg-amber-500/10 text-amber-400",
};

const PLATFORM_STATS = [
  { label: "Total users", value: "2,841", delta: "+124 this week", Icon: Users, color: "text-violet-400" },
  { label: "MRR", value: "$12,480", delta: "+8.4% MoM", Icon: DollarSign, color: "text-emerald-400" },
  { label: "AI requests today", value: "48,210", delta: "Active", Icon: Zap, color: "text-cyan-400" },
  { label: "Avg AI cost/user", value: "$0.04", delta: "gpt-4o-mini", Icon: BarChart3, color: "text-amber-400" },
];

const FEATURE_FLAGS = [
  { id: "ff1", name: "AI chat assistant", description: "Floating AI strategist chat", enabled: true },
  { id: "ff2", name: "Trend discovery", description: "Real-time trend alerts", enabled: true },
  { id: "ff3", name: "Video intelligence", description: "Deep video analytics", enabled: true },
  { id: "ff4", name: "Team workspaces", description: "Multi-user collaboration", enabled: false },
  { id: "ff5", name: "Browser extension API", description: "Extension-ready endpoints", enabled: false },
  { id: "ff6", name: "White-label mode", description: "Agency branding", enabled: false },
];

export function AdminClient() {
  const [userSearch, setUserSearch] = useState("");
  const [flags, setFlags] = useState(FEATURE_FLAGS);

  const filteredUsers = MOCK_USERS.filter(
    (u) =>
      u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.displayName.toLowerCase().includes(userSearch.toLowerCase())
  );

  function toggleFlag(id: string) {
    setFlags((prev) =>
      prev.map((f) => (f.id === id ? { ...f, enabled: !f.enabled } : f))
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Shield className="h-5 w-5 text-amber-400" />
        <div>
          <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
          <p className="text-sm text-muted-foreground">Platform management and monitoring</p>
        </div>
        <Badge className="ml-auto bg-amber-500/10 text-amber-400">Internal only</Badge>
      </div>

      {/* Platform stats */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {PLATFORM_STATS.map((s) => {
          const Icon = s.Icon;
          return (
            <div key={s.label} className="rounded-xl border border-border/60 bg-card/50 p-4">
              <Icon className={cn("h-4 w-4", s.color)} />
              <p className="mt-2 text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-[10px] text-emerald-400">{s.delta}</p>
            </div>
          );
        })}
      </div>

      <Tabs defaultValue="users">
        <TabsList className="h-auto gap-1 bg-card/50 p-1">
          <TabsTrigger value="users" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />
            Users
          </TabsTrigger>
          <TabsTrigger value="ai-costs" className="gap-1.5 text-xs">
            <Zap className="h-3.5 w-3.5" />
            AI Costs
          </TabsTrigger>
          <TabsTrigger value="flags" className="gap-1.5 text-xs">
            <Activity className="h-3.5 w-3.5" />
            Feature Flags
          </TabsTrigger>
          <TabsTrigger value="announcements" className="gap-1.5 text-xs">
            <Bell className="h-3.5 w-3.5" />
            Announcements
          </TabsTrigger>
        </TabsList>

        {/* Users tab */}
        <TabsContent value="users" className="mt-4 space-y-3">
          <Input
            placeholder="Search users by email or name..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="max-w-sm text-sm"
          />
          <div className="rounded-xl border border-border/60 bg-card/50 overflow-hidden">
            <div className="grid grid-cols-12 border-b border-border/60 bg-card/80 px-4 py-2">
              {["User", "Plan", "Status", "AI Usage", "Joined", "Actions"].map((h) => (
                <div key={h} className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide text-muted-foreground",
                  h === "User" ? "col-span-4" :
                  h === "Plan" ? "col-span-2" :
                  h === "Status" ? "col-span-2" :
                  h === "AI Usage" ? "col-span-1" :
                  h === "Joined" ? "col-span-2" : "col-span-1"
                )}>
                  {h}
                </div>
              ))}
            </div>
            {filteredUsers.map((user) => (
              <div
                key={user.uid}
                className="grid grid-cols-12 items-center border-b border-border/40 px-4 py-3 last:border-0 hover:bg-white/[0.02] transition-colors"
              >
                <div className="col-span-4 flex items-center gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-600/30 to-cyan-600/30 text-xs font-bold text-foreground">
                    {user.displayName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{user.displayName}</p>
                    <p className="text-[10px] text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <Badge className={cn("text-[10px] capitalize", PLAN_COLORS[user.plan])}>
                    {user.plan}
                  </Badge>
                </div>
                <div className="col-span-2">
                  <Badge className={cn("text-[10px] capitalize", STATUS_COLORS[user.status])}>
                    {user.status}
                  </Badge>
                </div>
                <div className="col-span-1 text-xs font-mono text-muted-foreground">
                  {user.aiUsage.toLocaleString()}
                </div>
                <div className="col-span-2 text-xs text-muted-foreground">{user.createdAt}</div>
                <div className="col-span-1">
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">View</Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* AI Costs tab */}
        <TabsContent value="ai-costs" className="mt-4 space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            {[
              { label: "AI spend today", value: "$48.21", delta: "+12% vs yesterday" },
              { label: "AI spend this month", value: "$1,284", delta: "Budget: $2,000" },
              { label: "Cost per generation", value: "$0.0009", delta: "gpt-4o-mini avg" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border/60 bg-card/50 p-4">
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="mt-1 text-xl font-bold text-foreground">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.delta}</p>
              </div>
            ))}
          </div>
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <h3 className="mb-3 font-semibold text-foreground">Top AI consumers</h3>
            <div className="space-y-2.5">
              {MOCK_USERS.sort((a, b) => b.aiUsage - a.aiUsage).slice(0, 5).map((u) => (
                <div key={u.uid} className="flex items-center gap-3">
                  <span className="w-28 truncate text-xs text-muted-foreground">{u.displayName}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted/40">
                    <div
                      className="h-full rounded-full bg-violet-500"
                      style={{ width: `${Math.min(100, (u.aiUsage / 20000) * 100)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right text-xs font-mono text-foreground">
                    {u.aiUsage.toLocaleString()} reqs
                  </span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        {/* Feature flags tab */}
        <TabsContent value="flags" className="mt-4 space-y-2">
          {flags.map((flag) => (
            <div
              key={flag.id}
              className="flex items-center gap-4 rounded-xl border border-border/60 bg-card/50 p-4"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">{flag.name}</p>
                  <Badge
                    className={cn(
                      "text-[10px]",
                      flag.enabled
                        ? "bg-emerald-500/10 text-emerald-400"
                        : "bg-muted/40 text-muted-foreground"
                    )}
                  >
                    {flag.enabled ? "Enabled" : "Disabled"}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{flag.description}</p>
              </div>
              <Button
                size="sm"
                variant={flag.enabled ? "destructive" : "default"}
                className="text-xs"
                onClick={() => toggleFlag(flag.id)}
              >
                {flag.enabled ? "Disable" : "Enable"}
              </Button>
            </div>
          ))}
        </TabsContent>

        {/* Announcements tab */}
        <TabsContent value="announcements" className="mt-4">
          <div className="rounded-xl border border-border/60 bg-card/50 p-5">
            <h3 className="mb-3 font-semibold text-foreground">Send platform announcement</h3>
            <div className="space-y-3">
              <Input placeholder="Announcement title..." className="text-sm" />
              <textarea
                className="min-h-20 w-full resize-none rounded-lg border border-border/60 bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Message body..."
              />
              <div className="flex gap-2">
                <Button size="sm" disabled>Send to all users</Button>
                <Button size="sm" variant="outline" disabled>Preview</Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Announcements will appear as in-app notifications for all users.
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-xl border border-border/60 bg-card/50 p-5">
            <h3 className="mb-3 font-semibold text-foreground">Recent announcements</h3>
            <div className="space-y-3">
              {[
                { title: "New trend discovery engine launched", date: "Jan 5, 2025", sent: 2841 },
                { title: "AI chat assistant now available", date: "Dec 28, 2024", sent: 2614 },
                { title: "Holiday hours notice", date: "Dec 20, 2024", sent: 2488 },
              ].map((a) => (
                <div key={a.title} className="flex items-center justify-between rounded-lg border border-border/40 px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-foreground">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.date}</p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {a.sent.toLocaleString()} sent
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

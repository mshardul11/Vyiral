"use client";

import { useState } from "react";
import { Bell, BarChart3, Sparkles, TrendingUp, AlertTriangle, Trophy, Clock, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import Link from "next/link";

type NotifType = "audit" | "ai" | "trend" | "alert" | "milestone" | "reminder";

interface Notification {
  id: string;
  type: NotifType;
  title: string;
  body: string;
  time: string;
  read: boolean;
  href?: string;
}

const ICON_MAP: Record<NotifType, React.ElementType> = {
  audit: BarChart3,
  ai: Sparkles,
  trend: TrendingUp,
  alert: AlertTriangle,
  milestone: Trophy,
  reminder: Clock,
};

const COLOR_MAP: Record<NotifType, string> = {
  audit: "text-violet-400 bg-violet-500/10",
  ai: "text-cyan-400 bg-cyan-500/10",
  trend: "text-emerald-400 bg-emerald-500/10",
  alert: "text-amber-400 bg-amber-500/10",
  milestone: "text-yellow-400 bg-yellow-500/10",
  reminder: "text-blue-400 bg-blue-500/10",
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "trend",
    title: "New trending topic detected",
    body: '"AI productivity tools 2025" is surging +142% — content gap available',
    time: "5m ago",
    read: false,
    href: "/trends",
  },
  {
    id: "2",
    type: "ai",
    title: "AI generation completed",
    body: "10 title suggestions ready for \"YouTube SEO Guide\"",
    time: "22m ago",
    read: false,
    href: "/titles",
  },
  {
    id: "3",
    type: "alert",
    title: "Performance drop detected",
    body: "CTR fell 1.8% this week on your Dec uploads — check thumbnails",
    time: "2h ago",
    read: false,
    href: "/stats",
  },
  {
    id: "4",
    type: "milestone",
    title: "Milestone reached! 🎉",
    body: "Your channel hit 12,500 subscribers. Keep it up!",
    time: "1d ago",
    read: true,
  },
  {
    id: "5",
    type: "audit",
    title: "Channel audit complete",
    body: "Your channel scored 78/100. 3 new recommendations available.",
    time: "2d ago",
    read: true,
    href: "/audit",
  },
  {
    id: "6",
    type: "reminder",
    title: "Upload reminder",
    body: "You haven't posted in 8 days — consistency drives growth",
    time: "3d ago",
    read: true,
    href: "/calendar",
  },
];

export function NotificationsDropdown() {
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read).length;

  function markRead(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white">
              {unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96">
        <DropdownMenuLabel className="flex items-center justify-between py-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold">Notifications</span>
            {unread > 0 && (
              <Badge className="bg-primary/15 text-primary text-[10px]">{unread} new</Badge>
            )}
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors"
            >
              <Check className="h-3 w-3" />
              Mark all read
            </button>
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[340px]">
          {notifications.length === 0 ? (
            <div className="p-6 text-center">
              <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">No notifications yet</p>
            </div>
          ) : (
            <div className="p-1">
              {notifications.map((n) => {
                const Icon = ICON_MAP[n.type];
                const content = (
                  <button
                    key={n.id}
                    onClick={() => markRead(n.id)}
                    className={cn(
                      "flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors hover:bg-white/[0.04]",
                      !n.read && "bg-primary/[0.04]"
                    )}
                  >
                    <div className={cn("mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg", COLOR_MAP[n.type])}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p className={cn("text-sm font-medium", n.read ? "text-foreground/80" : "text-foreground")}>
                          {n.title}
                        </p>
                        {!n.read && (
                          <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                        )}
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.body}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground/60">{n.time}</p>
                    </div>
                  </button>
                );

                if (n.href) {
                  return (
                    <Link key={n.id} href={n.href}>
                      {content}
                    </Link>
                  );
                }
                return <div key={n.id}>{content}</div>;
              })}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

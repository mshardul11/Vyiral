"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const PLACEHOLDER_NOTIFICATIONS = [
  {
    id: "1",
    title: "Keyword opportunity",
    body: 'High opportunity score for "youtube seo tips"',
    time: "2h ago",
  },
  {
    id: "2",
    title: "Connect YouTube",
    body: "Link your channel to unlock live stats and audits",
    time: "1d ago",
  },
];

export function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          Notifications
          <Badge variant="secondary">{PLACEHOLDER_NOTIFICATIONS.length}</Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <ScrollArea className="h-[240px]">
          {PLACEHOLDER_NOTIFICATIONS.map((n) => (
            <DropdownMenuItem
              key={n.id}
              className="flex cursor-default flex-col items-start gap-1 py-3 focus:bg-white/5"
              onSelect={(e) => e.preventDefault()}
            >
              <span className="font-medium">{n.title}</span>
              <span className="text-xs text-muted-foreground">{n.body}</span>
              <span className="text-[10px] text-muted-foreground">{n.time}</span>
            </DropdownMenuItem>
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

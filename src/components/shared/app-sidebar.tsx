"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, moreNav } from "@/lib/constants/navigation";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border/60 bg-card/30 lg:flex">
      <div className="flex h-16 items-center border-b border-border/40 px-4">
        <VyiralLogo />
      </div>

      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1" aria-label="Main menu">
          {mainNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>

        <Separator className="my-4 opacity-40" />

        <p className="mb-2 px-3 text-xs font-medium text-muted-foreground">More</p>
        <nav className="space-y-1" aria-label="More tools">
          {moreNav.map((item) => (
            <NavLink key={item.href} item={item} pathname={pathname} />
          ))}
        </nav>
      </ScrollArea>
    </aside>
  );
}

function NavLink({
  item,
  pathname,
}: {
  item: { title: string; href: string; icon: ComponentType<{ className?: string }> };
  pathname: string;
}) {
  const active =
    pathname === item.href || pathname.startsWith(`${item.href}/`);
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-primary/15 text-primary"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.title}
    </Link>
  );
}

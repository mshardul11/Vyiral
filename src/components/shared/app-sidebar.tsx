"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  analyticsNav,
  mainNav,
  settingsNav,
  workspaceNav,
} from "@/lib/constants/navigation";
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

      <ScrollArea className="flex-1 py-4">
        <div className="space-y-5 px-3">
          <nav className="space-y-1" aria-label="Main tools">
            {mainNav.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>

          <Separator className="opacity-30" />

          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Analytics
            </p>
            <nav className="space-y-1" aria-label="Analytics">
              {analyticsNav.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>
          </div>

          <Separator className="opacity-30" />

          <div>
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
              Workspace
            </p>
            <nav className="space-y-1" aria-label="Workspace tools">
              {workspaceNav.map((item) => (
                <NavLink key={item.href} item={item} pathname={pathname} />
              ))}
            </nav>
          </div>

          <Separator className="opacity-30" />

          <nav className="space-y-1" aria-label="Account">
            {settingsNav.map((item) => (
              <NavLink key={item.href} item={item} pathname={pathname} />
            ))}
          </nav>
        </div>
      </ScrollArea>

      <div className="border-t border-border/40 p-3">
        <div className="rounded-lg bg-gradient-to-r from-violet-600/10 to-cyan-600/10 px-3 py-2.5">
          <p className="text-[11px] font-semibold text-foreground">Free plan</p>
          <p className="text-[10px] text-muted-foreground">
            Upgrade for unlimited AI
          </p>
          <Link
            href="/billing"
            className="mt-1.5 block text-[10px] font-medium text-primary hover:underline"
          >
            Upgrade →
          </Link>
        </div>
      </div>
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
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
        active
          ? "bg-primary/15 text-primary shadow-sm"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {item.title}
    </Link>
  );
}

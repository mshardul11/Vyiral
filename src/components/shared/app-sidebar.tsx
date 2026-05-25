"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { mainNav, navSections } from "@/lib/constants/navigation";
import { useT } from "@/contexts/locale-context";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { WorkspaceSwitcher } from "@/components/shared/workspace-switcher";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function AppSidebar({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  const pathname = usePathname();
  const t = useT();

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "glass-sidebar fixed inset-y-0 left-0 z-30 hidden flex-col transition-all duration-300 lg:flex",
          collapsed ? "w-[72px]" : "w-64"
        )}
      >
        <div
          className={cn(
            "flex h-16 items-center border-b border-border/40 px-4",
            collapsed && "justify-center px-2"
          )}
        >
          <VyiralLogo showText={!collapsed} />
        </div>

        {!collapsed && (
          <div className="p-3">
            <WorkspaceSwitcher />
          </div>
        )}

        <ScrollArea className="flex-1 px-3">
          <nav className="space-y-6 py-2" aria-label="Main">
            {navSections.map((section) => {
              const items = mainNav.filter((i) => i.section === section.id);
              if (!items.length) return null;
              return (
                <div key={section.id}>
                  {!collapsed && (
                    <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {t(`sections.${section.key}`)}
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {items.map((item) => {
                      const active =
                        pathname === item.href ||
                        pathname.startsWith(`${item.href}/`);
                      const Icon = item.icon;
                      const link = (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                            active
                              ? "bg-primary/15 text-primary shadow-sm"
                              : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                            collapsed && "justify-center px-2"
                          )}
                        >
                          <Icon className="h-4 w-4 shrink-0" />
                          {!collapsed && t(`nav.${item.key}`)}
                        </Link>
                      );
                      if (collapsed) {
                        return (
                          <Tooltip key={item.href}>
                            <TooltipTrigger asChild>{link}</TooltipTrigger>
                            <TooltipContent side="right">{t(`nav.${item.key}`)}</TooltipContent>
                          </Tooltip>
                        );
                      }
                      return link;
                    })}
                  </div>
                </div>
              );
            })}
          </nav>
        </ScrollArea>

        {!collapsed && (
          <div className="space-y-3 p-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                {t("common.language")}
              </span>
              <LanguageSwitcher variant="compact" />
            </div>
            <p className="glass-panel rounded-xl border-dashed p-3 text-[11px] leading-relaxed text-muted-foreground">
              {t("disclaimer")}
            </p>
          </div>
        )}

        <Separator className="opacity-40" />
        <div className={cn("flex p-2", collapsed ? "justify-center" : "justify-end")}>
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>
      </aside>
    </TooltipProvider>
  );
}

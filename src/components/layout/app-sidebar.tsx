"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/config/navigation";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { useT } from "@/contexts/locale-context";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export function AppSidebar() {
  const pathname = usePathname();
  const t = useT();

  return (
    <aside className="glass-sidebar hidden lg:flex lg:w-64 lg:flex-col">
      <div className="flex h-16 items-center px-6">
        <VyiralLogo />
      </div>
      <Separator className="opacity-50" />
      <nav className="flex-1 space-y-1 p-4" aria-label="Main">
        {mainNav.map((item) => {
          const active =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {t(`nav.${item.key}`)}
            </Link>
          );
        })}
      </nav>
      <div className="p-4">
        <p className="glass-panel rounded-xl p-3 text-xs leading-relaxed text-muted-foreground">
          {t("disclaimer")}
        </p>
      </div>
    </aside>
  );
}

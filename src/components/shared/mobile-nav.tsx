"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav } from "@/lib/constants/navigation";
import { useT } from "@/contexts/locale-context";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { WorkspaceSwitcher } from "@/components/shared/workspace-switcher";
import { VyiralLogo } from "@/components/layout/vyiral-logo";

export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const t = useT();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[280px] p-0">
        <SheetHeader className="border-b border-border/60 p-4 text-left">
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <VyiralLogo />
        </SheetHeader>
        <div className="space-y-3 p-4">
          <WorkspaceSwitcher />
          <LanguageSwitcher />
        </div>
        <nav className="space-y-1 px-3 pb-6">
          {mainNav.map((item) => {
            const Icon = item.icon;
            const active =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => onOpenChange(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium",
                  active ? "bg-primary/15 text-primary" : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {t(`nav.${item.key}`)}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}

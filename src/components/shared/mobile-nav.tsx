"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { analyticsNav, mainNav, settingsNav, workspaceNav } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const close = () => onOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[260px] p-0">
        <SheetHeader className="border-b border-border/60 p-4 text-left">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <VyiralLogo />
        </SheetHeader>
        <ScrollArea className="h-[calc(100vh-64px)]">
          <div className="space-y-5 px-3 py-4">
            <nav className="space-y-1" aria-label="Main tools">
              {mainNav.map((item) => (
                <MobileLink key={item.href} item={item} pathname={pathname} onClose={close} />
              ))}
            </nav>

            <Separator className="opacity-30" />

            <div>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Analytics</p>
              <nav className="space-y-1">
                {analyticsNav.map((item) => (
                  <MobileLink key={item.href} item={item} pathname={pathname} onClose={close} />
                ))}
              </nav>
            </div>

            <Separator className="opacity-30" />

            <div>
              <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">Workspace</p>
              <nav className="space-y-1">
                {workspaceNav.map((item) => (
                  <MobileLink key={item.href} item={item} pathname={pathname} onClose={close} />
                ))}
              </nav>
            </div>

            <Separator className="opacity-30" />

            <nav className="space-y-1">
              {settingsNav.map((item) => (
                <MobileLink key={item.href} item={item} pathname={pathname} onClose={close} />
              ))}
              <MobileLink
                item={{ title: "Billing", href: "/billing", icon: () => null }}
                pathname={pathname}
                onClose={close}
              />
            </nav>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

function MobileLink({
  item,
  pathname,
  onClose,
}: {
  item: { title: string; href: string; icon: ComponentType<{ className?: string }> };
  pathname: string;
  onClose: () => void;
}) {
  const Icon = item.icon;
  const active =
    pathname === item.href ||
    (item.href !== "/dashboard" && pathname.startsWith(`${item.href}/`));

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
        active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground"
      )}
    >
      {Icon && <Icon className="h-4 w-4" />}
      {item.title}
    </Link>
  );
}

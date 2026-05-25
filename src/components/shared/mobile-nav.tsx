"use client";

import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { mainNav, moreNav } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { Separator } from "@/components/ui/separator";

export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="w-[260px] p-0">
        <SheetHeader className="border-b border-border/60 p-4 text-left">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <VyiralLogo />
        </SheetHeader>
        <nav className="space-y-1 px-3 py-4">
          {mainNav.map((item) => (
            <MobileLink
              key={item.href}
              item={item}
              pathname={pathname}
              onClose={() => onOpenChange(false)}
            />
          ))}
          <Separator className="my-3" />
          <p className="px-3 pb-1 text-xs text-muted-foreground">More</p>
          {moreNav.map((item) => (
            <MobileLink
              key={item.href}
              item={item}
              pathname={pathname}
              onClose={() => onOpenChange(false)}
            />
          ))}
        </nav>
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
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium",
        active ? "bg-primary/15 text-primary" : "text-muted-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      {item.title}
    </Link>
  );
}

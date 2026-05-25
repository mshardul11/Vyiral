"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/shared/user-menu";
import { VyiralLogo } from "@/components/layout/vyiral-logo";

export function AppHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="flex h-14 items-center gap-3 px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="lg:hidden">
          <VyiralLogo showText={false} />
        </div>
        <p className="hidden text-sm font-medium text-muted-foreground lg:block">
          Grow your YouTube channel with simple AI tools
        </p>
        <div className="ml-auto">
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

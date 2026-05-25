"use client";

import { Menu, PanelLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { WorkspaceSwitcher } from "@/components/shared/workspace-switcher";
import { NotificationsDropdown } from "@/components/shared/notifications-dropdown";
import { UserMenu } from "@/components/shared/user-menu";
import { useCommandPalette } from "@/components/shared/command-palette";
import { VyiralLogo } from "@/components/layout/vyiral-logo";

export function AppHeader({
  onMenuClick,
  onSidebarToggle,
}: {
  onMenuClick?: () => void;
  onSidebarToggle?: () => void;
}) {
  const { setOpen } = useCommandPalette();

  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden lg:flex"
          onClick={onSidebarToggle}
          aria-label="Toggle sidebar"
        >
          <PanelLeft className="h-5 w-5" />
        </Button>
        <div className="lg:hidden">
          <VyiralLogo showText={false} />
        </div>
        <div className="hidden md:block">
          <WorkspaceSwitcher compact />
        </div>
        <Button
          variant="outline"
          size="sm"
          className="ml-auto hidden max-w-xs flex-1 justify-start text-muted-foreground sm:flex md:max-w-sm lg:ml-0 lg:max-w-md"
          onClick={() => setOpen(true)}
        >
          <span className="text-sm">Search or jump to...</span>
          <kbd className="pointer-events-none ml-auto hidden h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
        <div className="ml-auto flex items-center gap-1 lg:ml-auto">
          <NotificationsDropdown />
          <UserMenu />
        </div>
      </div>
    </header>
  );
}

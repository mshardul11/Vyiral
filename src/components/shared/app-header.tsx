"use client";

import { Menu, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserMenu } from "@/components/shared/user-menu";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { NotificationsDropdown } from "@/components/shared/notifications-dropdown";
import { CommandPalette } from "@/components/shared/command-palette";
import { useState } from "react";

export function AppHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <>
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

          <button
            onClick={() => setCmdOpen(true)}
            className="hidden items-center gap-2 rounded-lg border border-border/60 bg-card/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-card hover:text-foreground lg:flex"
          >
            <Search className="h-3.5 w-3.5" />
            <span>Search everything...</span>
            <kbd className="ml-4 rounded border border-border/60 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground/60">
              ⌘K
            </kbd>
          </button>

          <div className="ml-auto flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setCmdOpen(true)}
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <NotificationsDropdown />
            <UserMenu />
          </div>
        </div>
      </header>
      <CommandPalette open={cmdOpen} onOpenChange={setCmdOpen} />
    </>
  );
}

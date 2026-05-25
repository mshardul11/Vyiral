"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/app-header";
import { CommandPalette } from "@/components/shared/command-palette";
import { MobileNav } from "@/components/shared/mobile-nav";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AppSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />
      <div
        className={cn(
          "flex min-h-screen flex-col transition-[margin] duration-300",
          sidebarCollapsed ? "lg:ml-[72px]" : "lg:ml-64"
        )}
      >
        <AppHeader
          onMenuClick={() => setMobileOpen(true)}
          onSidebarToggle={() => setSidebarCollapsed((c) => !c)}
        />
        <main className="flex-1 p-4 lg:p-8">
          <div className="animate-fade-in">{children}</div>
        </main>
      </div>
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
      <CommandPalette />
    </>
  );
}

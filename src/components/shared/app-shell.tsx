"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/shared/app-sidebar";
import { AppHeader } from "@/components/shared/app-header";
import { MobileNav } from "@/components/shared/mobile-nav";
import { AiChatAssistant } from "@/components/chat/ai-chat-assistant";

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AppSidebar />
      <div className="flex min-h-screen flex-col lg:ml-56">
        <AppHeader onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
      <AiChatAssistant />
    </>
  );
}

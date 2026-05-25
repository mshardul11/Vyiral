"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import { LocaleProvider } from "@/contexts/locale-context";
import type { LocaleCode } from "@/i18n/config";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { CommandPaletteProvider } from "@/components/shared/command-palette";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({
  children,
  initialLocale,
}: {
  children: ReactNode;
  initialLocale: LocaleCode;
}) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 30_000, retry: 1 },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LocaleProvider initialLocale={initialLocale}>
        <ThemeProvider>
          <TooltipProvider>
            <AuthProvider>
            <WorkspaceProvider>
              <CommandPaletteProvider>
                {children}
                <Toaster />
              </CommandPaletteProvider>
            </WorkspaceProvider>
            </AuthProvider>
          </TooltipProvider>
        </ThemeProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
}

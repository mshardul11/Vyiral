"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import type { FirebasePublicConfig } from "@/lib/auth/client-config";
import { injectFirebaseConfig } from "@/lib/firebase/client";
import { AuthProvider } from "@/contexts/auth-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { WorkspaceProvider } from "@/contexts/workspace-context";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

export function AppProviders({
  children,
  firebaseConfig,
  firebaseConfigured,
}: {
  children: ReactNode;
  firebaseConfig: FirebasePublicConfig;
  firebaseConfigured: boolean;
}) {
  if (firebaseConfigured) {
    injectFirebaseConfig(firebaseConfig);
  }

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
      <ThemeProvider>
        <TooltipProvider>
          <AuthProvider firebaseConfigured={firebaseConfigured}>
            <WorkspaceProvider>
              {children}
              <Toaster />
            </WorkspaceProvider>
          </AuthProvider>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

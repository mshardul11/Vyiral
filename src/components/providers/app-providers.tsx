"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
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
  const configKey = firebaseConfigured
    ? `${firebaseConfig.projectId}:${firebaseConfig.apiKey.slice(0, 8)}`
    : "unconfigured";

  const lastInjectedKey = useRef<string | null>(null);

  // Synchronous inject on first render so AuthProvider effects see config immediately.
  if (firebaseConfigured && lastInjectedKey.current !== configKey) {
    injectFirebaseConfig(firebaseConfig);
    lastInjectedKey.current = configKey;
  }

  // Re-inject if props change (e.g. HMR / env update) before children run effects.
  useLayoutEffect(() => {
    if (!firebaseConfigured) {
      lastInjectedKey.current = null;
      return;
    }
    injectFirebaseConfig(firebaseConfig);
    lastInjectedKey.current = configKey;
  }, [firebaseConfigured, configKey, firebaseConfig]);

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

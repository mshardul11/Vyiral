"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[App Error]", error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10">
        <AlertTriangle className="h-6 w-6 text-red-400" />
      </div>
      <div>
        <h2 className="text-lg font-bold text-foreground">Something went wrong</h2>
        <p className="mt-1 text-sm text-muted-foreground max-w-sm">
          This page encountered an unexpected error.
          {error.digest && ` (ID: ${error.digest})`}
        </p>
      </div>
      <div className="flex gap-2">
        <Button onClick={reset} size="sm" variant="outline" className="gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" />
          Try again
        </Button>
        <Link href="/dashboard">
          <Button size="sm" className="gap-1.5">
            <Home className="h-3.5 w-3.5" />
            Go home
          </Button>
        </Link>
      </div>
    </div>
  );
}

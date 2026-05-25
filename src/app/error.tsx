"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Vyiral] App error boundary", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-medium text-destructive">Something went wrong</p>
      <h1 className="mt-2 text-2xl font-bold tracking-tight">We hit an error</h1>
      <p className="mt-3 max-w-md text-sm text-muted-foreground">
        Try again. If the problem continues, sign out and back in, or contact
        support.
      </p>
      {error.digest && (
        <p className="mt-2 font-mono text-xs text-muted-foreground">
          Reference: {error.digest}
        </p>
      )}
      <div className="mt-8 flex gap-3">
        <Button variant="gradient" onClick={() => reset()}>
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

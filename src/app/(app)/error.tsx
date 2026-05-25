"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function AppSegmentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Vyiral] Workspace error boundary", error);
  }, [error]);

  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 text-center">
      <h2 className="text-xl font-semibold">Could not load this page</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">
        A temporary error occurred in your workspace.
      </p>
      <Button className="mt-6" variant="gradient" onClick={() => reset()}>
        Try again
      </Button>
    </div>
  );
}

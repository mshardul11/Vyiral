"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Vyiral] Global error boundary", error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#0a0a12] font-sans text-white antialiased">
        <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
          <h1 className="text-2xl font-bold">Vyiral encountered a critical error</h1>
          <p className="mt-3 max-w-md text-sm text-white/70">
            Please refresh the page. If this keeps happening, try again later.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-medium hover:bg-violet-500"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}

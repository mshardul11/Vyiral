"use client";

import { cn } from "@/lib/utils";

export function ToolToolbar({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
  /** @deprecated Hidden for a simpler UI */
  dataSource?: "ai" | "mock";
}) {
  if (!children) return null;

  return (
    <div
      className={cn(
        "mb-4 flex flex-wrap items-center gap-2",
        className
      )}
    >
      {children}
    </div>
  );
}

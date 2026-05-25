"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";

export function ToolPageHeader({
  title,
  description,
  actions,
  badge,
}: {
  title: string;
  description: string;
  actions?: ReactNode;
  badge?: string;
}) {
  return (
    <div className="sticky top-0 z-10 -mx-4 mb-6 border-b border-white/10 bg-background/80 px-4 py-4 backdrop-blur-xl lg:-mx-6 lg:px-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
            {badge && <Badge variant="muted">{badge}</Badge>}
          </div>
          <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{description}</p>
        </div>
        {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

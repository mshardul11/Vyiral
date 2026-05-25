"use client";

import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const DATE_RANGES = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
  { label: "1y", days: 365 },
] as const;

export function AnalyticsDateFilter({
  selected,
  onChange,
  onExport,
}: {
  selected: number;
  onChange: (days: number) => void;
  onExport?: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex rounded-lg border border-border/60 bg-card/50 p-0.5">
        {DATE_RANGES.map((r) => (
          <button
            key={r.days}
            onClick={() => onChange(r.days)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-medium transition-all",
              selected === r.days
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {r.label}
          </button>
        ))}
      </div>
      {onExport && (
        <Button size="sm" variant="outline" onClick={onExport} className="gap-1.5 text-xs">
          <Download className="h-3.5 w-3.5" />
          Export
        </Button>
      )}
    </div>
  );
}

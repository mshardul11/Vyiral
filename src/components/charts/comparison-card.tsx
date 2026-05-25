import { cn } from "@/lib/utils";
import { GrowthIndicator } from "@/components/charts/growth-indicator";

export function ComparisonCard({
  label,
  current,
  previous,
  delta,
  className,
}: {
  label: string;
  current: string;
  previous: string;
  delta: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/40 p-4 transition-colors hover:bg-card/60",
        className
      )}
    >
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-2 text-lg font-bold">{current}</p>
      <p className="text-xs text-muted-foreground">vs {previous}</p>
      <div className="mt-2">
        <GrowthIndicator value={delta} />
      </div>
    </div>
  );
}

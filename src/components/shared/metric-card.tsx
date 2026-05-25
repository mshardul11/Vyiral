import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { GrowthIndicator } from "@/components/charts/growth-indicator";
import type { LucideIcon } from "lucide-react";

export function MetricCard({
  title,
  value,
  delta,
  icon: Icon,
  loading,
  variant = "default",
  estimated,
}: {
  title: string;
  value: string;
  delta?: string;
  icon?: LucideIcon;
  loading?: boolean;
  variant?: "default" | "gradient";
  estimated?: boolean;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:scale-[1.01]",
        variant === "gradient"
          ? "border-primary/20 bg-gradient-to-br from-primary/20 via-card to-card vyiral-glow"
          : "border-border/60 bg-card/50 backdrop-blur-sm hover:border-primary/30"
      )}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {Icon && (
          <div className="rounded-lg bg-primary/10 p-2">
            <Icon className="h-4 w-4 text-primary" />
          </div>
        )}
      </div>
      <div className="mt-3">
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <p className="text-2xl font-bold tracking-tight">{value}</p>
        )}
      </div>
      {delta && !loading && (
        <div className="mt-2 flex items-center gap-2">
          <GrowthIndicator value={delta} />
          {estimated && <Badge variant="muted">Est.</Badge>}
        </div>
      )}
    </div>
  );
}

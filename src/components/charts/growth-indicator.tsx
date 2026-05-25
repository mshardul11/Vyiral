import { TrendingDown, TrendingUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

export function GrowthIndicator({ value }: { value: string }) {
  const isUp = value.includes("+") || value.toLowerCase().includes("up");
  const isDown = value.includes("-") && !value.includes("+-");
  const Icon = isUp ? TrendingUp : isDown ? TrendingDown : Minus;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs font-medium",
        isUp && "text-emerald-400",
        isDown && "text-red-400",
        !isUp && !isDown && "text-muted-foreground"
      )}
    >
      <Icon className="h-3 w-3" />
      {value}
    </span>
  );
}

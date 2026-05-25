import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function ScoreBadge({
  score,
  label,
  className,
}: {
  score: number;
  label?: string;
  className?: string;
}) {
  const variant =
    score >= 80 ? "success" : score >= 60 ? "default" : score >= 40 ? "warning" : "muted";

  return (
    <Badge variant={variant} className={cn("tabular-nums", className)}>
      {label ? `${label}: ` : ""}
      {score}
    </Badge>
  );
}

export function ScoreRing({ score, size = 64 }: { score: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--muted))"
          strokeWidth={6}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="hsl(var(--primary))"
          strokeWidth={6}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <span className="absolute text-lg font-bold">{score}</span>
    </div>
  );
}

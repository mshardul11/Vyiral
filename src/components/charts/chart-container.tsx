import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function ChartContainer({
  title,
  description,
  children,
  loading,
  className,
  action,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  loading?: boolean;
  className?: string;
  action?: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border/60 bg-card/50 p-6 backdrop-blur-sm",
        className
      )}
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <h3 className="font-semibold">{title}</h3>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
        {action}
      </div>
      {loading ? (
        <Skeleton className="h-[220px] w-full rounded-xl" />
      ) : (
        <div className="h-[220px] w-full">{children}</div>
      )}
    </div>
  );
}

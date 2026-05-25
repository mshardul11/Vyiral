import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="space-y-2">
        <Skeleton className="h-9 w-56" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
      <Skeleton className="h-24 rounded-xl" />
    </div>
  );
}

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function FilterBar({
  searchPlaceholder = "Search...",
  children,
  className,
  onSearchChange,
}: {
  searchPlaceholder?: string;
  children?: React.ReactNode;
  className?: string;
  onSearchChange?: (value: string) => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-border/60 bg-card/40 p-4 backdrop-blur-sm sm:flex-row sm:items-center",
        className
      )}
    >
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          className="pl-9 bg-background/50"
          onChange={(e) => onSearchChange?.(e.target.value)}
        />
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

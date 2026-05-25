import { cn } from "@/lib/utils";

export function GlassCard({
  children,
  className,
  hover = false,
}: {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-white/10 bg-card/60 p-6 shadow-xl backdrop-blur-xl",
        hover && "transition-all duration-300 hover:border-primary/30 hover:shadow-[var(--vyiral-shadow-glow)]",
        className
      )}
    >
      {children}
    </div>
  );
}

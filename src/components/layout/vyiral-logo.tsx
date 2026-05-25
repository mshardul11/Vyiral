import Link from "next/link";
import { cn } from "@/lib/utils";

export function VyiralLogo({
  className,
  showText = true,
  href = "/",
}: {
  className?: string;
  showText?: boolean;
  /** Where the logo navigates — use /dashboard when the user is signed in */
  href?: string;
}) {
  return (
    <Link href={href} className={cn("flex items-center gap-2", className)}>
      <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/20 bg-vyiral-gradient font-display text-sm font-bold text-white shadow-glass-glow">
        V
      </span>
      {showText && (
        <span className="font-display text-xl font-bold tracking-tight">
          Vy<span className="vyiral-text-gradient">iral</span>
        </span>
      )}
    </Link>
  );
}

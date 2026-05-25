"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, Search } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { quickActions } from "@/config/navigation";
import { VyiralLogo } from "@/components/layout/vyiral-logo";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { mainNav } from "@/config/navigation";

export function AppHeader() {
  const { user, signOut } = useAuth();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const initials =
    user?.displayName?.slice(0, 2).toUpperCase() ??
    user?.email?.slice(0, 2).toUpperCase() ??
    "VY";

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-4 px-4 lg:px-6">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="lg:hidden">
          <VyiralLogo showText={false} />
        </div>
        <div className="relative hidden max-w-md flex-1 md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search keywords, titles, channels..."
            className="pl-9 bg-background/50"
            aria-label="Global search"
          />
        </div>
        <div className="ml-auto flex items-center gap-2">
          {quickActions.map((action) => (
            <Button
              key={action.href}
              variant="ghost"
              size="sm"
              className="hidden xl:inline-flex"
              asChild
            >
              <Link href={action.href}>{action.label}</Link>
            </Button>
          ))}
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={user?.photoURL ?? undefined} alt="" />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" onClick={() => signOut()} aria-label="Sign out">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {mobileOpen && (
        <nav
          className="border-t border-border/60 bg-card/95 p-4 lg:hidden animate-fade-in"
          aria-label="Mobile"
        >
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {item.title}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}

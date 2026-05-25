"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { homeToolCards, moreNav } from "@/lib/constants/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function DashboardView() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(" ")[0] ?? "Creator";

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          Hi {firstName} 👋
        </h1>
        <p className="mt-2 text-muted-foreground">
          Pick a tool below. Type your topic, get results, copy what you need.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {homeToolCards.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.href} href={tool.href} className="group block">
              <Card
                className={cn(
                  "h-full border-border/60 transition-all hover:border-primary/40 hover:shadow-md",
                  `bg-gradient-to-br ${tool.color}`
                )}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Icon className="h-5 w-5 text-primary" />
                    <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  <CardTitle className="text-lg">{tool.title}</CardTitle>
                  <CardDescription>{tool.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="border-border/60 bg-card/40">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Also available</CardTitle>
          <CardDescription>When you want to go deeper</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {moreNav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex items-center gap-2 rounded-lg border border-border/60 bg-background/50 px-4 py-2 text-sm font-medium hover:bg-white/5"
            >
              <item.icon className="h-4 w-4 text-primary" />
              {item.title}
            </Link>
          ))}
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        Connect YouTube in Settings later for live stats — tools work right away.
      </p>
    </div>
  );
}

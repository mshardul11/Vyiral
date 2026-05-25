"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Search,
  Shield,
  Sparkles,
  Youtube,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { quickActions } from "@/config/navigation";

export default function DashboardPage() {
  const { userDoc, loading } = useAuth();
  const isNew = !loading && userDoc?.onboardingCompleted;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Your creator command center — connect YouTube to unlock live stats.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <SummaryCard
          title="Channel"
          value="Not connected"
          hint="Connect in Settings"
          icon={Youtube}
          loading={loading}
        />
        <SummaryCard
          title="Subscribers"
          value="—"
          hint="Unavailable until channel connect"
          icon={BarChart3}
          loading={loading}
        />
        <SummaryCard
          title="Audit score"
          value="—"
          hint="Run your first audit"
          icon={Shield}
          loading={loading}
        />
      </div>

      {isNew && (
        <Card className="border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle>Next best actions</CardTitle>
            <CardDescription>
              Start with keyword research, then generate titles for your top opportunity.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <Button key={action.href} variant="secondary" asChild>
                <Link href={action.href}>
                  <action.icon className="h-4 w-4" />
                  {action.label}
                </Link>
              </Button>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Your workspace timeline</CardDescription>
          </CardHeader>
          <CardContent>
            <EmptyFeed message="No activity yet. Research a keyword or run an audit to get started." />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Quick research</CardTitle>
              <CardDescription>Jump into growth tools</CardDescription>
            </div>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/keywords">
                Open <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3">
            <ToolLink href="/keywords" icon={Search} label="Keyword research" />
            <ToolLink href="/titles" icon={Sparkles} label="AI title generator" />
            <ToolLink href="/audit" icon={Shield} label="Channel audit" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function SummaryCard({
  title,
  value,
  hint,
  icon: Icon,
  loading,
}: {
  title: string;
  value: string;
  hint: string;
  icon: React.ComponentType<{ className?: string }>;
  loading: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-24" />
        ) : (
          <>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-muted-foreground mt-1">{hint}</p>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function EmptyFeed({ message }: { message: string }) {
  return (
    <p className="rounded-lg border border-dashed border-border/80 p-6 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

function ToolLink({
  href,
  icon: Icon,
  label,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-lg border border-border/60 px-4 py-3 transition-colors hover:bg-white/5"
    >
      <Icon className="h-5 w-5 text-primary" />
      <span className="font-medium">{label}</span>
      <ArrowRight className="ml-auto h-4 w-4 text-muted-foreground" />
    </Link>
  );
}

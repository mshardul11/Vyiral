"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  Eye,
  MessageSquare,
  Search,
  Shield,
  Sparkles,
  Upload,
  Users,
  Youtube,
} from "lucide-react";
import { MetricCard } from "@/components/shared/metric-card";
import { SectionHeader } from "@/components/shared/section-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ChartContainer } from "@/components/charts/chart-container";
import { VyiralLineChart } from "@/components/charts/line-chart";
import { VyiralBarChart } from "@/components/charts/bar-chart";
import { ComparisonCard } from "@/components/charts/comparison-card";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { quickActions } from "@/lib/constants/navigation";
import type { DashboardData } from "@/server/actions/dashboard";
import { RecommendationsPanel } from "@/components/dashboard/recommendations-panel";

export function DashboardView({ data }: { data: DashboardData }) {
  const estimated = data.metrics.dataQuality === "estimated";

  return (
    <div className="space-y-8 animate-fade-in">
      <SectionHeader
        title="Dashboard"
        description="Your creator command center — metrics, opportunities, and AI suggestions."
        action={
          <Button variant="outline" size="sm" asChild>
            <Link href="/settings">Connect YouTube</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        <MetricCard
          title="Subscribers"
          value={data.metrics.subscribers.value}
          delta={data.metrics.subscribers.delta}
          icon={Users}
          variant="gradient"
          estimated={estimated && !data.metrics.subscribers.connected}
        />
        <MetricCard
          title="Views"
          value={data.metrics.views.value}
          delta={data.metrics.views.delta}
          icon={Eye}
          estimated={estimated && !data.metrics.views.connected}
        />
        <MetricCard
          title="Uploads"
          value={data.metrics.uploads.value}
          delta={data.metrics.uploads.delta}
          icon={Upload}
        />
        <MetricCard
          title="Engagement"
          value={data.metrics.engagement.value}
          delta={data.metrics.engagement.delta}
          icon={MessageSquare}
          estimated={estimated && !data.metrics.engagement.connected}
        />
        <MetricCard
          title="Audit score"
          value={data.metrics.auditScore.value}
          delta={data.metrics.auditScore.delta}
          icon={Shield}
        />
        <MetricCard
          title="Growth"
          value={data.metrics.growthTrend.value}
          delta={data.metrics.growthTrend.delta}
          icon={BarChart3}
          estimated
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <ComparisonCard
          label="Views (7d)"
          current={data.metrics.views.value}
          previous="1.1M"
          delta={data.metrics.views.delta}
        />
        <ComparisonCard
          label="Subs (7d)"
          current={data.metrics.subscribers.value}
          previous="11.8K"
          delta={data.metrics.subscribers.delta}
        />
        <ComparisonCard
          label="Engagement"
          current={data.metrics.engagement.value}
          previous="3.9%"
          delta={data.metrics.engagement.delta}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChartContainer
          title="Growth trend"
          description="Subscriber and view trajectory (Est. until channel connected)"
          className="lg:col-span-2"
        >
          <VyiralLineChart
            data={[...data.growthSeries]}
            xKey="date"
            lines={[
              { key: "subscribers", color: "#8b5cf6", name: "Subscribers" },
              { key: "views", color: "#22d3ee", name: "Views" },
            ]}
          />
        </ChartContainer>

        <ChartContainer title="Weekly views" description="Bar breakdown by day">
          <VyiralBarChart
            data={[...data.growthSeries]}
            xKey="date"
            dataKey="views"
            color="#8b5cf6"
          />
        </ChartContainer>
      </div>

      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <ActivityFeed items={data.recentActivity} />
        <KeywordOpportunities keywords={data.keywordOpportunities} />
        <AiSuggestions suggestions={data.aiSuggestions} />
        <RecommendationsPanel />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <TopVideos videos={data.topVideos} />
        <CompetitorAlerts competitors={data.competitorAlerts} />
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
          <CardDescription>Jump into your growth workflow</CardDescription>
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
    </div>
  );
}

function ActivityFeed({
  items,
}: {
  items: DashboardData["recentActivity"];
}) {
  return (
    <Card className="rounded-2xl border-border/60 bg-card/50">
      <CardHeader>
        <CardTitle className="text-base">Recent activity</CardTitle>
        <CardDescription>Workspace timeline</CardDescription>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <EmptyState
            title="No activity yet"
            description="Research keywords or run an audit to populate your feed."
            action={{ label: "Research keywords", href: "/keywords" }}
          />
        ) : (
          <ul className="space-y-3">
            {items.map((item) => (
              <li
                key={item.id}
                className="flex gap-3 rounded-xl border border-border/40 px-3 py-2.5 text-sm transition-colors hover:bg-white/5"
              >
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div>
                  <p className="font-medium">{item.message}</p>
                  <p className="text-xs text-muted-foreground">{item.type}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function KeywordOpportunities({
  keywords,
}: {
  keywords: DashboardData["keywordOpportunities"];
}) {
  return (
    <Card className="rounded-2xl border-border/60 bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">Keyword opportunities</CardTitle>
          <CardDescription>Top scores · Est.</CardDescription>
        </div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/keywords">
            <Search className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {keywords.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No keywords saved yet. Start research to see opportunities.
          </p>
        ) : (
          <ul className="space-y-2">
            {keywords.map((kw) => (
              <li
                key={kw.id}
                className="flex items-center justify-between rounded-xl border border-border/40 px-3 py-2"
              >
                <span className="font-medium text-sm">{kw.keyword}</span>
                <Badge>{kw.opportunityScore}</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

function AiSuggestions({ suggestions }: { suggestions: string[] }) {
  return (
    <Card className="rounded-2xl border-border/60 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          AI suggestions
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="rounded-xl bg-primary/5 px-3 py-2 text-sm text-muted-foreground"
            >
              {s}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function TopVideos({
  videos,
}: {
  videos: DashboardData["topVideos"];
}) {
  return (
    <Card className="rounded-2xl border-border/60 bg-card/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Youtube className="h-4 w-4 text-primary" />
          Top videos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {videos.map((v) => (
            <li
              key={v.id}
              className="flex items-center justify-between rounded-xl border border-border/40 px-3 py-2 text-sm"
            >
              <span className="truncate font-medium">{v.title}</span>
              <span className="text-muted-foreground">{v.views}</span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

function CompetitorAlerts({
  competitors,
}: {
  competitors: DashboardData["competitorAlerts"];
}) {
  return (
    <Card className="rounded-2xl border-border/60 bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Competitor alerts</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/competitors">
            View <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        {competitors.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Add competitors to track channel movements.
          </p>
        ) : (
          <ul className="space-y-2">
            {competitors.map((c) => (
              <li
                key={c.id}
                className="flex items-center gap-3 rounded-xl border border-border/40 px-3 py-2 text-sm"
              >
                <span className="font-medium">{c.channelTitle}</span>
                <Badge variant="warning">Alert on</Badge>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

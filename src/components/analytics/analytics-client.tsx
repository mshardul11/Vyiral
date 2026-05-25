"use client";

import { useState, useMemo } from "react";
import { AnalyticsOverviewCards } from "./analytics-overview-cards";
import { AnalyticsTrendChart } from "./analytics-trend-chart";
import { TrafficSourcesChart } from "./traffic-sources-chart";
import { TopVideosTable } from "./top-videos-table";
import { AudienceAnalytics } from "./audience-analytics";
import { AnalyticsDateFilter } from "./analytics-date-filter";
import {
  getAnalyticsSeries,
  TRAFFIC_SOURCES,
  TOP_VIDEOS,
  WORST_VIDEOS,
  AUDIENCE_DEMOGRAPHICS,
  OVERVIEW_METRICS,
} from "@/lib/constants/analytics-mock";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Users, Film, Zap } from "lucide-react";
import { GrowthAnomalyCard } from "./growth-anomaly-card";
import { ShortsAnalytics } from "./shorts-analytics";

export function AnalyticsClient() {
  const [days, setDays] = useState(30);

  const series = useMemo(() => getAnalyticsSeries(days), [days]);

  function handleExport() {
    const rows = [
      ["Date", "Views", "Subscribers", "Watch Time", "CTR", "Engagement"],
      ...series.views.map((d, i) => [
        d.date,
        d.value,
        series.subscribers[i]?.value ?? "",
        series.watchTime[i]?.value ?? "",
        series.ctr[i]?.value ?? "",
        series.engagement[i]?.value ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `vyiral-analytics-${days}d.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-foreground">Analytics</h1>
          <p className="text-sm text-muted-foreground">
            Channel performance insights
            <Badge variant="outline" className="ml-2 border-amber-500/40 text-amber-400 text-[10px]">
              Demo data
            </Badge>
          </p>
        </div>
        <AnalyticsDateFilter selected={days} onChange={setDays} onExport={handleExport} />
      </div>

      {/* Overview cards */}
      <AnalyticsOverviewCards metrics={OVERVIEW_METRICS} />

      {/* Main tabs */}
      <Tabs defaultValue="overview">
        <TabsList className="h-auto gap-1 bg-card/50 p-1">
          <TabsTrigger value="overview" className="gap-1.5 text-xs">
            <BarChart3 className="h-3.5 w-3.5" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="content" className="gap-1.5 text-xs">
            <Film className="h-3.5 w-3.5" />
            Content
          </TabsTrigger>
          <TabsTrigger value="audience" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" />
            Audience
          </TabsTrigger>
          <TabsTrigger value="shorts" className="gap-1.5 text-xs">
            <Zap className="h-3.5 w-3.5" />
            Shorts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-4 space-y-4">
          <AnalyticsTrendChart data={series} />
          <div className="grid gap-4 lg:grid-cols-2">
            <TrafficSourcesChart sources={TRAFFIC_SOURCES} />
            <GrowthAnomalyCard days={days} />
          </div>
        </TabsContent>

        <TabsContent value="content" className="mt-4 space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <TopVideosTable videos={TOP_VIDEOS} type="top" />
            <TopVideosTable videos={WORST_VIDEOS} type="worst" />
          </div>
        </TabsContent>

        <TabsContent value="audience" className="mt-4">
          <AudienceAnalytics data={AUDIENCE_DEMOGRAPHICS} />
        </TabsContent>

        <TabsContent value="shorts" className="mt-4">
          <ShortsAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}

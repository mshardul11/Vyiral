"use client";

import { useCallback, useEffect, useState } from "react";
import { Bell, Plus, Trash2, TrendingUp } from "lucide-react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ExportMenu } from "@/components/tools/export-menu";
import { VyiralBarChart } from "@/components/charts/bar-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import {
  addCompetitor,
  getCompetitorIntelligence,
  removeCompetitor,
} from "@/server/actions/competitors";
import type { CompetitorIntelligenceResult } from "@/types/intelligence";

export function CompetitorIntelClient() {
  const { toast } = useToast();
  const [intel, setIntel] = useState<CompetitorIntelligenceResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [channelId, setChannelId] = useState("");
  const [channelTitle, setChannelTitle] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await getCompetitorIntelligence();
    if (res.success && res.data) setIntel(res.data);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const add = async () => {
    if (!channelId.trim() || !channelTitle.trim()) return;
    const res = await addCompetitor({
      channelId: channelId.trim(),
      channelTitle: channelTitle.trim(),
    });
    if (res.success) {
      setChannelId("");
      setChannelTitle("");
      toast({ title: "Competitor added" });
      void load();
    } else {
      toast({ title: "Failed", description: res.error, variant: "destructive" });
    }
  };

  const remove = async (id: string) => {
    const res = await removeCompetitor(id);
    if (res.success) void load();
  };

  return (
    <div className="pb-8">
      <ToolPageHeader
        title="Competitor intelligence"
        description="Track channels, growth trends, keyword overlap, and content gaps."
        actions={
          intel && (
            <ExportMenu
              csvRows={intel.competitors.map((c) => ({
                channel: c.channelTitle,
                momentum: c.momentumScore,
                keywordOverlap: c.keywordOverlap,
                uploads: c.uploadFrequency,
              }))}
            />
          )
        }
      />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <Input
            className="glass-input"
            placeholder="Channel ID"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          />
          <Input
            className="glass-input flex-1"
            placeholder="Channel name"
            value={channelTitle}
            onChange={(e) => setChannelTitle(e.target.value)}
          />
          <Button variant="gradient" onClick={() => void add()}>
            <Plus className="mr-2 h-4 w-4" /> Add
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <Skeleton className="h-80 rounded-2xl" />
      ) : !intel ? null : (
        <>
          <div className="mb-6 overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left text-muted-foreground">
                  <th className="p-3">Channel</th>
                  <th className="p-3">Momentum</th>
                  <th className="p-3">Keyword overlap</th>
                  <th className="p-3">Topic overlap</th>
                  <th className="p-3">Cadence</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {intel.competitors.map((c) => (
                  <tr key={c.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                    <td className="p-3 font-medium">{c.channelTitle}</td>
                    <td className="p-3">
                      <span className="flex items-center gap-1 text-primary">
                        <TrendingUp className="h-3 w-3" />
                        {c.momentumScore}
                      </span>
                    </td>
                    <td className="p-3">{c.keywordOverlap}%</td>
                    <td className="p-3">{c.topicOverlap}%</td>
                    <td className="p-3">{c.uploadFrequency}</td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {c.alertEnabled && (
                          <Badge variant="muted" className="gap-1">
                            <Bell className="h-3 w-3" /> Alerts
                          </Badge>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => void remove(c.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-6 grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Growth comparison</CardTitle>
              </CardHeader>
              <CardContent className="h-56 w-full">
                <VyiralBarChart
                  data={intel.growthComparison}
                  xKey="name"
                  dataKey="growth"
                />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Trending topics</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {intel.trendingTopics.map((t) => (
                  <Badge key={t} variant="secondary">
                    {t}
                  </Badge>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-base">Top performing content</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                {intel.topContent.map((item) => (
                  <li
                    key={item.title}
                    className="flex justify-between gap-4 rounded-lg border border-white/10 p-3"
                  >
                    <span className="font-medium">{item.title}</span>
                    <span className="shrink-0 text-muted-foreground">
                      {item.channel} · {item.views} views
                    </span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Opportunity gaps</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-inside list-disc text-sm text-muted-foreground">
                {intel.opportunityGaps.map((g) => (
                  <li key={g}>{g}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

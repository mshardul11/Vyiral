"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Play, Sparkles } from "lucide-react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ScoreRing } from "@/components/tools/score-ring";
import { VyiralRadarChart } from "@/components/charts/radar-chart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/contexts/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { getLatestAudit, runAudit } from "@/server/actions/audit";
import type { ChannelAuditResult } from "@/types/intelligence";
import { cn } from "@/lib/utils";

const severityColor = {
  low: "text-emerald-400 border-emerald-500/30",
  medium: "text-amber-400 border-amber-500/30",
  high: "text-red-400 border-red-500/30",
};

export function ChannelAuditClient() {
  const { activeProject } = useWorkspace();
  const { toast } = useToast();
  const [channelId, setChannelId] = useState("");
  const [channelTitle, setChannelTitle] = useState("");
  const [audit, setAudit] = useState<ChannelAuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      const res = await getLatestAudit();
      if (res.success && res.data) setAudit(res.data);
      setLoading(false);
    })();
  }, []);

  const run = async () => {
    if (!channelId.trim() || !channelTitle.trim()) {
      toast({ title: "Enter channel ID and title", variant: "destructive" });
      return;
    }
    setRunning(true);
    const res = await runAudit({
      channelId: channelId.trim(),
      channelTitle: channelTitle.trim(),
      projectId: activeProject?.id,
    });
    setRunning(false);
    if (res.success && res.data) {
      setAudit(res.data);
      toast({ title: "Audit complete" });
    } else {
      toast({ title: "Audit failed", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div className="pb-8">
      <ToolPageHeader
        title="Channel audit"
        description="Analyze thumbnails, titles, SEO, cadence, and branding — scores are estimates."
        badge="AI + heuristics"
      />

      <Card className="mb-6">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
          <Input
            className="glass-input"
            placeholder="Channel ID or @handle"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value)}
          />
          <Input
            className="glass-input"
            placeholder="Channel display name"
            value={channelTitle}
            onChange={(e) => setChannelTitle(e.target.value)}
          />
          <Button variant="gradient" onClick={() => void run()} disabled={running}>
            <Sparkles className="mr-2 h-4 w-4" />
            {running ? "Auditing…" : "Run audit"}
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : !audit ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            Run an audit on a connected or public channel.
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-6 grid gap-4 lg:grid-cols-3">
            <Card className="flex flex-col items-center justify-center p-6 lg:col-span-1">
              <ScoreRing score={audit.overallScore} size={120} label="Channel health" />
              <p className="mt-2 text-sm text-muted-foreground">{audit.channelTitle}</p>
            </Card>
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Performance radar</CardTitle>
              </CardHeader>
              <CardContent className="h-64 w-full">
                <VyiralRadarChart data={audit.radarData} />
              </CardContent>
            </Card>
          </div>

          <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {audit.subScores.map((s) => (
              <Card key={s.name}>
                <CardContent className="flex items-center gap-4 p-4">
                  <ScoreRing score={s.score} size={64} />
                  <div>
                    <p className="font-medium">{s.name}</p>
                    <p className="text-xs text-muted-foreground">{s.summary}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {audit.issues.length > 0 && (
            <div className="mb-6">
              <h2 className="mb-3 text-sm font-semibold">Issues</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {audit.issues.map((issue) => (
                  <Card
                    key={issue.id}
                    className={cn("border", severityColor[issue.severity])}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <div>
                          <p className="font-medium">{issue.title}</p>
                          <p className="mt-1 text-xs text-muted-foreground">{issue.description}</p>
                          <p className="mt-2 text-xs text-primary">Fix: {issue.fix}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          <div className="grid gap-4 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Opportunities</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
                  {audit.opportunities.map((o) => (
                    <li key={o}>{o}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Next steps</CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="list-inside list-decimal space-y-1 text-sm">
                  {audit.nextSteps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
              </CardContent>
            </Card>
            {audit.recommendedUploads.length > 0 && (
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Play className="h-4 w-4" /> Recommended uploads
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {audit.recommendedUploads.map((u) => (
                    <Badge key={u} variant="secondary">
                      {u}
                    </Badge>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </>
      )}
    </div>
  );
}

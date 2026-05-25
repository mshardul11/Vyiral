"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Calendar,
  Columns3,
  Heart,
  LayoutGrid,
  Sparkles,
} from "lucide-react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ExportMenu } from "@/components/tools/export-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/contexts/workspace-context";
import { useToast } from "@/hooks/use-toast";
import {
  generateIdeasBatch,
  listIdeas,
  toggleIdeaFavorite,
  updateIdeaStatus,
} from "@/server/actions/ideas";
import type { ContentIdeaItem, IdeaBoardStatus } from "@/types/intelligence";
import { cn } from "@/lib/utils";

const COLUMNS: { status: IdeaBoardStatus; label: string }[] = [
  { status: "backlog", label: "Backlog" },
  { status: "planned", label: "Planned" },
  { status: "filming", label: "Filming" },
  { status: "published", label: "Published" },
];

export function ContentIdeasClient() {
  const { activeProject } = useWorkspace();
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<ContentIdeaItem[]>([]);
  const [view, setView] = useState<"grid" | "kanban" | "calendar">("grid");
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await listIdeas(activeProject?.id);
    if (res.success && res.data) setIdeas(res.data);
    setLoading(false);
  }, [activeProject?.id]);

  useEffect(() => {
    void load();
  }, [load]);

  const generate = async () => {
    setGenerating(true);
    const res = await generateIdeasBatch({ projectId: activeProject?.id });
    setGenerating(false);
    if (res.success) {
      toast({ title: "Ideas generated", description: res.data?.summary });
      void load();
    } else {
      toast({ title: "Failed", description: res.error, variant: "destructive" });
    }
  };

  const moveStatus = async (idea: ContentIdeaItem, status: IdeaBoardStatus) => {
    const res = await updateIdeaStatus({ id: idea.id, status });
    if (res.success && res.data) {
      setIdeas((prev) => prev.map((x) => (x.id === idea.id ? res.data! : x)));
    }
  };

  const toggleFav = async (id: string, favorite: boolean) => {
    const next = !favorite;
    const res = await toggleIdeaFavorite(id, next);
    if (res.success) {
      setIdeas((prev) => prev.map((x) => (x.id === id ? { ...x, favorite: next } : x)));
    }
  };

  const byStatus = useMemo(() => {
    const map = new Map<IdeaBoardStatus, ContentIdeaItem[]>();
    for (const col of COLUMNS) map.set(col.status, []);
    for (const idea of ideas) {
      const list = map.get(idea.status) ?? [];
      list.push(idea);
      map.set(idea.status, list);
    }
    return map;
  }, [ideas]);

  const IdeaCard = ({ idea }: { idea: ContentIdeaItem }) => (
    <Card className="mb-2 hover:border-primary/30">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm leading-snug">{idea.title}</CardTitle>
          <button
            type="button"
            onClick={() => void toggleFav(idea.id, idea.favorite)}
            className="shrink-0"
          >
            <Heart
              className={cn("h-4 w-4", idea.favorite && "fill-primary text-primary")}
            />
          </button>
        </div>
        <Badge variant="outline" className="w-fit text-[10px]">
          {idea.type}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2 text-xs text-muted-foreground">
        <p>{idea.hook}</p>
        <div className="flex justify-between">
          <span>Viral</span>
          <span className="font-semibold text-primary">{idea.viralProbability}%</span>
        </div>
        <p>{idea.recommendedPublishTime}</p>
      </CardContent>
    </Card>
  );

  return (
    <div className="pb-8">
      <ToolPageHeader
        title="Content idea engine"
        description="Video concepts, series, Shorts, community posts, and livestream ideas."
        actions={
          <>
            <ExportMenu
              csvRows={ideas.map((i) => ({
                title: i.title,
                type: i.type,
                viral: i.viralProbability,
                status: i.status,
              }))}
            />
            <Button variant="gradient" onClick={() => void generate()} disabled={generating}>
              <Sparkles className="mr-2 h-4 w-4" />
              {generating ? "Generating…" : "Generate"}
            </Button>
          </>
        }
      />

      <div className="mb-4 flex gap-2">
        {(
          [
            ["grid", LayoutGrid],
            ["kanban", Columns3],
            ["calendar", Calendar],
          ] as const
        ).map(([v, Icon]) => (
          <Button
            key={v}
            variant={view === v ? "default" : "outline"}
            size="sm"
            onClick={() => setView(v)}
          >
            <Icon className="mr-2 h-4 w-4" />
            {v}
          </Button>
        ))}
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40 rounded-xl" />
          ))}
        </div>
      ) : ideas.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            Generate AI content ideas for your niche.
          </CardContent>
        </Card>
      ) : view === "kanban" ? (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.status} className="glass-panel rounded-xl p-3">
              <h3 className="mb-3 text-sm font-semibold">{col.label}</h3>
              {(byStatus.get(col.status) ?? []).map((idea) => (
                <div key={idea.id}>
                  <IdeaCard idea={idea} />
                  <select
                    className="glass-input mb-2 h-8 w-full rounded-lg px-2 text-xs"
                    value={idea.status}
                    onChange={(e) =>
                      void moveStatus(idea, e.target.value as IdeaBoardStatus)
                    }
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.status} value={c.status}>
                        Move to {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          ))}
        </div>
      ) : view === "calendar" ? (
        <Card>
          <CardContent className="py-8">
            <div className="grid gap-2 sm:grid-cols-7">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                <div key={d} className="text-center text-xs font-medium text-muted-foreground">
                  {d}
                </div>
              ))}
              {ideas.slice(0, 14).map((idea, i) => (
                <div
                  key={idea.id}
                  className="glass-panel min-h-[80px] rounded-lg p-2 text-[10px]"
                  style={{ gridColumn: (i % 7) + 1 }}
                >
                  <p className="font-medium line-clamp-2">{idea.title}</p>
                  <p className="mt-1 text-muted-foreground">{idea.recommendedPublishTime}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Sparkles } from "lucide-react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ExportMenu } from "@/components/tools/export-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/contexts/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { generateTagBatch, listTagHistory } from "@/server/actions/tags";
import { copyToClipboard } from "@/lib/utils/export";
import type { TagGenerationResult, TagItem } from "@/types/intelligence";

export function TagGeneratorClient() {
  const searchParams = useSearchParams();
  const { activeProject } = useWorkspace();
  const { toast } = useToast();
  const [source, setSource] = useState(searchParams.get("source") ?? "");
  const [sourceType, setSourceType] = useState<"keyword" | "title" | "url" | "topic">("topic");
  const [tags, setTags] = useState<TagItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<TagGenerationResult[]>([]);

  const loadHistory = useCallback(async () => {
    const res = await listTagHistory(activeProject?.id);
    if (res.success && res.data) setHistory(res.data);
  }, [activeProject?.id]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const grouped = useMemo(() => {
    const map = new Map<string, TagItem[]>();
    for (const t of tags) {
      const g = map.get(t.group) ?? [];
      g.push(t);
      map.set(t.group, g);
    }
    return [...map.entries()];
  }, [tags]);

  const generate = async () => {
    if (!source.trim()) return;
    setLoading(true);
    const res = await generateTagBatch({
      source: source.trim(),
      sourceType,
      projectId: activeProject?.id,
    });
    setLoading(false);
    if (res.success && res.data) {
      setTags(res.data.tags);
      toast({ title: "Tags generated" });
      void loadHistory();
    } else {
      toast({ title: "Failed", description: res.error, variant: "destructive" });
    }
  };

  const allTagsText = tags.map((t) => t.tag).join(", ");

  return (
    <div className="pb-8">
      <ToolPageHeader
        title="AI tag generator"
        description="Relevance and trend scoring with smart grouping."
        actions={
          <ExportMenu
            csvRows={tags.map((t) => ({
              tag: t.tag,
              relevance: t.relevanceScore,
              trend: t.trendScore,
              group: t.group,
            }))}
            copyText={allTagsText}
          />
        }
      />

      <Card className="mb-6">
        <CardContent className="flex flex-col gap-3 p-4 sm:flex-row">
          <select
            className="glass-input h-10 rounded-xl px-3 text-sm"
            value={sourceType}
            onChange={(e) => setSourceType(e.target.value as typeof sourceType)}
          >
            <option value="topic">Topic</option>
            <option value="keyword">Keyword</option>
            <option value="title">Title</option>
            <option value="url">Video URL</option>
          </select>
          <Input
            className="glass-input flex-1"
            placeholder="Enter keyword, title, URL, or topic…"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
          <Button variant="gradient" onClick={() => void generate()} disabled={loading}>
            <Sparkles className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <Skeleton className="h-40 rounded-2xl" />
      ) : tags.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            Generate tags from your content context.
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                void copyToClipboard(allTagsText);
                toast({ title: "Copied all tags" });
              }}
            >
              <Copy className="mr-2 h-4 w-4" /> Copy all
            </Button>
          </div>
          {grouped.map(([group, items]) => (
            <div key={group}>
              <h3 className="mb-2 text-sm font-semibold text-muted-foreground">{group}</h3>
              <div className="flex flex-wrap gap-2">
                {items.map((t, idx) => (
                  <Badge
                    key={`${group}-${idx}-${t.tag}`}
                    variant="secondary"
                    className="cursor-pointer px-3 py-1.5 text-sm"
                    onClick={() => {
                      void copyToClipboard(t.tag);
                      toast({ title: "Copied", description: t.tag });
                    }}
                  >
                    {t.tag}
                    <span className="ml-2 text-[10px] opacity-60">{t.relevanceScore}</span>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-2 text-sm text-muted-foreground">History</h2>
          <div className="flex flex-wrap gap-2">
            {history.map((h) => (
              <Button
                key={h.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSource(h.source);
                  setTags(h.tags);
                }}
              >
                {h.source.slice(0, 40)}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

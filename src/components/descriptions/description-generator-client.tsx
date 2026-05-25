"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Sparkles } from "lucide-react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ExportMenu } from "@/components/tools/export-menu";
import { ScoreRing } from "@/components/tools/score-ring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/contexts/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { generateDescriptionBatch } from "@/server/actions/descriptions";
import { copyToClipboard } from "@/lib/utils/export";
import type { DescriptionVariant } from "@/types/intelligence";
import { cn } from "@/lib/utils";

/** Description variants use `length` (short/medium/long) — not on TitleVariant. */
function descriptionVariantKey(v: DescriptionVariant, index: number): string {
  return `desc-${index}-${v.length}`;
}

export function DescriptionGeneratorClient() {
  const searchParams = useSearchParams();
  const { activeProject } = useWorkspace();
  const { toast } = useToast();
  const [topic, setTopic] = useState(searchParams.get("topic") ?? "");
  const [title, setTitle] = useState("");
  const [variants, setVariants] = useState<DescriptionVariant[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [loading, setLoading] = useState(false);

  const active = variants[activeIdx];

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    const res = await generateDescriptionBatch({
      topic: topic.trim(),
      title: title || undefined,
      projectId: activeProject?.id,
    });
    setLoading(false);
    if (res.success && res.data) {
      setVariants(res.data.variants);
      setActiveIdx(0);
      toast({ title: "Descriptions generated" });
    } else {
      toast({ title: "Failed", description: res.error, variant: "destructive" });
    }
  };

  return (
    <div className="pb-8">
      <ToolPageHeader
        title="AI description generator"
        description="SEO-optimized copy with chapters, CTAs, and hashtags."
        actions={
          active && (
            <ExportMenu copyText={active.text} csvRows={[{ description: active.text }]} />
          )
        }
      />

      <Card className="mb-6">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-3">
          <Input
            className="glass-input sm:col-span-2"
            placeholder="Video topic…"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Input
            className="glass-input"
            placeholder="Title (optional)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Button
            variant="gradient"
            className="sm:col-span-3 sm:max-w-xs"
            onClick={() => void generate()}
            disabled={loading}
          >
            <Sparkles className="mr-2 h-4 w-4" />
            Generate
          </Button>
        </CardContent>
      </Card>

      {loading ? (
        <Skeleton className="h-64 rounded-2xl" />
      ) : !active ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            Generate short, medium, and long description variants.
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="flex gap-2 lg:flex-col">
            {variants.map((v, i) => (
              <Button
                key={descriptionVariantKey(v, i)}
                variant={activeIdx === i ? "default" : "outline"}
                className="capitalize"
                onClick={() => setActiveIdx(i)}
              >
                {v.length}
              </Button>
            ))}
          </div>
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="capitalize">{active.length} format</CardTitle>
              <div className="flex gap-4">
                <ScoreRing score={active.seoScore} size={56} label="SEO" />
                <ScoreRing score={active.readabilityScore} size={56} label="Read" />
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <textarea
                className={cn(
                  "glass-input min-h-[220px] w-full resize-y rounded-xl p-4 text-sm leading-relaxed"
                )}
                value={active.text}
                onChange={(e) => {
                  const next = [...variants];
                  next[activeIdx] = { ...active, text: e.target.value };
                  setVariants(next);
                }}
              />
              <div className="flex flex-wrap gap-1">
                {active.hashtags.map((h, idx) => (
                  <Badge key={`${active.length}-hashtag-${idx}-${h}`} variant="secondary">
                    {h}
                  </Badge>
                ))}
              </div>
              {active.chapters.length > 0 && (
                <div>
                  <p className="mb-1 text-xs font-medium text-muted-foreground">Chapters</p>
                  <ul className="text-sm text-muted-foreground">
                    {active.chapters.map((c, idx) => (
                      <li key={`${active.length}-chapter-${idx}-${c.time}-${c.label}`}>
                        {c.time} — {c.label}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <p className="text-sm text-primary">{active.cta}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  void copyToClipboard(active.text);
                  toast({ title: "Copied" });
                }}
              >
                <Copy className="mr-2 h-4 w-4" /> Copy
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

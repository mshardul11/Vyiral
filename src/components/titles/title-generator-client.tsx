"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Copy, Sparkles, Star } from "lucide-react";
import { ToolPageHeader } from "@/components/tools/tool-page-header";
import { ExportMenu } from "@/components/tools/export-menu";
import { ScoreRing } from "@/components/tools/score-ring";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkspace } from "@/contexts/workspace-context";
import { useToast } from "@/hooks/use-toast";
import { generateTitleBatch, listTitleHistory } from "@/server/actions/titles";
import { copyToClipboard } from "@/lib/utils/export";
import type { TitleGenerationResult, TitleStyle, TitleVariant } from "@/types/intelligence";
import { cn } from "@/lib/utils";

function titleVariantKey(v: TitleVariant): string {
  return `${v.style}::${v.text}`;
}

const STYLE_LABELS: Record<TitleStyle, string> = {
  high_ctr: "High CTR",
  educational: "Educational",
  curiosity_gap: "Curiosity gap",
  storytelling: "Storytelling",
  authority: "Authority",
  listicle: "Listicle",
  controversial: "Controversial",
  viral_challenge: "Viral challenge",
  minimalist: "Minimalist",
};

export function TitleGeneratorClient() {
  const searchParams = useSearchParams();
  const { activeProject } = useWorkspace();
  const { toast } = useToast();
  const [topic, setTopic] = useState(searchParams.get("topic") ?? "");
  const [focusKeyword, setFocusKeyword] = useState("");
  const [count, setCount] = useState(20);
  const [variants, setVariants] = useState<TitleVariant[]>([]);
  const [compareMode, setCompareMode] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<TitleGenerationResult[]>([]);

  const loadHistory = useCallback(async () => {
    const res = await listTitleHistory(activeProject?.id);
    if (res.success && res.data) setHistory(res.data);
  }, [activeProject?.id]);

  useEffect(() => {
    void loadHistory();
  }, [loadHistory]);

  const [styleFilter, setStyleFilter] = useState<TitleStyle | "all">("all");

  const best = useMemo(
    () => (variants.length ? variants.reduce((a, b) => (b.overallScore > a.overallScore ? b : a)) : null),
    [variants]
  );

  const stylesPresent = useMemo(() => {
    const order = Object.keys(STYLE_LABELS) as TitleStyle[];
    const present = new Set(variants.map((v) => v.style));
    return order.filter((s) => present.has(s));
  }, [variants]);

  const displayedVariants = useMemo(
    () => (styleFilter === "all" ? variants : variants.filter((v) => v.style === styleFilter)),
    [variants, styleFilter]
  );

  const generate = async () => {
    if (!topic.trim()) return;
    setLoading(true);
    const res = await generateTitleBatch({
      topic: topic.trim(),
      count,
      focusKeyword: focusKeyword || undefined,
      projectId: activeProject?.id,
    });
    setLoading(false);
    if (res.success && res.data) {
      setVariants(res.data.variants);
      setSelected([]);
      setStyleFilter("all");
      toast({ title: "Titles generated", description: `${res.data.variants.length} options ready` });
      void loadHistory();
    } else {
      toast({ title: "Failed", description: res.error, variant: "destructive" });
    }
  };

  const toggleSelect = (key: string) => {
    if (!compareMode) return;
    setSelected((prev) =>
      prev.includes(key)
        ? prev.filter((x) => x !== key)
        : prev.length < 2
          ? [...prev, key]
          : [prev[1]!, key]
    );
  };

  return (
    <div className="pb-8">
      <ToolPageHeader
        title="AI title generator"
        description="CTR prediction, emotional triggers, keyword density, and length optimization."
        badge="Scored"
        actions={
          <ExportMenu
            csvRows={variants.map((v) => ({
              title: v.text,
              score: v.overallScore,
              ctr: v.ctrScore,
              style: v.style,
            }))}
            copyText={variants.map((v) => v.text).join("\n")}
          />
        }
      />

      <Card className="mb-6 border-primary/20">
        <CardContent className="grid gap-3 p-4 sm:grid-cols-2 lg:grid-cols-4">
          <Input
            className="glass-input lg:col-span-2"
            placeholder="Video topic or working title…"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
          <Input
            className="glass-input"
            placeholder="Focus keyword (optional)"
            value={focusKeyword}
            onChange={(e) => setFocusKeyword(e.target.value)}
          />
          <div className="flex gap-2">
            <select
              className="glass-input h-10 flex-1 rounded-xl px-3 text-sm"
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
            >
              {[10, 20, 30, 50].map((n) => (
                <option key={n} value={n}>
                  {n} titles
                </option>
              ))}
            </select>
            <Button variant="gradient" onClick={() => void generate()} disabled={loading}>
              <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        <Button
          variant={compareMode ? "default" : "outline"}
          size="sm"
          onClick={() => {
            setCompareMode(!compareMode);
            setSelected([]);
          }}
        >
          Compare mode
        </Button>
        {variants.length > 0 && stylesPresent.length > 1 && (
          <>
            <Button
              variant={styleFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setStyleFilter("all")}
            >
              All styles
            </Button>
            {stylesPresent.map((style) => (
              <Button
                key={style}
                variant={styleFilter === style ? "default" : "outline"}
                size="sm"
                onClick={() => setStyleFilter(style)}
              >
                {STYLE_LABELS[style]}
              </Button>
            ))}
          </>
        )}
      </div>

      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : variants.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="py-16 text-center text-muted-foreground">
            Enter a topic and generate scored title variants.
          </CardContent>
        </Card>
      ) : (
        <>
          {compareMode && selected.length === 2 && (
            <div className="mb-4 grid gap-4 md:grid-cols-2">
              {selected.map((key) => {
                const v = variants.find((item) => titleVariantKey(item) === key);
                if (!v) return null;
                return (
                  <Card key={key} className="border-primary/30">
                    <CardContent className="p-4">
                      <ScoreRing score={v.overallScore} size={72} />
                      <p className="mt-3 font-semibold">{v.text}</p>
                      <p className="mt-2 text-xs text-muted-foreground">
                        CTR {v.ctrScore} · Length {v.lengthScore} · Density {v.keywordDensity}%
                      </p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
          <div className="space-y-2">
            {displayedVariants.map((v) => {
              const key = titleVariantKey(v);
              return (
              <Card
                key={key}
                className={cn(
                  "transition-all hover:border-primary/25",
                  best?.text === v.text && "border-emerald-500/40 ring-1 ring-emerald-500/20",
                  compareMode && selected.includes(key) && "border-primary/50"
                )}
                onClick={() => toggleSelect(key)}
              >
                <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center">
                  <div className="flex shrink-0 items-center gap-3">
                    <ScoreRing score={v.overallScore} size={56} />
                    {best?.text === v.text && (
                      <Badge variant="success" className="gap-1">
                        <Star className="h-3 w-3" /> Best pick
                      </Badge>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium leading-snug">{v.text}</p>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <Badge variant="secondary">{STYLE_LABELS[v.style]}</Badge>
                      <Badge variant="muted">CTR {v.ctrScore}</Badge>
                      {v.emotionalTriggers.slice(0, 2).map((t) => (
                        <Badge key={t} variant="outline">
                          {t}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      void copyToClipboard(v.text);
                      toast({ title: "Copied" });
                    }}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
              );
            })}
          </div>
        </>
      )}

      {history.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">History</h2>
          <div className="flex flex-wrap gap-2">
            {history.slice(0, 5).map((h) => (
              <Button
                key={h.id}
                variant="outline"
                size="sm"
                onClick={() => {
                  setTopic(h.topic);
                  setVariants(h.variants);
                  setStyleFilter("all");
                }}
              >
                {h.topic}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

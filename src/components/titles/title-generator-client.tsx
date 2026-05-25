"use client";

import { useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import { generateTitlesAction } from "@/server/actions/titles";
import type { ScoredTitle } from "@/types/seo";
import { SectionHeader } from "@/components/shared/section-header";
import { toolPageMeta } from "@/lib/constants/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/utils/export";

export function TitleGeneratorClient({
  initialKeyword,
}: {
  initialKeyword?: string;
}) {
  const [topic, setTopic] = useState(initialKeyword ?? "");
  const [titles, setTitles] = useState<ScoredTitle[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    const res = await generateTitlesAction({
      topic: topic.trim(),
      style: "high_ctr",
      count: 10,
      keyword: topic.trim(),
    });
    setLoading(false);
    if (res.success && res.data) {
      setTitles(res.data.titles);
    } else {
      toast({ title: "Something went wrong", description: res.error, variant: "destructive" });
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 animate-fade-in">
      <SectionHeader
        title={toolPageMeta["/titles"]!.title}
        description={toolPageMeta["/titles"]!.description}
      />

      <div className="space-y-4 rounded-xl border border-border/60 bg-card/40 p-6">
        <div className="space-y-2">
          <Label>What is your video about?</Label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder={toolPageMeta["/titles"]!.placeholder}
            onKeyDown={(e) => e.key === "Enter" && generate()}
          />
        </div>
        <Button onClick={generate} disabled={loading || !topic.trim()}>
          <Sparkles className="h-4 w-4" />
          {loading ? "Generating…" : toolPageMeta["/titles"]!.actionLabel}
        </Button>
      </div>

      {loading &&
        Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}

      {titles.length > 0 && (
        <ul className="space-y-2">
          {titles.map((t, i) => (
            <li
              key={`${t.title}-${i}`}
              className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card/40 px-4 py-3"
            >
              <p className="text-sm font-medium leading-snug">{t.title}</p>
              <Button
                size="sm"
                variant="ghost"
                onClick={() =>
                  copyToClipboard(t.title).then(() => toast({ title: "Copied" }))
                }
              >
                <Copy className="h-4 w-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

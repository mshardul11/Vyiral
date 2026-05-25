"use client";

import { useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import { generateDescriptionAction } from "@/server/actions/descriptions";
import type { DescriptionLength, GeneratedDescriptionResult } from "@/types/seo";
import { SectionHeader } from "@/components/shared/section-header";
import { toolPageMeta } from "@/lib/constants/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/utils/export";

export function DescriptionGeneratorClient({
  initialTopic,
}: {
  initialTopic?: string;
}) {
  const [topic, setTopic] = useState(initialTopic ?? "");
  const [title, setTitle] = useState("");
  const [format, setFormat] = useState<DescriptionLength>("medium");
  const [result, setResult] = useState<GeneratedDescriptionResult | null>(null);
  const [edited, setEdited] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    const res = await generateDescriptionAction({
      topic: topic.trim(),
      format,
      title: title.trim() || undefined,
      keywords: [topic],
    });
    setLoading(false);
    if (res.success && res.data) {
      setResult(res.data.result);
      setEdited(res.data.result.description);
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title={toolPageMeta["/descriptions"]!.title}
        description={toolPageMeta["/descriptions"]!.description}
      />

      <div className="space-y-4 rounded-xl border border-border/60 bg-card/40 p-6">
        <div className="space-y-2">
          <Label>What is your video about?</Label>
          <Input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. how I edit videos in 10 minutes"
          />
        </div>
        <div className="space-y-2">
          <Label>Video title (optional)</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <Button onClick={generate} disabled={loading}>
          <Sparkles className="h-4 w-4" />
          {loading ? "Writing…" : toolPageMeta["/descriptions"]!.actionLabel}
        </Button>
      </div>

      {result && (
        <>
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(edited).then(() => toast({ title: "Copied" }))}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy description
            </Button>
          </div>
          <Textarea
            value={edited}
            onChange={(e) => setEdited(e.target.value)}
            className="min-h-[280px] font-mono text-sm"
          />
          <div className="grid gap-4 md:grid-cols-3">
            <ListBlock title="Hooks" items={result.hooks} />
            <ListBlock title="CTAs" items={result.ctas} />
            <ListBlock title="Hashtags" items={result.hashtags} />
          </div>
          {result.chapters.length > 0 && (
            <div>
              <Label>Chapters</Label>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {result.chapters.map((c) => (
                  <li key={c.label}>
                    {c.time} — {c.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}

function ListBlock({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-border/40 p-3">
      <p className="text-sm font-medium">{title}</p>
      <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
        {items.map((i) => (
          <li key={i}>{i}</li>
        ))}
      </ul>
    </div>
  );
}

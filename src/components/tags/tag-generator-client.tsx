"use client";

import { useState } from "react";
import { Copy, Sparkles } from "lucide-react";
import { generateTagsAction } from "@/server/actions/tags";
import type { ScoredTag } from "@/types/seo";
import { SectionHeader } from "@/components/shared/section-header";
import { toolPageMeta } from "@/lib/constants/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { copyToClipboard } from "@/lib/utils/export";

export function TagGeneratorClient({ initialTopic }: { initialTopic?: string }) {
  const [source, setSource] = useState(initialTopic ?? "");
  const sourceType = "topic" as const;
  const [tags, setTags] = useState<ScoredTag[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  async function generate() {
    if (!source.trim()) return;
    setLoading(true);
    const res = await generateTagsAction({ source: source.trim(), sourceType });
    setLoading(false);
    if (res.success && res.data) {
      setTags(res.data.tags);
    }
  }

  const groups = [...new Set(tags.map((t) => t.group ?? "Other"))];

  return (
    <div className="space-y-6 animate-fade-in">
      <SectionHeader
        title={toolPageMeta["/tags"]!.title}
        description={toolPageMeta["/tags"]!.description}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="e.g. beginner guitar lessons"
          className="flex-1"
        />
        <Button onClick={generate} disabled={loading}>
          <Sparkles className="h-4 w-4" />
          {loading ? "Generating…" : toolPageMeta["/tags"]!.actionLabel}
        </Button>
      </div>

      {tags.length > 0 && (
        <>
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                copyToClipboard(tags.map((t) => t.tag).join(", ")).then(() =>
                  toast({ title: "Copied all tags" })
                )
              }
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy all tags
            </Button>
          </div>
          {groups.map((group) => (
            <div key={group}>
              <Label className="text-muted-foreground">{group}</Label>
              <div className="mt-2 flex flex-wrap gap-2">
                {tags
                  .filter((t) => (t.group ?? "Other") === group)
                  .map((t) => (
                    <button
                      key={t.tag}
                      type="button"
                      className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 px-3 py-1.5 text-sm hover:border-primary/40"
                      onClick={() => copyToClipboard(t.tag)}
                    >
                      {t.tag}
                    </button>
                  ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

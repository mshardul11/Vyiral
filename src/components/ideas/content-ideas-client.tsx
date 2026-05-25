"use client";

import { useState } from "react";
import { Bookmark, Sparkles, Star } from "lucide-react";
import { generateContentIdeasAction, saveContentIdea } from "@/server/actions/ideas";
import type { ContentIdeaResult } from "@/types/seo";
import { SectionHeader } from "@/components/shared/section-header";
import { toolPageMeta } from "@/lib/constants/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useWorkspace } from "@/contexts/workspace-context";
import { cn } from "@/lib/utils";

export function ContentIdeasClient({ initialTopic }: { initialTopic?: string }) {
  const [topic, setTopic] = useState(initialTopic ?? "");
  const [ideas, setIdeas] = useState<ContentIdeaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const { toast } = useToast();
  const { activeProject } = useWorkspace();

  async function generate() {
    if (!topic.trim()) return;
    setLoading(true);
    const res = await generateContentIdeasAction(topic.trim());
    setLoading(false);
    if (res.success && res.data) {
      setIdeas(res.data.ideas);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6 animate-fade-in">
      <SectionHeader
        title={toolPageMeta["/ideas"]!.title}
        description={toolPageMeta["/ideas"]!.description}
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Input
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g. fitness for beginners at home"
          className="flex-1"
        />
        <Button onClick={generate} disabled={loading}>
          <Sparkles className="h-4 w-4" />
          {loading ? "Thinking…" : toolPageMeta["/ideas"]!.actionLabel}
        </Button>
      </div>

      {ideas.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2">
          {ideas.map((idea) => (
            <IdeaCard
              key={idea.id}
              idea={idea}
              favorite={favorites.has(idea.id)}
              onFavorite={() =>
                setFavorites((f) => {
                  const n = new Set(f);
                  if (n.has(idea.id)) n.delete(idea.id);
                  else n.add(idea.id);
                  return n;
                })
              }
              onSave={async () => {
                await saveContentIdea(idea, activeProject?.id);
                toast({ title: "Saved to project" });
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function IdeaCard({
  idea,
  favorite,
  onFavorite,
  onSave,
}: {
  idea: ContentIdeaResult;
  favorite: boolean;
  onFavorite: () => void;
  onSave: () => void;
}) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/40 p-4">
      <h3 className="font-semibold">{idea.title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{idea.hook}</p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" variant="ghost" onClick={onFavorite}>
          <Star className={cn("h-3 w-3", favorite && "fill-primary text-primary")} />
        </Button>
        <Button size="sm" variant="secondary" onClick={onSave}>
          <Bookmark className="h-3 w-3" />
          Save
        </Button>
      </div>
    </div>
  );
}

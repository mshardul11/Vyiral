"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getCreatorRecommendations } from "@/server/actions/recommendations";
import type { CreatorRecommendation } from "@/types/intelligence";

const priorityVariant = {
  high: "warning" as const,
  medium: "secondary" as const,
  low: "muted" as const,
};

export function RecommendationsPanel() {
  const [items, setItems] = useState<CreatorRecommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const res = await getCreatorRecommendations();
      if (res.success && res.data) setItems(res.data);
      setLoading(false);
    })();
  }, []);

  return (
    <Card className="rounded-2xl border-primary/20 bg-card/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-primary" />
          Creator recommendations
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 rounded-xl" />
            ))}
          </div>
        ) : items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Run keyword research or a channel audit to unlock personalized recommendations.
          </p>
        ) : (
          <ul className="space-y-2">
            {items.slice(0, 5).map((item) => (
              <li
                key={item.id}
                className="flex items-start justify-between gap-2 rounded-xl border border-border/40 px-3 py-2"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{item.title}</span>
                    <Badge variant={priorityVariant[item.priority]} className="text-[10px]">
                      {item.priority}
                    </Badge>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                    {item.description}
                  </p>
                </div>
                {item.actionHref && (
                  <Button variant="ghost" size="icon" className="shrink-0" asChild>
                    <Link href={item.actionHref}>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

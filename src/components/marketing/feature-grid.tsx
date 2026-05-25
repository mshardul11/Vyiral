import {
  BarChart3,
  Bot,
  LineChart,
  Search,
  Shield,
  Sparkles,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Search,
    title: "Keyword intelligence",
    description:
      "Discover opportunities with volume, competition, trend, and intent scores — all labeled as estimates where applicable.",
  },
  {
    icon: Sparkles,
    title: "AI metadata studio",
    description:
      "Titles, tags, and descriptions tuned for CTR and SEO with editable outputs and full history.",
  },
  {
    icon: Shield,
    title: "Channel audits",
    description:
      "Rule-based scoring plus AI summaries for actionable fixes across titles, tags, and consistency.",
  },
  {
    icon: LineChart,
    title: "Stats tracker",
    description:
      "Track public channel metrics with sparklines and growth snapshots over time.",
  },
  {
    icon: BarChart3,
    title: "Competitor benchmarks",
    description:
      "Compare upload cadence, topics, and performance across 30/60/90-day windows.",
  },
  {
    icon: Bot,
    title: "Content ideas",
    description:
      "Angles, hooks, and thumbnail concepts you can save to your content calendar.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center text-3xl font-bold">
          Everything to grow on YouTube
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          One workspace for research, creation, and optimization — extension-ready
          architecture included.
        </p>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <Card key={f.title} className="transition-transform hover:-translate-y-0.5">
              <CardHeader>
                <f.icon className="h-8 w-8 text-primary mb-2" />
                <CardTitle className="text-lg">{f.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{f.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { DescriptionGenerationResult } from "@/types/intelligence";
import { scoreDescriptionSeo } from "@/lib/scoring/seo";
import { seededRandom } from "./seed";

export function mockDescriptionGeneration(
  topic: string,
  title?: string
): DescriptionGenerationResult {
  const focus = title ?? topic;
  const short = `Learn ${topic} in this video. ${focus} — practical tips for creators. Subscribe for weekly uploads.`;
  const medium = `${short}\n\nIn this video we cover:\n• Why ${topic} matters\n• Common mistakes\n• Action steps you can use today\n\n#${topic.replace(/\s+/g, "")} #youtube #creator`;
  const long = `${medium}\n\n🔗 Resources in pinned comment\n📧 Business: hello@vyiral.app\n\nChapters below — all metrics in analytics are estimates.`;

  const keywords = [topic, ...topic.split(" ").filter((w) => w.length > 3)];

  const build = (length: "short" | "medium" | "long", text: string) => {
    const { seoScore, readabilityScore } = scoreDescriptionSeo(text, keywords);
    return {
      length,
      text,
      seoScore,
      readabilityScore,
      hashtags: [`#${topic.replace(/\s+/g, "")}`, "#youtube", "#creatortips"],
      chapters:
        length === "long"
          ? [
              { label: "Intro", time: "0:00" },
              { label: "Main lesson", time: "1:20" },
              { label: "Action plan", time: "6:40" },
              { label: "Outro", time: "9:10" },
            ]
          : [],
      cta: "Subscribe and turn on notifications for the next video in this series.",
    };
  };

  return {
    id: `desc_${Date.now()}`,
    topic,
    variants: [build("short", short), build("medium", medium), build("long", long)],
  };
}

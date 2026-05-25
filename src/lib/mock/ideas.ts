import type { ContentIdeasResult, ContentIdeaItem, ContentIdeaType } from "@/types/intelligence";
import { pick, randInt, seededRandom } from "./seed";

const TYPES: ContentIdeaType[] = ["video", "series", "shorts", "community", "livestream"];
const AUDIENCES = ["Beginners", "Rural creators", "Hindi audience", "Tech enthusiasts", "Students"];
const TIMES = ["Tuesday 6 PM IST", "Saturday 10 AM IST", "Sunday evening", "Weekday mornings"];

export function mockContentIdeas(niche: string, audience: string): ContentIdeasResult {
  const rng = seededRandom(`${niche}:${audience}`);
  const ideas: ContentIdeaItem[] = Array.from({ length: randInt(rng, 10, 16) }, (_, i) => {
    const type = pick(rng, TYPES);
    const title = `${niche} idea #${i + 1}: ${pick(rng, ["mistakes", "tools", "workflow", "growth", "monetization"])}`;
    return {
      id: `idea_${Date.now()}_${i}`,
      type,
      title,
      hook: `Most ${audience} creators miss this about ${niche}…`,
      thumbnailConcept: `Bold text + creator reaction + ${niche} icon`,
      audienceType: pick(rng, AUDIENCES),
      viralProbability: randInt(rng, 42, 91),
      contentAngle: `Practical ${niche} lesson with local examples`,
      estimatedCompetition: randInt(rng, 25, 85),
      recommendedPublishTime: pick(rng, TIMES),
      status: "backlog",
      favorite: false,
    };
  });

  return {
    ideas,
    summary: `${ideas.length} content angles tailored for ${audience} in the ${niche} niche.`,
  };
}

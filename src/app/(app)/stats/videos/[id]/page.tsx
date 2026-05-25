import { VideoIntelligenceClient } from "@/components/analytics/video-intelligence-client";

export const metadata = { title: "Video Intelligence — Vyiral" };

export default async function VideoIntelligencePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <VideoIntelligenceClient videoId={id} />;
}

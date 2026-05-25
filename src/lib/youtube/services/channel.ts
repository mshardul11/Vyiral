import { youtubeList } from "@/lib/youtube/client";
import type { NormalizedChannel } from "@/lib/youtube/types";

interface ChannelItem {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: { high?: { url?: string } };
    customUrl?: string;
  };
  statistics?: {
    subscriberCount?: string;
    viewCount?: string;
    videoCount?: string;
  };
}

export async function fetchChannel(
  channelId: string
): Promise<NormalizedChannel | null> {
  try {
    const res = await youtubeList<ChannelItem>("/channels", {
      part: "snippet,statistics",
      id: channelId,
    });
    const item = res.items[0];
    if (!item) return null;
    return {
      id: item.id,
      title: item.snippet?.title ?? "Unknown",
      description: item.snippet?.description ?? "",
      thumbnailUrl: item.snippet?.thumbnails?.high?.url ?? "",
      subscriberCount: Number(item.statistics?.subscriberCount ?? 0),
      viewCount: Number(item.statistics?.viewCount ?? 0),
      videoCount: Number(item.statistics?.videoCount ?? 0),
      customUrl: item.snippet?.customUrl,
    };
  } catch {
    return null;
  }
}

export async function fetchChannelByHandle(
  handle: string
): Promise<NormalizedChannel | null> {
  const res = await youtubeList<ChannelItem>("/channels", {
    part: "snippet,statistics",
    forHandle: handle.replace("@", ""),
  });
  const item = res.items[0];
  if (!item) return null;
  return fetchChannel(item.id);
}

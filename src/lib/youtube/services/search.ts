import { youtubeList } from "@/lib/youtube/client";
import type { NormalizedSearchResult } from "@/lib/youtube/types";

interface SearchItem {
  id: { channelId?: string; videoId?: string; playlistId?: string };
  snippet?: {
    title?: string;
    channelId?: string;
    thumbnails?: { default?: { url?: string } };
  };
}

export async function searchYouTube(
  query: string,
  type: "video" | "channel" | "playlist" = "video",
  maxResults = 10
): Promise<NormalizedSearchResult[]> {
  const res = await youtubeList<SearchItem>("/search", {
    part: "snippet",
    q: query,
    type,
    maxResults: String(maxResults),
  });

  return res.items.map((item) => {
    const id =
      item.id.videoId ?? item.id.channelId ?? item.id.playlistId ?? "";
    const resultType = item.id.videoId
      ? "video"
      : item.id.channelId
        ? "channel"
        : "playlist";
    return {
      type: resultType as NormalizedSearchResult["type"],
      id,
      title: item.snippet?.title ?? "",
      thumbnailUrl: item.snippet?.thumbnails?.default?.url,
      channelId: item.snippet?.channelId,
    };
  });
}

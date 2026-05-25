import { youtubeList } from "@/lib/youtube/client";
import type { NormalizedVideo } from "@/lib/youtube/types";

interface VideoItem {
  id: string;
  snippet?: {
    title?: string;
    description?: string;
    publishedAt?: string;
    thumbnails?: { medium?: { url?: string } };
  };
  statistics?: {
    viewCount?: string;
    likeCount?: string;
    commentCount?: string;
  };
  contentDetails?: { duration?: string };
}

function mapVideo(item: VideoItem): NormalizedVideo {
  return {
    id: item.id,
    title: item.snippet?.title ?? "",
    description: item.snippet?.description ?? "",
    thumbnailUrl: item.snippet?.thumbnails?.medium?.url ?? "",
    publishedAt: item.snippet?.publishedAt ?? "",
    viewCount: Number(item.statistics?.viewCount ?? 0),
    likeCount: Number(item.statistics?.likeCount ?? 0),
    commentCount: Number(item.statistics?.commentCount ?? 0),
    duration: item.contentDetails?.duration,
  };
}

export async function fetchVideoStats(videoId: string): Promise<NormalizedVideo | null> {
  const res = await youtubeList<VideoItem>("/videos", {
    part: "snippet,statistics,contentDetails",
    id: videoId,
  });
  const item = res.items[0];
  return item ? mapVideo(item) : null;
}

export async function fetchChannelUploads(
  channelId: string,
  maxResults = 10
): Promise<NormalizedVideo[]> {
  const search = await youtubeList<{ id: { videoId?: string } }>("/search", {
    part: "id",
    channelId,
    order: "date",
    type: "video",
    maxResults: String(maxResults),
  });
  const ids = search.items
    .map((i) => i.id.videoId)
    .filter((id): id is string => Boolean(id));
  if (!ids.length) return [];

  const res = await youtubeList<VideoItem>("/videos", {
    part: "snippet,statistics,contentDetails",
    id: ids.join(","),
  });
  return res.items.map(mapVideo);
}

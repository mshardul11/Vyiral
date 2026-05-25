import { requireYouTubeApiKey } from "@/lib/validators/env";
import { logger } from "@/lib/utils/logger";
import { getCached, setCached, cacheKey } from "@/lib/youtube/cache";

const YOUTUBE_API = "https://www.googleapis.com/youtube/v3";
const MAX_RETRIES = 2;

interface YouTubeListResponse<T> {
  items: T[];
  nextPageToken?: string;
  pageInfo?: { totalResults: number };
}

async function youtubeFetch<T>(
  path: string,
  params: Record<string, string>,
  useCache = true
): Promise<T> {
  const key = cacheKey([path, JSON.stringify(params)]);
  if (useCache) {
    const cached = getCached<T>(key);
    if (cached) return cached;
  }

  const url = new URL(`${YOUTUBE_API}${path}`);
  url.searchParams.set("key", requireYouTubeApiKey());
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  let lastError: unknown;
  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const res = await fetch(url.toString(), { next: { revalidate: 300 } });
      if (res.status === 403) {
        logger.warn("youtube", "Quota or permission error", { path });
        throw new Error("YouTube API quota exceeded or forbidden");
      }
      if (!res.ok) {
        throw new Error(`YouTube API error: ${res.status}`);
      }
      const data = (await res.json()) as T;
      if (useCache) setCached(key, data);
      return data;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_RETRIES) {
        await new Promise((r) => setTimeout(r, 400 * (attempt + 1)));
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error("YouTube request failed");
}

export async function youtubeList<T>(
  path: string,
  params: Record<string, string>
): Promise<YouTubeListResponse<T>> {
  return youtubeFetch<YouTubeListResponse<T>>(path, params);
}

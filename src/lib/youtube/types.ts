export interface NormalizedChannel {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  subscriberCount: number;
  viewCount: number;
  videoCount: number;
  customUrl?: string;
}

export interface NormalizedVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  publishedAt: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  duration?: string;
}

export interface NormalizedPlaylist {
  id: string;
  title: string;
  itemCount: number;
  thumbnailUrl?: string;
}

export interface NormalizedSearchResult {
  type: "channel" | "video" | "playlist";
  id: string;
  title: string;
  thumbnailUrl?: string;
  channelId?: string;
}

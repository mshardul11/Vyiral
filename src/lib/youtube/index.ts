export { fetchChannel, fetchChannelByHandle } from "@/lib/youtube/services/channel";
export { fetchVideoStats, fetchChannelUploads } from "@/lib/youtube/services/videos";
export { searchYouTube } from "@/lib/youtube/services/search";
export type {
  NormalizedChannel,
  NormalizedVideo,
  NormalizedPlaylist,
  NormalizedSearchResult,
} from "@/lib/youtube/types";

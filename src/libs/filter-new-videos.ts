import { Video } from "../models/video";

export function filterNewVideos(videos: Video[]) {
  const uniqueSrc = new Set<string>();
  const uniqueVideos: Video[] = [];
  videos.forEach((video) => {
    if (!uniqueSrc.has(video.src)) {
      uniqueSrc.add(video.src);
      uniqueVideos.push(video);
    }
  });
  return uniqueVideos
    .map((v) => ({ ...v, timestamp: new Date(v.timestamp) }))
    .sort((v1, v2) => v2.timestamp.valueOf() - v1.timestamp.valueOf());
}

import { TZDate } from "@date-fns/tz";

import { Monitor } from "@/models/monitor";
import { Video } from "@/models/video";

import { SERVER_TIMEZONE, SERVER_URL } from "../app/config";
import { getDateTimeUrl, getFullDate } from "../libs/formatDate";

export async function getMonitors({
  authToken,
  groupKey,
}: {
  authToken?: string;
  groupKey?: string;
}) {
  if (!authToken || !groupKey) return [];

  const response = await fetch(
    `${SERVER_URL}/${authToken}/monitor/${groupKey}`,
  );

  if (!response.ok) {
    throw new Error(
      "[GetMonitors] Failed to fetch monitors: " + response.statusText ||
        "Unknown error",
    );
  }

  const data = await response.json();
  if (data.ok === false) {
    throw new Error(
      "[GetMonitors] Failed to fetch monitors: " + data.msg || "Unknown error",
    );
  }

  const monitors = data.map((monitor: any) => {
    return {
      name: monitor.name,
      id: monitor.mid,
      mode: monitor.mode,
      streams: monitor.streams.map((stream: string) =>
        stream.replace(/^\//, ""),
      ),
      groupKey: monitor.ke,
    };
  });

  monitors.sort((m1: Monitor, m2: Monitor) =>
    m1.name.localeCompare(m2.name) > 0 ? 1 : -1,
  );

  return monitors;
}

export async function getVideos(
  {
    authToken,
    groupKey,
    searchParams,
  }: {
    authToken?: string | null;
    groupKey?: string | null;
    searchParams?: string;
  } = { authToken: null, groupKey: null, searchParams: "" },
) {
  if (!authToken || !groupKey) return [];

  const response = await fetch(
    `${SERVER_URL}/${authToken}/videos/${groupKey}?${searchParams}`,
  );

  if (!response.ok) {
    throw new Error(
      "[GetVideos] Failed to fetch videos: " + response.statusText ||
        "Unknown error",
    );
  }

  const data = await response.json();
  if (data.ok === false) {
    throw new Error(
      "[GetVideos] Failed to fetch videos: " + data.msg || "Unknown error",
    );
  }

  const serverTZ = SERVER_TIMEZONE;
  const videos: Video[] = data.videos.map((video: any) => {
    const videoTime = new TZDate(video.time, serverTZ);
    const thumbnailTime = new TZDate(video.time, serverTZ);
    thumbnailTime.setSeconds(thumbnailTime.getSeconds() + 7);
    const thumbPath = `${getFullDate(thumbnailTime)}/${getDateTimeUrl(
      thumbnailTime,
    )}.jpg`;
    const thumbUrl = `${authToken}/timelapse/${groupKey}/${video.mid}/${thumbPath}`;
    return {
      src: video.href.replace(/^\//, ""),
      thumbnail: thumbUrl,
      timestamp: videoTime,
      mid: video.mid,
      isLiveStream: video.isLiveStream,
    };
  });

  videos.sort((v1, v2) => v2.timestamp!.valueOf() - v1.timestamp!.valueOf());
  return videos;
}

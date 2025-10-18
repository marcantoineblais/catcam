import { Monitor } from "../models/monitor";
import { Video } from "../models/video";
import { getToken } from "./jwt";
import { DEFAULT_SETTINGS, SERVER_URL } from "../config";
import { getDateTimeUrl, getFullDate } from "./formatDate";
import { readSettings } from "./settings";

export async function fetchSession() {
  try {
    const token = await getToken({ isServerAction: true });
    const authToken = token?.authToken ?? null;
    const groupKey = (token?.groupKey ?? null) as string | null;
    const email = token?.email;

    const monitors = await fetchMonitors({ authToken, groupKey });
    const videos = await fetchVideos({ authToken, groupKey });
    const settings = await fetchSettings(email);
    return {
      authToken,
      groupKey,
      monitors,
      videos,
      settings,
    };
  } catch (error) {
    console.error("[FetchSession] Error fetching session:", error);
    throw error;
  }
}

export async function fetchMonitors({
  authToken,
  groupKey,
}: {
  authToken: string | null;
  groupKey: string | null;
}) {
  try {
    if (!authToken || !groupKey) return [];

    const response = await fetch(
      `${SERVER_URL}/${authToken}/monitor/${groupKey}`
    );

    if (response.ok) {
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid monitors data");

      const monitors = data.map((monitor: any) => {
        return {
          name: monitor.name,
          id: monitor.mid,
          streams: monitor.streams,
          groupKey: monitor.ke,
        };
      });

      monitors.sort((m1: Monitor, m2: Monitor) =>
        m1.name.localeCompare(m2.name) > 0 ? 1 : -1
      );
      return monitors;
    } else {
      throw new Error("Failed to fetch monitors");
    }
  } catch (error) {
    console.error("[FetchMonitors] Error fetching monitors:", error);
    throw error;
  }
}

export async function fetchVideos(
  {
    authToken,
    groupKey,
    searchParams,
  }: {
    authToken?: string | null;
    groupKey?: string | null;
    searchParams?: string;
  } = { authToken: null, groupKey: null, searchParams: "" }
) {
  if (!authToken || !groupKey) return [];

  try {
    const response = await fetch(
      `${SERVER_URL}/${authToken}/videos/${groupKey}?${searchParams}`
    );

    if (response.ok) {
      const data = await response.json();
      const videos: Video[] = data.videos.map((video: any) => {
        const videoTime = new Date(video.time);
        const thumbnailTime = new Date(video.time);
        thumbnailTime.setSeconds(thumbnailTime.getSeconds() + 7);
        const thumbPath = `${getFullDate(thumbnailTime)}/${getDateTimeUrl(
          thumbnailTime
        )}.jpg`;
        const thumbUrl = `/${authToken}/timelapse/${groupKey}/${video.mid}/${thumbPath}`;

        return {
          src: "api" + video.href,
          thumbnail: "api" + thumbUrl,
          timestamp: videoTime,
          mid: video.mid,
        };
      });

      videos.sort((v1, v2) => v2.timestamp.valueOf() - v1.timestamp.valueOf());
      return videos;
    }

    throw new Error("Failed to fetch videos: " + response.statusText);
  } catch (error) {
    console.error("[FetchVideos] Error fetching videos:", error);
    throw error;
  }
}

export async function fetchSettings(email?: string) {
  if (!email) {
    return DEFAULT_SETTINGS;
  }

  return await readSettings(email);
}

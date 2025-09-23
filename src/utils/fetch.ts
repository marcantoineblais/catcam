import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Monitor } from "../models/monitor";
import { Video } from "../models/video";
import { getDateTimeUrl, getFullDate } from "./formatDate";
import { addSeconds } from "date-fns";
import { getToken } from "./jwt";
import { SERVER_URL } from "../config";

export async function fetchSession() {
  try {
    const token = await getToken({ isServerAction: true });
    if (!token?.authToken) throw new Error("No auth token in token");
    
    const monitors = await fetchMonitors();
    const videos = await fetchVideos();
    const settings = await readSettings();
    return { monitors, videos, settings };
  } catch (error) {
    console.error("[FetchSession] Error fetching session:", error);
    redirect("/login");
  }
}

export async function fetchMonitors() {
  try {
    const token = await getToken({ isServerAction: true });
    if (!token?.authToken) throw new Error("No auth token in token");
    if (!token?.groupKey) throw new Error("No group key in token");

    const key = token.authToken;
    const groupKey = token.groupKey;
    const response = await fetch(`${SERVER_URL}/${key}/monitor/${groupKey}`);

    if (response.ok) {
      const data = await response.json();
      const monitors = data.map((monitor: any) => {
        return {
          name: monitor.name,
          id: monitor.mid,
          streams: monitor.streams,
          groupKey: monitor.ke,
        };
      });

      monitors.sort((m1: Monitor, m2: Monitor) => (m1.name > m2.name ? 1 : -1));
      return monitors;
    } else {
      throw new Error("Failed to fetch monitors");
    }
  } catch (error) {
    console.error("[FetchMonitors] Error fetching monitors:", error);
    redirect("/login");
  }
}

export async function fetchVideos(searchParams: URLSearchParams | string = "") {
  try {
    const token = await getToken({ isServerAction: true });
    if (!token?.authToken) throw new Error("No auth token in token");

    const key = token.authToken;
    const groupKey = token.groupKey;
    const response = await fetch(
      `${SERVER_URL}/${key}/videos/${groupKey}?${searchParams}`
    );

    if (response.ok) {
      const data = await response.json();
      const videos: Video[] = data.videos.map((video: any) => {
        const videoTime = new Date(video.time);
        const thumbTime = addSeconds(videoTime, 7);
        const thumbPath = `${getFullDate(thumbTime)}/${getDateTimeUrl(
          thumbTime
        )}.jpg`;
        const thumbUrl = `/${key}/timelapse/${groupKey}/${video.mid}/${thumbPath}`;

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
  } catch (error) {
    console.error("[FetchVideos] Error fetching videos:", error);
  }

  return [];
}

export async function readSettings() {
  const cookiesValue = await cookies();
  const mode = cookiesValue.get("mode")?.value || "light";
  const camera = cookiesValue.get("camera")?.value || "";
  const home = cookiesValue.get("home")?.value || " live";
  const quality = cookiesValue.get("quality")?.value || "HQ";

  return { mode, camera, home, quality };
}

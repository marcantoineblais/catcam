import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Monitor } from "../models/monitor";
import { Video } from "../models/video";
import { getDateTimeUrl, getFullDate } from "./formatDate";
import { TZDate } from "@date-fns/tz";
import { addSeconds } from "date-fns";
import { NextRequest } from "next/server";

export async function fetchMonitors() {
  const headersValue = await headers();
  const jwt = headersValue.get("session") as string;

  try {
    const session = JSON.parse(jwt);
    const apiUrl = process.env.SERVER_URL;
    const key = session.auth_token;
    const groupKey = session.ke;
    const response = await fetch(`${apiUrl}/${key}/monitor/${groupKey}`);

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
      redirect("/login");
    }
  } catch (ex) {
    redirect("/login");
  }
}

export async function fetchVideos(searchParams: URLSearchParams | string = "") {
  const headersValue = await headers();
  const jwt = headersValue.get("session") as string;

  try {
    const session = JSON.parse(jwt);
    const apiUrl = process.env.SERVER_URL;
    const key = session.auth_token;
    const groupKey = session.ke;
    const response = await fetch(
      `${apiUrl}/${key}/videos/${groupKey}?${searchParams}`,
    );

    if (response.ok) {
      const data = await response.json();
      const videos: Video[] = data.videos.map((video: any) => {
        const videoTime = new TZDate(video.time, "GMT-0000");
        const thumbTime = addSeconds(videoTime, 6);
        const thumbPath = `${getFullDate(thumbTime)}/${getDateTimeUrl(
          thumbTime,
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
  } catch (_) {}

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

import { SERVER_URL } from "../config";
import { getDateTimeUrl, getFullDate } from "../libs/formatDate";
import { Monitor } from "../models/monitor";
import { Video } from "../models/video";

export class ShinobiService {
  static async getMonitors({
    authToken,
    groupKey,
  }: {
    authToken?: string;
    groupKey?: string;
  }) {
    if (!authToken || !groupKey) return [];

    const response = await fetch(
      `${SERVER_URL}/${authToken}/monitor/${groupKey}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch monitors");
    }
    
    const data = await response.json();
    if (data.ok === false) {
      console.error(
        "[FetchMonitors] Token was revoked by server. User needs to log in again."
      );
      throw new Error("Invalid monitors data");
    }

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
  }

  static async getVideos(
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

    const response = await fetch(
      `${SERVER_URL}/${authToken}/videos/${groupKey}?${searchParams}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch videos: " + response.statusText);
    }

    const data = await response.json();
    if (data.ok === false) {
      console.error(
        "[FetchVideos] Token was revoked by server. User needs to log in again."
      );
      throw new Error("Invalid Videos data");
    }

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
}

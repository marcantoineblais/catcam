"use server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const apiUrl = process.env.SERVER_URL;
  const jwt = request.headers.get("session") as string;

  try {
    const session = JSON.parse(jwt);
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    const groupKey = url.searchParams.get("groupKey");
    const params = new URLSearchParams({
      start: url.searchParams.get("start") || "",
      end: url.searchParams.get("end") || "",
    });

    const serverUrl = new URL(
      `/${session.auth_token}/videos/${groupKey}${id ? "/" + id : ""}`,
      apiUrl
    );

    serverUrl.search = params.toString();
    const videosResponse = await fetch(serverUrl);

    if (videosResponse.ok) {
      const videosData = await videosResponse.json();
      // const videos = videosData.videos.map((video: any) => {
      //   const time = new Date(video.time);
      //   time.setUTCSeconds(time.getUTCSeconds() + 7);
      //   const date = `${time.getUTCFullYear()}-${normaliseTime(
      //     time.getUTCMonth() + 1
      //   )}-${normaliseTime(time.getUTCDate())}`;
      //   const dateTime = `${date}T${normaliseTime(
      //     time.getUTCHours()
      //   )}-${normaliseTime(time.getUTCMinutes())}-${normaliseTime(
      //     time.getUTCSeconds()
      //   )}`;
      //   const url = `/${session.auth_token}/timelapse/${groupKey}/${video.mid}/${date}/${dateTime}.jpg`;
      //   return { ...video, thumbnail: url };
      // });

      // return NextResponse.json({ ok: true, videos: videos });
    }

    NextResponse.error();
  } catch (ex) {
    return NextResponse.error();
  }

  return NextResponse.error();
}

"use server";

import normaliseTime from "@/src/utils/normaliseTime";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const apiUrl = process.env.SERVER_URL;
    const jwt = request.headers.get("session") as string;

    try {
        const session = JSON.parse(jwt);
        const url = new URL(request.url);
        const id = url.searchParams.get("id") || "";
        const groupKey = url.searchParams.get("groupKey");
        const page = parseInt(url.searchParams.get("page") || "1");
        const nbItems = parseInt(url.searchParams.get("nbItems") || "12");
        const videosResponse = await fetch(`${apiUrl}/${session.auth_token}/videos/${groupKey}/${id}`);

        if (videosResponse.ok) {
            const videosData = await videosResponse.json();
            const lastPage = Math.ceil(videosData.videos.length / nbItems);
            const startIndex = (page - 1) * nbItems;
            const endIndex = startIndex + nbItems;
            const videos = videosData.videos.slice(startIndex, endIndex).map((video: any) => {
                const time = new Date(video.time);
                time.setUTCSeconds(time.getUTCSeconds() + 7);
                const date = `${time.getUTCFullYear()}-${normaliseTime(time.getUTCMonth() + 1)}-${normaliseTime(time.getUTCDate())}`
                const dateTime = `${date}T${normaliseTime(time.getUTCHours())}-${normaliseTime(time.getUTCMinutes())}-${normaliseTime(time.getUTCSeconds())}`
                const url = `/${session.auth_token}/timelapse/${groupKey}/${video.mid}/${date}/${dateTime}.jpg`;
                return { ...video, thumbnail: url };
            });

            return NextResponse.json({ ok: true, videos: videos, lastPage: lastPage });
        } 
            
        NextResponse.error();   
    } catch(ex) {
        return NextResponse.error();    
    }

    return NextResponse.error();
}
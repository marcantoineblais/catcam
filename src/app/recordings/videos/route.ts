"use server";

import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const apiUrl = process.env.API_URL;
    const jwt = request.headers.get("session") as string;

    try {
        const session = JSON.parse(jwt);
        const url = new URL(request.url);
        const id = url.searchParams.get("id");
        const groupKey = url.searchParams.get("groupKey");
        const page = parseInt(url.searchParams.get("page") || "1");
        const nbItems = parseInt(url.searchParams.get("nbItems") || "12");
        const videosResponse = await fetch(`${apiUrl}/${session.auth_token}/videos/${groupKey}/${id}`);
        const thumbnailsResponse = await fetch(`${apiUrl}/${session.auth_token}/timelapse/${groupKey}/${id}`);

        if (videosResponse.ok && thumbnailsResponse.ok) {
            const videosData = await videosResponse.json();
            const thumbnailsData = await thumbnailsResponse.json();
            const lastPage = Math.ceil(videosData.videos.length / nbItems)
            const startIndex = (page - 1) * nbItems;
            const endIndex = startIndex + nbItems;
            const videos = videosData.videos.slice(startIndex, endIndex).map((video: any) => {
                const startTime = new Date(video.time);
                const endTime = new Date(video.end);
                let thumbnail = thumbnailsData.find((thumbnail: any) => {
                    const time = new Date(thumbnail.time);
                    return time >= startTime && time <= endTime;
                });

                if (!thumbnail)
                    thumbnail = thumbnailsData[thumbnailsData.length - 1]

                const url = `${apiUrl}/${session.auth_token}/timelapse/${groupKey}/${id}/${thumbnail.filename.replace(/T.*/, "")}/${thumbnail.filename}`;
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
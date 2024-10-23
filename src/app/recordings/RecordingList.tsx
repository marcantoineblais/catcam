"use client"

import React from "react"
import VideoCard from "./VideoCard";
import normaliseTime from "@/src/utils/normaliseTime";
import renderPopup from "@/src/utils/renderPopup";
import { Monitor } from "@/src/models/monitor";

export default function RecordingList(
    { selectedMonitor, selectedVideo, setSelectedVideo, dateTime }:
    { selectedMonitor?: Monitor, selectedVideo: any, setSelectedVideo: Function, dateTime: number }
) {
    const [videos, setVideos] = React.useState<any[]>();
    const fetchReady = React.useRef<boolean>(true);

    React.useEffect(() => {
        if (!fetchReady.current)
            return;

        async function fetchVideos() {
            if (!selectedMonitor)
                return [];
        
            const startTime = new Date(dateTime);
            const endTime = new Date(dateTime);
            endTime.setUTCHours(endTime.getUTCHours() + 1);
        
            const startYear = startTime.getUTCFullYear();
            const startMonth = normaliseTime(startTime.getUTCMonth() + 1);
            const startDate = normaliseTime(startTime.getUTCDate());
            const startHours = normaliseTime(startTime.getUTCHours());
            const endYear = endTime.getUTCFullYear();
            const endMonth = normaliseTime(endTime.getUTCMonth() + 1);
            const endDate = normaliseTime(endTime.getUTCDate());
            const endHours = normaliseTime(endTime.getUTCHours());
            const startTimeStr = `${startYear}-${startMonth}-${startDate}T${startHours}:00:00`
            const endTimeStr = `${endYear}-${endMonth}-${endDate}T${endHours}:00:00`
        
            const params = new URLSearchParams({
                id: selectedMonitor.mid,
                groupKey: selectedMonitor.ke,
                start: startTimeStr,
                end: endTimeStr
            });
            const response = await fetch("/api/videos?" + params);
        
            if (response.ok) {
                const data = await response.json();
                setVideos(data.videos);
                fetchReady.current = true;
            } else {
                renderPopup(["There was an issue while loading the videos.", "Please try again later."], "Error");
            }
        }

        fetchReady.current = false;
        fetchVideos();
    }, [selectedMonitor, dateTime])

    function renderVideoCards() {
        if (!videos)
            return null;

        if (videos.length === 0)
            return <div className="w-full h-full flex justify-center items-center">No videos available</div>
        

        return videos.map((video, i) => {
            return (
                <VideoCard 
                    key={i} 
                    video={video} 
                    selectedVideo={selectedVideo} 
                    onClick={() => setSelectedVideo(video)}
                />
            )
        });
    }

    function renderDateTime() {
        const time = new Date(dateTime);
        const hours = time.getHours();
        const date = normaliseTime(time.getDate());
        const month = normaliseTime(time.getMonth() + 1);
        const year = time.getFullYear();
        const dateStr = `${date}-${month}-${year}`
        const timeStr = `${hours}:00`

        return (
            <>
                <span className="font-bold text-xl">{timeStr}</span>
                <span>{dateStr}</span>
            </>
        )
    }

    return (
        <div className="pt-1 pb-3 w-full flex flex-col items-center overflow-hidden">
            <h2 className="py-0.5 w-full flex justify-between items-center">{renderDateTime()}</h2>
            <div className="w-full flex justify-start content-start flex-wrap shadow dark:shadow-zinc-50/10 overflow-hidden">
                {renderVideoCards()}
            </div>
        </div>
    )
}
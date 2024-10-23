"use client"

import React from "react"
import VideoCard from "./VideoCard";
import normaliseTime from "@/src/utils/normaliseTime";

export default function RecordingList(
    { videos, selectedVideo, setSelectedVideo }:
    { videos?: any[], selectedVideo: any, setSelectedVideo: Function }
) {

    const [selectedTime, setSelectedTime] = React.useState<Date>();    
    const containerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        const today = new Date(Date.now());
        today.setUTCMinutes(0, 0, 0);
        setSelectedTime(today);
    }, [])

    function renderVideoCards() {
        if (!videos)
            return;
            
        return videos.map((video, i) => <VideoCard key={i} video={video} selectedVideo={selectedVideo} onClick={() => setSelectedVideo(video)} />)
    }

    function renderDateTime() {
        if (!selectedTime)
            return null;

        const startHours = selectedTime.getHours();
        const endHours = (startHours + 1) % 24;
        const date = normaliseTime(selectedTime.getDate());
        const month = normaliseTime(selectedTime.getMonth() + 1);
        const year = selectedTime.getFullYear();
        const dateStr = `${date}-${month}-${year}`
        const rangeStr = `${startHours}:00 - ${endHours}:00`

        return (
            <>
                <span>{dateStr}</span>
                <span className="font-bold text-lg">{rangeStr}</span>
            </>
        )
    }

    return (
        <div className="w-full h-full flex flex-col items-center overflow-hidden">
            <div ref={containerRef} className="w-full h-full flex justify-start content-start flex-wrap scroll-smooth overflow-y-scroll shadow dark:shadow-zinc-50/10">
                { 
                    videos?.length === 0 ? (
                        <div className="w-full h-full flex justify-center items-center">No videos available</div>
                    ) : (
                        renderVideoCards() 
                    )
                }
            </div>

            <div className="flex flex-col items-center">
                {renderDateTime()}
            </div>
        </div>
    )
}
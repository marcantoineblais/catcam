"use client"

import React from "react"
import VideoCard from "./VideoCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleLeft, faCircleRight } from "@fortawesome/free-solid-svg-icons";

export default function RecordingList(
    { videos, selectedVideo, setSelectedVideo, page, lastPage = 1, setPage }:
    { videos?: any[], selectedVideo: any, setSelectedVideo: Function, page: number, lastPage?: number, setPage: Function }
) {

    const containerRef = React.useRef<HTMLDivElement>(null)
    
    function previousPage() {
        if (page > 1) {
            setPage(page - 1)
            scrollUp()
        }
    }
    
    function nextPage() {
        if (page < lastPage) {
            setPage(page + 1)
            scrollUp()
        }
    }

    function scrollUp() {
        const container = containerRef.current

        if (!container)
            return

        container.scrollTo({ top: 0 })
    }

    function renderVideoCards() {
        if (!videos)
            return;
            
        return videos.map((video, i) => <VideoCard key={i} video={video} selectedVideo={selectedVideo} onClick={() => setSelectedVideo(video)} />)
    }

    return (
        <div className="h-full w-full flex flex-col items-center overflow-hidden">
            <div ref={containerRef} className="w-full grow flex justify-start content-start flex-wrap scroll-smooth overflow-y-scroll shadow">
                { renderVideoCards() }
            </div>

            <div className="w-full p-3 flex justify-between items-center">
                <FontAwesomeIcon 
                    data-disabled={page === 1 ? true : undefined} 
                    className="w-8 h-8 md:w-12 md:h-12 hover:brightness-150 cursor-pointer data-[disabled]:invisible data-[disabled]:cursor-default" 
                    icon={faCircleLeft} 
                    onClick={previousPage}
                />
                <div className="font-bold md:text-xl">
                    Page {page} of {lastPage}
                </div>
                <FontAwesomeIcon 
                    data-disabled={page === lastPage ? true : undefined} 
                    className="w-8 h-8 md:w-12 md:h-12 hover:brightness-150 cursor-pointer data-[disabled]:invisible data-[disabled]:cursor-default" 
                    icon={faCircleRight} 
                    onClick={nextPage}
                />
            </div>
        </div>
    )
}
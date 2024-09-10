"use client";

import React from "react";
import Navbar from "../../components/navbar/Navbar";
import VideoPlayer from "../../components/VideoPlayer";
import RecordingList from "./RecordingList";
import { Monitor } from "@/src/models/monitor";
import SourceSelector from "@/src/components/SourceSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
import renderPopup from "@/src/utils/renderPopup";
import CarouselButton from "./CarouselButton";

export default function Recordings({ monitors, defaultMonitor, nbItems }: { monitors?: Monitor[], defaultMonitor: string, nbItems: string; }) {

    const [videoSource, setVideoSource] = React.useState<string>();
    const [selectedVideo, setSelectedVideo] = React.useState<any>();
    const [selectedMonitor, setSelectedMonitor] = React.useState<Monitor>();
    const [videos, setVideos] = React.useState<any[]>();
    const [page, setPage] = React.useState<number>(1);
    const [lastPage, setLastPage] = React.useState<number>(1);
    const [carouselPage, setCarouselPage] = React.useState<number>(0);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const videoRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!monitors)
            return;

        const monitor = monitors.find(monitor => monitor.mid === defaultMonitor) || monitors[0];
        setSelectedMonitor(monitor);
    }, [monitors, defaultMonitor]);

    React.useEffect(() => {
        setPage(1);
    }, [selectedMonitor])

    React.useEffect(() => {
        const fetchData = async () => {
            if (!selectedMonitor)
                return;

            const params = new URLSearchParams({
                id: selectedMonitor.mid,
                groupKey: selectedMonitor.ke,
                page: page.toString(),
                nbItems: nbItems
            });

            const response = await fetch("/recordings/videos?" + params);

            if (response.ok) {
                const data = await response.json();
                setVideos(data.videos);
                setLastPage(data.lastPage || 1);
                if (data.videos.length === 0)
                    renderPopup(["There is no videos for that camera.", "Please try again later."], "Warning")
            } else {
                setLastPage(1);
                renderPopup(["There was an issue while loading the videos.", "Please try again later."], "Error");
            }
        };

        fetchData();
        setCarouselPage(0);
    }, [page, selectedMonitor, monitors, nbItems]);

    React.useEffect(() => {
        if (!selectedVideo)
            return;

        const apiUrl = process.env.API_URL;
        setVideoSource(apiUrl + selectedVideo.href)
        setIsDrawerOpen(false)
    }, [selectedVideo])

    React.useEffect(() => {
        const carousel = carouselRef.current

        if (!carousel)
            return;

        const pageWidth = carousel.clientWidth / 2
        const position = pageWidth * carouselPage
        carousel.style.left = -position + "px"
    }, [carouselPage])

    React.useEffect(() => {
        const video = videoRef.current

        if (!video)
            return

        if (isDrawerOpen) {
            video.style.maxHeight = "0px";
        } else {
            video.style.maxHeight = "";
        }
    }, [isDrawerOpen])

    return (
        <>
            <Navbar />
            <main ref={containerRef} className="p-1 h-full container mx-auto max-w-screen-lg flex flex-col">
                <div ref={videoRef} className="max-h-full duration-1000">
                    <VideoPlayer videoSource={videoSource} containerRef={containerRef} />
                </div>
                
                <div className="z-10 h-full flex flex-col overflow-hidden bg-gray-100 dark:bg-zinc-900">
                    <div className="w-full mt-3 mb-1 flex justify-between items-center shadow dark:shadow-zinc-50/10">
                        <CarouselButton label="Recordings" active={carouselPage === 0} onClick={() => setCarouselPage(0)} />

                        <FontAwesomeIcon 
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            icon={faAngleUp} 
                            className="w-8 h-8 md:w-12 md:h-12 duration-500 cursor-pointer data-[active]:rotate-180" 
                            data-active={isDrawerOpen ? true : undefined}
                        />

                        <CarouselButton label="Cameras" active={carouselPage === 1} onClick={() => setCarouselPage(1)} rightAlign />
                    </div>

                    <div className="w-full h-full overflow-hidden">
                        <div ref={carouselRef} className="relative w-[200%] h-full duration-500 flex justify-start">
                            <div className="relative px-1.5 basis-1/2 h-full">
                                {
                                    (!videos || videos.length === 0) &&
                                    <div className="absolute inset-0 flex justify-center items-center">
                                        <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 md:w-18 md:h-18 animate-spin" />
                                    </div>
                                }
                                
                                <RecordingList
                                    videos={videos}
                                    selectedVideo={selectedVideo}
                                    setSelectedVideo={setSelectedVideo}
                                    page={page}
                                    lastPage={lastPage}
                                    setPage={setPage}
                                />
                            </div>
                            <div className="px-1.5 flex basis-1/2 h-full">
                                <SourceSelector monitors={monitors} selectedMonitor={selectedMonitor} setSelectedMonitor={setSelectedMonitor} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}
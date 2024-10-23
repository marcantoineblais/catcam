"use client";

import React from "react";
import VideoPlayer from "../../components/video/VideoPlayer";
import RecordingList from "./RecordingList";
import { Monitor } from "@/src/models/monitor";
import SourceSelector from "@/src/components/SourceSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faSpinner } from "@fortawesome/free-solid-svg-icons";
import renderPopup from "@/src/utils/renderPopup";
import CarouselButton from "./CarouselButton";
import normaliseTime from "@/src/utils/normaliseTime";

export default function Recordings({ monitors }: { monitors?: Monitor[] }) {

    const [selectedTime, setSelectedTime] = React.useState<Date>(new Date(Date.now()));
    const [videoSource, setVideoSource] = React.useState<string>();
    const [selectedVideo, setSelectedVideo] = React.useState<any>();
    const [selectedMonitor, setSelectedMonitor] = React.useState<Monitor>();
    const [playlist, setPlaylist] = React.useState<any[]>();
    const [videos, setVideos] = React.useState<any[]>();
    const [carouselPage, setCarouselPage] = React.useState<number>(0);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const carouselRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!monitors)
            return;

        const monitor = monitors[0];
        setSelectedMonitor(monitor);
    }, [monitors]);

    React.useEffect(() => {
        const fetchData = async () => {
            if (!selectedMonitor)
                return;

            const startTime = new Date(selectedTime);
            const endTime = new Date(selectedTime);
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
            } else {
                renderPopup(["There was an issue while loading the videos.", "Please try again later."], "Error");
            }
        };

        fetchData();
        setCarouselPage(0);
    }, [selectedMonitor, monitors]);

    React.useEffect(() => {
        if (!selectedVideo)
            return;

        setVideoSource("api" + selectedVideo.href);
        setIsDrawerOpen(false);
    }, [selectedVideo]);

    React.useEffect(() => {
        const carousel = carouselRef.current;

        if (!carousel)
            return;

        const pageWidth = carousel.clientWidth / 2;
        const position = pageWidth * carouselPage;
        carousel.style.left = -position + "px";
    }, [carouselPage]);

    return (
        <div className="h-full flex flex-col justify-start overflow-hidden">
            <main className="grow p-1 container mx-auto max-w-screen-lg flex flex-col overflow-hidden">
                <div ref={containerRef} data-close={isDrawerOpen ? true : undefined} className="w-full max-h-full duration-1000 data-[close]:max-h-0 data-[close]:landscape:max-h-full data-[close]:lg:landscape:max-h-0 data-[close]:landscape:duration-0 data-[close]:landscape:lg:duration-1000">
                    <VideoPlayer title={selectedVideo?.filename} videoSource={videoSource} containerRef={containerRef} />
                </div>

                <div className="max-h-full h-full z-10 flex flex-col bg-gray-100 dark:bg-zinc-900 overflow-hidden duration-1000 landscape:hidden lg:landscape:flex">
                    <div className="w-full mt-3 mb-1 flex justify-between items-center shadow dark:shadow-zinc-50/10">
                        <CarouselButton label={selectedMonitor?.name || ""} active={carouselPage === 0} onClick={() => setCarouselPage(0)} />

                        <FontAwesomeIcon
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            icon={faAngleUp}
                            className="w-8 h-8 md:w-12 md:h-12 duration-500 cursor-pointer data-[active]:rotate-180"
                            data-active={isDrawerOpen ? true : undefined}
                        />

                        <CarouselButton label="Cameras" active={carouselPage === 1} onClick={() => setCarouselPage(1)} rightAlign />
                    </div>

                    <div className="w-full h-full overflow-hidden">
                        <div ref={carouselRef} className="relative w-[200%] h-full bg-inherit duration-500 flex justify-start overflow-hidden">
                            <div className="relative h-full px-1.5 basis-1/2 overflow-hidden">
                                {
                                    !videos ? (
                                        <div className="h-full flex justify-center items-center">
                                            <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 md:w-18 md:h-18 animate-spin" />
                                        </div>
                                    ) : (
                                        <RecordingList
                                            videos={videos}
                                            selectedVideo={selectedVideo}
                                            setSelectedVideo={setSelectedVideo}
                                        />
                                    )
                                }
                            </div>

                            <div className="px-1.5 flex basis-1/2 h-full">
                                <SourceSelector monitors={monitors} selectedMonitor={selectedMonitor} setSelectedMonitor={setSelectedMonitor} />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
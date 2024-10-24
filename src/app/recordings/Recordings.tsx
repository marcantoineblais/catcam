"use client";

import React, { ReactNode } from "react";
import VideoPlayer from "../../components/video/VideoPlayer";
import RecordingList from "./RecordingList";
import { Monitor } from "@/src/models/monitor";
import SourceSelector from "@/src/components/SourceSelector";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import CarouselButton from "./CarouselButton";

export default function Recordings({ monitors }: { monitors?: Monitor[]; }) {

    const [videoSource, setVideoSource] = React.useState<string>();
    const [selectedVideo, setSelectedVideo] = React.useState<any>();
    const [selectedMonitor, setSelectedMonitor] = React.useState<Monitor>();
    const [selectedTime, setSelectedTime] = React.useState<Date>(new Date(Date.now()));
    const [displayedTime, setDisplayedTime] = React.useState<number[]>([]);
    const [recordingsList, setRecordingsList] = React.useState<ReactNode[]>();
    const [playlist, setPlaylist] = React.useState<any[]>();
    const [carouselPage, setCarouselPage] = React.useState<number>(0);
    const [isDrawerOpen, setIsDrawerOpen] = React.useState<boolean>(false);
    const [observer, setObserver] = React.useState<IntersectionObserver>();
    const containerRef = React.useRef<HTMLDivElement>(null);
    const carouselRef = React.useRef<HTMLDivElement>(null);
    const scrollEventReady = React.useRef<boolean>(true);
    const recordingsRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!monitors)
            return;

        const monitor = monitors[0];
        setSelectedMonitor(monitor);
    }, [monitors]);

    React.useEffect(() => {
        if (!recordingsRef.current)
            return;

        function intersectionHandler(entries: IntersectionObserverEntry[], observer: IntersectionObserver) {
            entries.forEach((entry: IntersectionObserverEntry) => {
                const img = entry.target as HTMLImageElement
                const ratio = entry.intersectionRatio;
                img.style.opacity = ratio.toString();

                if (ratio >= 0.10) {
                    img.src = img.dataset.url || ""
                } else {
                    img.src = "";
                }
            })
        }

        const threshold = [];
        for (let i = 0; i <= 1; i += 0.05) {
            threshold.push(i);
        }

        const observer = new IntersectionObserver(intersectionHandler, {
            root: recordingsRef.current,
            threshold: threshold
        });

        setObserver(observer);
    }, [])

    React.useEffect(() => {
        const displayedTime = [];

        for (let i = 0; i < 6; i++) {
            const time = new Date(selectedTime);
            time.setUTCHours(time.getUTCHours() - i);
            displayedTime.push(time.valueOf());
        }

        setDisplayedTime(displayedTime);
        setCarouselPage(0);

        if (recordingsRef.current)
            recordingsRef.current.scrollTo({top: 0, behavior: "smooth"});
    }, [selectedTime, selectedMonitor]);

    React.useEffect(() => {
        const nodes: ReactNode[] = displayedTime.map((time, i) => {
            return (
                <RecordingList
                    key={i}
                    selectedMonitor={selectedMonitor}
                    selectedVideo={selectedVideo}
                    setSelectedVideo={setSelectedVideo}
                    dateTime={time}
                    observer={observer}
                />
            );
        });

        setRecordingsList(nodes);
    }, [displayedTime, selectedMonitor, selectedVideo, observer]);

    React.useEffect(() => {
        if (!selectedVideo)
            return;

        setVideoSource("/api" + selectedVideo.href);
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

    function onScrollHandler(e: React.SyntheticEvent<HTMLDivElement>) {
        const div = e.currentTarget;
        const scrollHeight = div.scrollHeight;
        const height = div.clientHeight;
        const scrollPosition = div.scrollTop;
        const scrollTreshold = scrollHeight - (1.1 * height);
        
        if (scrollPosition < scrollTreshold) 
            return;
        
        const updatedTime = [];
        const offset = displayedTime.length;
        for (let i = 0; i < 6; i++) {
            const time = new Date(selectedTime);
            time.setHours(time.getHours() - i - offset);
            updatedTime.push(time.valueOf());
        }

        setDisplayedTime([...displayedTime, ...updatedTime]);
    }


    return (
        <div className="h-full overflow-hidden">
            <main className="h-full p-1 container mx-auto max-w-screen-lg flex flex-col overflow-hidden">
                <div ref={containerRef} data-close={isDrawerOpen ? true : undefined} className="w-full max-h-full duration-1000 data-[close]:max-h-0 data-[close]:landscape:max-h-full data-[close]:lg:landscape:max-h-0 data-[close]:landscape:duration-0 data-[close]:landscape:lg:duration-1000">
                    <VideoPlayer title={selectedVideo?.filename} videoSource={videoSource} containerRef={containerRef} />
                </div>

                <div className="pb-1.5 max-h-full h-full z-10 flex flex-col bg-gray-100 dark:bg-zinc-900 overflow-hidden duration-1000 landscape:hidden lg:landscape:flex">
                    <div className="w-full mt-3 mb-1 flex justify-between items-center shadow dark:shadow-zinc-50/10">
                        <CarouselButton label={selectedMonitor?.name || ""} active={carouselPage === 0} onClick={() => setCarouselPage(0)} />

                        <FontAwesomeIcon
                            onClick={() => setIsDrawerOpen(!isDrawerOpen)}
                            icon={faAngleUp}
                            className="w-8 h-8 md:w-12 md:h-12 duration-500 cursor-pointer data-[active]:rotate-180"
                            data-active={isDrawerOpen ? true : undefined}
                        />

                        <CarouselButton label="Filters" active={carouselPage === 1} onClick={() => setCarouselPage(1)} rightAlign />
                    </div>

                    <div className="w-full h-full overflow-hidden">
                        <div ref={carouselRef} className="relative w-[200%] h-full bg-inherit duration-500 flex justify-start overflow-hidden">
                            <div 
                                ref={recordingsRef} 
                                onScroll={onScrollHandler}
                                className="relative h-full px-1.5 basis-1/2 overflow-y-auto"
                            >
                                {recordingsList}
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
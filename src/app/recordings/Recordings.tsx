"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import VideoPlayer from "../../components/video/VideoPlayer";
import RecordingList from "./RecordingList";
import { Monitor } from "@/src/models/monitor";
import SourceSelector from "@/src/components/SourceSelector";
import useDebounce from "@/src/hooks/useDebounce";
import { Video } from "@/src/models/video";
import Carousel from "@/src/components/carousel/Carousel";

export default function Recordings({
  monitors = [],
  videos = [],
}: {
  monitors?: Monitor[];
  videos?: Video[];
}) {
  const [videoLists, setVideosList] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>();
  const [monitorsList, setMonitorsList] = useState<Monitor[]>([]);
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor>(monitors[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounce = useDebounce();

  useEffect(() => {
    const allMonitor = { name: "All" };
    setVideosList(videos);
    setMonitorsList([allMonitor, ...monitors]);
    setSelectedMonitor(allMonitor);
  }, []);

  useEffect(() => {
    if (!selectedVideo) return;
    
    setIsDrawerOpen(false);
  }, [selectedVideo]);

  function fetchDataOnScroll(e: React.SyntheticEvent<HTMLDivElement>) {
    const div = e.target as HTMLDivElement;
    const scrollHeight = div.scrollHeight;
    const height = div.clientHeight;
    const scrollPosition = div.scrollTop;
    const scrollTreshold = scrollHeight - 1.1 * height;

    if (scrollPosition < scrollTreshold) return;
  }

  function toggleCarouselDrawer() {
    setIsDrawerOpen((isOpen) => !isOpen);
  }

  function onScrollHandler(e: React.SyntheticEvent<HTMLDivElement>) {
    debounce(() => fetchDataOnScroll(e), 500);
  }

  return (
    <div className="h-full overflow-hidden">
      <main className="h-full p-1 container mx-auto max-w-(--breakpoint-lg) flex flex-col overflow-hidden">
        <div
          ref={containerRef}
          data-close={isDrawerOpen ? true : undefined}
          className="w-full max-h-full duration-1000 data-close:max-h-0 data-close:landscape:max-h-full data-close:lg:landscape:max-h-0 data-close:landscape:duration-0 data-close:landscape:lg:duration-1000"
        >
          <VideoPlayer
            title={selectedVideo?.filename}
            src={selectedVideo?.src}
          />
        </div>

        <Carousel
          buttonsLabel={[selectedMonitor?.name ?? "", "Filters"]}
          isOpen={isDrawerOpen}
          toggleCarouselDrawer={toggleCarouselDrawer}
        >
          <RecordingList
            videosList={videoLists}
            selectedVideo={selectedVideo}
            setSelectedVideo={setSelectedVideo}
          />

          <SourceSelector
            monitors={monitors}
            selectedMonitor={selectedMonitor}
            setSelectedMonitor={setSelectedMonitor}
          />
        </Carousel>
      </main>
    </div>
  );
}

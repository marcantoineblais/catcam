"use client";

import React, { useEffect, useRef, useState } from "react";
import VideoPlayer from "../../components/video/VideoPlayer";
import RecordingsList from "./RecordingsList";
import { Monitor } from "@/src/models/monitor";
import SourceSelector from "@/src/components/SourceSelector";
import useDebounce from "@/src/hooks/useDebounce";
import { Video } from "@/src/models/video";
import Carousel from "@/src/components/carousel/Carousel";
import { getDateTime } from "@/src/utils/formatDate";

export default function Recordings({
  monitors = [],
  videos = [],
}: {
  monitors?: Monitor[];
  videos?: Video[];
}) {
  const [videosList, setVideosList] = useState<Video[]>([]);
  const [filteredVideosList, setFilteredVideosList] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>();
  const [monitorsList, setMonitorsList] = useState<Monitor[]>([]);
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor>(monitors[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounce = useDebounce();

  useEffect(() => {
    const allMonitor = { name: "All", id: "all" };
    setVideosList(videos);
    setMonitorsList([allMonitor, ...monitors]);
    setSelectedMonitor(allMonitor);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!selectedVideo) return;

    setIsDrawerOpen(false);
  }, [selectedVideo]);

  useEffect(() => {    
    if (selectedMonitor.id === "all") {
      setFilteredVideosList(videosList);
    } else {
      setFilteredVideosList(videosList.filter((video) => video.mid === selectedMonitor.id));
    }
  }, [videosList, selectedMonitor])

  async function fetchDataOnScroll(e: React.SyntheticEvent<HTMLDivElement>) {
    if (isLoading) return;

    const div = e.target as HTMLDivElement;
    const scrollHeight = div.scrollHeight;
    const height = div.clientHeight;
    const scrollPosition = div.scrollTop;
    const scrollTreshold = scrollHeight - 1.1 * height;

    if (scrollPosition < scrollTreshold) return;

    setIsLoading(true);
    const lastVideoTime = videosList[videosList.length - 1].timestamp;

    // This tells shinobi backend to get videos before start time (default behavior is after)
    const searchParams = new URLSearchParams({
      start: getDateTime(lastVideoTime),
      startOperator: "<",
    });

    const response = await fetch(`/api/videos?${searchParams}`);

    if (response.ok) {
      const newVideos = await response.json();
      setVideosList([...videosList, ...newVideos]);
    }
    setIsLoading(false);
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
          sections={[
            {
              label: selectedMonitor.name,
              node: (
                <RecordingsList
                  videosList={filteredVideosList}
                  selectedVideo={selectedVideo}
                  setSelectedVideo={setSelectedVideo}
                  onScroll={onScrollHandler}
                  isLoading={isLoading}
                />
              ),
            },
            {
              label: "Filters",
              node: (
                <SourceSelector
                  monitors={monitorsList}
                  selectedMonitor={selectedMonitor}
                  setSelectedMonitor={setSelectedMonitor}
                />
              ),
            },
          ]}
          isOpen={isDrawerOpen}
          toggleCarouselDrawer={toggleCarouselDrawer}
        />
      </main>
    </div>
  );
}

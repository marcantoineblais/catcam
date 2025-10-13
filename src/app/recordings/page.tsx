"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import VideoPlayer from "../../components/video/VideoPlayer";
import RecordingsList from "./RecordingsList";
import { Monitor } from "@/src/models/monitor";
import SourceSelector from "@/src/components/SourceSelector";
import { Video } from "@/src/models/video";
import Carousel from "@/src/components/carousel/Carousel";
import { getDateTime } from "@/src/libs/formatDate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { useSession } from "@/src/hooks/useSession";

export default function Recordings() {
  const {
    session: { monitors, videos },
    updateSession,
  } = useSession();

  const [filteredVideosList, setFilteredVideosList] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<any>();
  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | "all">(
    "all"
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nothingToLoad, setNothingToLoad] = useState<boolean>(false);
  const [isCarouselLocked, setIsCarouselLocked] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const monitorsList = useMemo<("all" | Monitor)[]>(() => ["all", ...(monitors || [])], [monitors]);

  useEffect(() => {
    if (!selectedVideo) return;

    setIsDrawerOpen(false);
  }, [selectedVideo]);

  useEffect(() => {
    if (selectedMonitor === "all") {
      setFilteredVideosList(videos);
    } else {
      setFilteredVideosList(
        videos.filter((video) => video.mid === selectedMonitor.id)
      );
    }

    setNothingToLoad(false);
  }, [videos, selectedMonitor]);

  async function fetchDataOnScroll(e: React.SyntheticEvent<HTMLDivElement>) {
    if (isLoading || nothingToLoad) return;

    const div = e.target as HTMLDivElement;
    const scrollHeight = div.scrollHeight;
    const height = div.clientHeight;
    const scrollPosition = div.scrollTop;
    const scrollTreshold = scrollHeight - height * 5;

    if (scrollPosition < scrollTreshold) return;

    setIsLoading(true);
    const lastVideoTime = videos[videos.length - 1].timestamp;

    // This tells shinobi backend to get videos before start time (default behavior is after)
    const searchParams = new URLSearchParams({
      start: getDateTime(lastVideoTime),
      startOperator: "<",
    });

    const response = await fetch(`/api/videos?${searchParams}`);

    if (response.ok) {
      const newVideos = await response.json();

      if (newVideos.length === 0) {
        setNothingToLoad(true);
      } else {
        const updatedVideos = [...videos, ...newVideos];
        updateSession({ videos: updatedVideos });
      }
    }

    setIsLoading(false);
  }

  function toggleCarouselDrawer() {
    setIsDrawerOpen((isOpen) => !isOpen);
  }

  function seekNextVideo(n: number = 1) {
    let index =
      filteredVideosList.findIndex((video) => video === selectedVideo) + n;
    if (index < 0) {
      index = 0;
    }

    if (index >= filteredVideosList.length) {
      index = filteredVideosList.length - 1;
    }

    setSelectedVideo(filteredVideosList[index]);
  }

  async function handleScroll(e: React.SyntheticEvent<HTMLDivElement>) {
    await fetchDataOnScroll(e);
    setIsCarouselLocked(true);
  }

  function handleScrollEnd() {
    setIsCarouselLocked(false);
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
            seekNext={seekNextVideo}
          />
        </div>

        <div className="w-full text-center z-10 bg-gray-100 dark:bg-zinc-900 -mb-2">
          <FontAwesomeIcon
            onClick={() => toggleCarouselDrawer()}
            icon={faAngleUp}
            className="duration-500 cursor-pointer data-active:rotate-180"
            data-active={isDrawerOpen ? true : undefined}
            size="2x"
          />
        </div>

        <Carousel
          isLocked={isCarouselLocked}
          sections={[
            {
              label: selectedMonitor === "all" ? "All" : selectedMonitor.name,
              node: (
                <RecordingsList
                  key={"0"}
                  videosList={filteredVideosList}
                  selectedVideo={selectedVideo}
                  setSelectedVideo={setSelectedVideo}
                  onScroll={handleScroll}
                  onScrollEnd={handleScrollEnd}
                  isLoading={isLoading}
                  nothingToLoad={nothingToLoad}
                />
              ),
            },
            {
              label: "Filters",
              node: (
                <SourceSelector
                  key={"1"}
                  monitors={monitorsList}
                  selectedMonitor={selectedMonitor}
                  setSelectedMonitor={setSelectedMonitor}
                />
              ),
            },
          ]}
        />
      </main>
    </div>
  );
}

"use client";

import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Carousel from "@/src/components/carousel/Carousel";
import CarouselButton from "@/src/components/carousel/CarouselButton";
import SourceSelector from "@/src/components/SourceSelector";
import { useVideoPlayer } from "@/src/components/video/provider/VideoPlayerProvider";
import VideoPlayer from "@/src/components/video/VideoPlayer";
import { useSession } from "@/src/hooks/useSession";
import { filterNewVideos } from "@/src/libs/filter-new-videos";
import { getDateTime } from "@/src/libs/formatDate";
import { Monitor } from "@/src/models/monitor";

import RecordingsList from "./RecordingsList";

export default function Recordings() {
  const {
    session: { monitors, videos },
    updateSession,
  } = useSession();

  const { currentVideo, setQueue } = useVideoPlayer();

  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(
    null,
  );
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nothingToLoad, setNothingToLoad] = useState<boolean>(false);
  const [isCarouselLocked, setIsCarouselLocked] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const monitorsList = useMemo<(null | Monitor)[]>(
    () => [null, ...(monitors || [])],
    [monitors],
  );

  useEffect(() => {
    if (!currentVideo) return;

    startTransition(() => setIsDrawerOpen(false));
  }, [currentVideo]);

  useEffect(() => {
    startTransition(() => {
      if (selectedMonitor === null) {
        setQueue(videos);
      } else {
        setQueue(
          videos.filter((video) => video.mid === selectedMonitor.id),
        );
      }

      setNothingToLoad(false);
    });
  }, [videos, selectedMonitor, setQueue]);

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
      start: getDateTime(lastVideoTime!),
      startOperator: "<",
    });

    const response = await fetch(`/api/videos?${searchParams}`);

    if (response.ok) {
      const newVideos = await response.json();
      if (newVideos.length === 0) {
        setNothingToLoad(true);
      } else {
        updateSession((prev) => ({
          videos: filterNewVideos([...prev.videos, ...newVideos]),
        }));
      }
    }

    setIsLoading(false);
  }

  function toggleCarouselDrawer() {
    setIsDrawerOpen((isOpen) => !isOpen);
  }

  async function handleScroll(e: React.SyntheticEvent<HTMLDivElement>) {
    await fetchDataOnScroll(e);
    setIsCarouselLocked(true);
  }

  function handleScrollEnd() {
    setIsCarouselLocked(false);
  }

  return (
    <main className="grow p-1 container mx-auto max-w-4xl flex flex-col overflow-hidden">
      <div
        ref={containerRef}
        data-close={isDrawerOpen || undefined}
        className="w-full max-h-full duration-1000 data-close:max-h-0 data-close:landscape:max-h-full data-close:lg:landscape:max-h-0 data-close:landscape:duration-0 data-close:landscape:lg:duration-1000"
      >
        <VideoPlayer />
      </div>

      <div className="w-full text-center z-10 bg-gray-100 dark:bg-zinc-900 -mb-2">
        <FontAwesomeIcon
          onClick={() => toggleCarouselDrawer()}
          icon={faAngleUp}
          className="duration-500 cursor-pointer data-active:rotate-180"
          data-active={isDrawerOpen || undefined}
          size="2x"
        />
      </div>

      <Carousel
        className="flex w-full h-full overflow-hidden"
        isLocked={isCarouselLocked}
        selectors={({
          selectedIndex,
          selectIndex,
        }: {
          selectedIndex: number;
          selectIndex: (index: number) => void;
        }) => (
          <>
            <CarouselButton
              onClick={() => selectIndex(0)}
              align="left"
              disabled={selectedIndex === 0}
            >
              {selectedMonitor === null ? "All" : selectedMonitor.name}
            </CarouselButton>

            <CarouselButton
              onClick={() => selectIndex(1)}
              align="right"
              disabled={selectedIndex === 1}
            >
              Filters
            </CarouselButton>
          </>
        )}
      >
        <RecordingsList
          key={"0"}
          onScroll={handleScroll}
          onScrollEnd={handleScrollEnd}
          isLoading={isLoading}
          nothingToLoad={nothingToLoad}
        />
        <SourceSelector
          key={"1"}
          monitors={monitorsList}
          selectedMonitor={selectedMonitor}
          setSelectedMonitor={setSelectedMonitor}
        />
      </Carousel>
    </main>
  );
}

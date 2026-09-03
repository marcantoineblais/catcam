"use client";

import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import React, {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import Carousel from "@/components/carousel/Carousel";
import CarouselButton from "@/components/carousel/CarouselButton";
import Container from "@/components/Container";
import SourceSelector from "@/components/SourceSelector";
import IconButton from "@/components/ui/IconButton";
import { useVideoPlayer } from "@/components/video/provider/VideoPlayerProvider";
import VideoPlayer from "@/components/video/VideoPlayer";
import { useSession } from "@/hooks/useSession";
import { filterNewVideos } from "@/libs/filter-new-videos";
import { getDateTime } from "@/libs/formatDate";
import { Monitor } from "@/models/monitor";

import RecordingsList from "./RecordingsList";

export default function Recordings() {
  const {
    session: { monitors, videos },
    updateSession,
  } = useSession();

  const { currentVideo, setQueue } = useVideoPlayer();

  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [nothingToLoad, setNothingToLoad] = useState<boolean>(false);
  const [isCarouselLocked, setIsCarouselLocked] = useState<boolean>(false);
  const [containerHeight, setContainerHeight] = useState<number>();

  const containerRef = useRef<HTMLDivElement>(null);
  const monitorsList = useMemo<(null | Monitor)[]>(
    () => [null, ...(monitors || [])],
    [monitors],
  );

  // Close the drawer when a video is selected
  useEffect(() => {
    if (!currentVideo) return;

    startTransition(() => setIsDrawerOpen(false));
  }, [currentVideo]);

  // Calculate the height of the container to manage drawer animation
  useEffect(() => {
    if (isDrawerOpen) {
      startTransition(() => setContainerHeight(0));
      return;
    }

    const resize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = (width * 9) / 16; // Maintain a 16:9 aspect ratio
      startTransition(() => setContainerHeight(height));
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [isDrawerOpen]);

  useEffect(() => {
    startTransition(() => {
      if (selectedMonitor === null) {
        setQueue(videos);
      } else {
        setQueue(videos.filter((video) => video.mid === selectedMonitor.id));
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
    <Container className="flex min-h-192 flex-1 flex-col">
      <div
        ref={containerRef}
        data-hidden={isDrawerOpen || undefined}
        className="mb-2 w-full duration-500 rounded-soft shadow-shadow ease-in-out data-hidden:mb-0"
        style={{ height: containerHeight }}
      >
        <VideoPlayer />
      </div>

      <div className="z-10 min-h-0 flex-1 flex flex-col w-full overflow-hidden bg-surface-card rounded-soft shadow-shadow">
        <div className="pt-2 shrink-0 w-full flex justify-center items-center">
          <IconButton
            onClick={() => toggleCarouselDrawer()}
            icon={faAngleUp}
            ariaLabel="Open videos"
            className="cursor-pointer data-active:rotate-180 delay-300"
            data-active={isDrawerOpen || undefined}
            size="2x"
          />
        </div>

        <Carousel
          className="min-h-0 grow"
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
      </div>
    </Container>
  );
}

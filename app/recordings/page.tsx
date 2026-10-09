"use client";

import {
  faAngleUp,
  faClock,
  faFilm,
  faSliders,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { format } from "date-fns";
import { startTransition, useEffect, useMemo, useRef, useState } from "react";
import { twJoin } from "tailwind-merge";

import Carousel from "@/components/carousel/Carousel";
import CarouselButton from "@/components/carousel/CarouselButton";
import Container from "@/components/Container";
import SourceSelector from "@/components/SourceSelector";
import TimeRangeFilter, { TimeRange } from "@/components/TimeRangeFilter";
import { useVideoPlayer } from "@/components/video/provider/VideoPlayerProvider";
import VideoPlayer from "@/components/video/VideoPlayer";
import { useSession } from "@/hooks/useSession";
import { filterNewVideos } from "@/libs/filter-new-videos";
import { getDateTime } from "@/libs/formatDate";
import { Monitor } from "@/models/monitor";
import { Video } from "@/models/video";

import RecordingsList from "./RecordingsList";

/** "yyyy-MM-ddTHH:mm" (datetime-local) -> "yyyy-MM-ddTHH:mm:ss" (Shinobi) */
function toShinobiTime(value: string) {
  return value.length === 16 ? `${value}:00` : value;
}

/**
 * Shinobi filters `time >= start` and `end <= end`. When paginating inside a
 * range we move the `end` bound to the oldest loaded video so we only get
 * older recordings, while keeping the original `start` bound.
 */
function getRangeSearchParams(range: TimeRange, olderThan?: Date) {
  const params = new URLSearchParams();

  if (range.start) {
    params.set("start", toShinobiTime(range.start));
    params.set("startOperator", ">=");
  }

  if (olderThan) {
    params.set("end", getDateTime(olderThan));
    params.set("endOperator", "<");
  } else if (range.end) {
    params.set("end", toShinobiTime(range.end));
    params.set("endOperator", "<=");
  }

  return params;
}

function formatRangeLabel(range: TimeRange) {
  const fmt = (value: string) => format(new Date(value), "dd-MM-yyyy HH:mm");
  const start = range.start ? fmt(range.start) : "Beginning";
  const end = range.end ? fmt(range.end) : "Now";
  return `${start} → ${end}`;
}

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
  const [appliedRange, setAppliedRange] = useState<TimeRange | null>(null);
  const [rangeVideos, setRangeVideos] = useState<Video[]>([]);
  const rangeRequestId = useRef(0);
  const selectTabRef = useRef<((index: number) => void) | null>(null);

  // Videos currently browsed: the live session list, or the time range results
  const sourceVideos = appliedRange ? rangeVideos : videos;

  const monitorsList = useMemo<(null | Monitor)[]>(
    () => [null, ...(monitors || [])],
    [monitors],
  );

  // Close the drawer when a video is selected
  useEffect(() => {
    if (!currentVideo) return;

    startTransition(() => setIsDrawerOpen(false));
  }, [currentVideo]);

  useEffect(() => {
    startTransition(() => {
      if (selectedMonitor === null) {
        setQueue(sourceVideos);
      } else {
        setQueue(
          sourceVideos.filter((video) => video.mid === selectedMonitor.id),
        );
      }
    });
  }, [sourceVideos, selectedMonitor, setQueue]);

  useEffect(() => {
    startTransition(() => setNothingToLoad(false));
  }, [selectedMonitor, appliedRange]);

  async function applyRange(range: TimeRange) {
    const requestId = ++rangeRequestId.current;

    setAppliedRange(range);
    setRangeVideos([]);
    setIsLoading(true);
    selectTabRef.current?.(0);

    try {
      const response = await fetch(
        `/api/videos?${getRangeSearchParams(range)}`,
      );
      if (!response.ok) throw new Error(response.statusText);

      const newVideos = await response.json();
      if (requestId !== rangeRequestId.current) return;

      setRangeVideos(filterNewVideos(newVideos));
      setNothingToLoad(newVideos.length === 0);
    } catch (error) {
      console.error("[Recordings] Failed to fetch time range:", error);
      if (requestId === rangeRequestId.current) setNothingToLoad(true);
    } finally {
      if (requestId === rangeRequestId.current) setIsLoading(false);
    }
  }

  function clearRange() {
    rangeRequestId.current++;
    setAppliedRange(null);
    setRangeVideos([]);
    setIsLoading(false);
  }

  async function fetchDataOnScroll(e: React.SyntheticEvent<HTMLDivElement>) {
    if (isLoading || nothingToLoad) return;

    const div = e.target as HTMLDivElement;
    const scrollHeight = div.scrollHeight;
    const height = div.clientHeight;
    const scrollPosition = div.scrollTop;
    const scrollTreshold = scrollHeight - height * 5;

    if (scrollPosition < scrollTreshold) return;

    const lastVideoTime = sourceVideos[sourceVideos.length - 1]?.timestamp;
    if (!lastVideoTime) return;

    setIsLoading(true);
    const range = appliedRange;
    const requestId = rangeRequestId.current;

    // Without a range: ask shinobi for videos before the oldest one
    // (default behavior is after). With a range: keep its start bound.
    const searchParams = range
      ? getRangeSearchParams(range, new Date(lastVideoTime))
      : new URLSearchParams({
          start: getDateTime(lastVideoTime),
          startOperator: "<",
        });

    const response = await fetch(`/api/videos?${searchParams}`);

    if (response.ok && requestId === rangeRequestId.current) {
      const newVideos = await response.json();
      if (newVideos.length === 0) {
        setNothingToLoad(true);
      } else if (range) {
        setRangeVideos((prev) => filterNewVideos([...prev, ...newVideos]));
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
        data-hidden={isDrawerOpen || undefined}
        className={twJoin(
          "grid grid-rows-[1fr] mb-4 w-full duration-500 rounded-card shadow-shadow ease-in-out",
          "data-hidden:mb-0 data-hidden:grid-rows-[0fr]",
        )}
      >
        <VideoPlayer />
      </div>

      <div className="z-10 min-h-0 flex-1 flex flex-col w-full overflow-hidden card">
        <div className="pt-1.5 pb-2 shrink-0 w-full flex justify-center items-center">
          <button
            type="button"
            onClick={() => toggleCarouselDrawer()}
            aria-label={isDrawerOpen ? "Show player" : "Expand videos"}
            aria-expanded={isDrawerOpen}
            data-active={isDrawerOpen || undefined}
            className="group/drawer flex flex-col items-center gap-1 px-6 pt-1.5 pb-1 rounded-full text-muted cursor-pointer transition-colors duration-200 hover:text-text focus-visible:outline-2 focus-visible:outline-primary"
          >
            <span className="h-1 w-10 rounded-full bg-text/15 transition-colors group-hover/drawer:bg-text/30" />
            <FontAwesomeIcon
              icon={faAngleUp}
              className="text-xs transition-transform duration-500 delay-150 group-data-active/drawer:rotate-180"
            />
          </button>
        </div>

        {appliedRange && (
          <div className="mx-3 md:mx-4 mb-2 flex justify-center">
            <div className="inline-flex max-w-full items-center gap-2 rounded-full bg-primary/10 py-1 pl-3 pr-1 text-xs font-medium text-primary">
              <FontAwesomeIcon icon={faClock} />
              <span className="truncate tabular-nums">
                {formatRangeLabel(appliedRange)}
              </span>
              <button
                type="button"
                onClick={clearRange}
                aria-label="Clear time range"
                className="grid size-6 shrink-0 place-items-center rounded-full cursor-pointer transition-colors hover:bg-primary/15"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>
          </div>
        )}

        <Carousel
          className="min-h-0 grow"
          isLocked={isCarouselLocked}
          selectors={({
            selectedIndex,
            selectIndex,
          }: {
            selectedIndex: number;
            selectIndex: (index: number) => void;
          }) => {
            selectTabRef.current = selectIndex;
            return (
              <>
                <CarouselButton
                  onClick={() => selectIndex(0)}
                  align="left"
                  disabled={selectedIndex === 0}
                >
                  <FontAwesomeIcon
                    icon={faFilm}
                    className="text-xs opacity-70"
                  />
                  <span className="truncate">
                    {selectedMonitor === null
                      ? "All cameras"
                      : selectedMonitor.name}
                  </span>
                </CarouselButton>

                <CarouselButton
                  onClick={() => selectIndex(1)}
                  align="right"
                  disabled={selectedIndex === 1}
                >
                  <FontAwesomeIcon
                    icon={faSliders}
                    className="text-xs opacity-70"
                  />
                  <span className="truncate">Filters</span>
                  {appliedRange && (
                    <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                  )}
                </CarouselButton>
              </>
            );
          }}
        >
          <RecordingsList
            key={"0"}
            onScroll={handleScroll}
            onScrollEnd={handleScrollEnd}
            isLoading={isLoading}
            nothingToLoad={nothingToLoad}
            emptyMessage={
              appliedRange ? "No recordings in this time range" : undefined
            }
          />
          <div
            key={"1"}
            className="w-full h-full overflow-y-auto px-3 pt-1 pb-4 md:px-4"
          >
            <SourceSelector
              monitors={monitorsList}
              selectedMonitor={selectedMonitor}
              setSelectedMonitor={setSelectedMonitor}
            />
            <TimeRangeFilter
              appliedRange={appliedRange}
              onApply={applyRange}
              onClear={clearRange}
            />
          </div>
        </Carousel>
      </div>
    </Container>
  );
}

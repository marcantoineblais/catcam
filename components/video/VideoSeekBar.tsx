"use client";

import { useCallback, useMemo, useRef } from "react";

import useDebounce from "@/hooks/useDebounce";

import { useVideoPlayer } from "./provider/VideoPlayerProvider";

export default function VideoSeekBar() {
  const { currentTime, buffer, duration, isPlaying, play, pause, seek } =
    useVideoPlayer();

  const seekingBarRef = useRef<HTMLDivElement>(null);
  const wasPlayingRef = useRef(false);
  const debounce = useDebounce();

  const seekingPosition = useMemo(() => {
    if (!duration) return 0;
    return Math.min((currentTime / duration) * 100, 100);
  }, [currentTime, duration]);

  const bufferPosition = useMemo(() => {
    if (!duration) return 0;
    return Math.min((buffer / duration) * 100, 100);
  }, [buffer, duration]);

  const updateCurrentTime = useCallback(
    (pageX: number) => {
      return debounce(() => {
        const seekingBar = seekingBarRef.current;

        if (!seekingBar || !duration) return null;
        const bounds = seekingBar.getBoundingClientRect();
        const position = Math.max(bounds.left, Math.min(pageX, bounds.right));
        const ratio = (position - bounds.left) / bounds.width;
        const newTime = Math.max(0, Math.min(ratio * duration, duration));
        seek(newTime);

        return newTime;
      }, 20);
    },
    [debounce, duration, seek],
  );

  const handleStartSeeking = useCallback(
    (
      event:
        | React.MouseEvent<HTMLDivElement>
        | React.TouchEvent<HTMLDivElement>,
    ) => {
      event.stopPropagation();
      let lastUpdatedTime: number | null = null;
      wasPlayingRef.current = isPlaying;

      if (isPlaying) {
        pause();
      }

      let pageX: number;

      if ("touches" in event) {
        if (event.touches.length !== 1) return;

        pageX = event.touches[0].pageX;
      } else {
        pageX = event.pageX;
      }

      const value = updateCurrentTime(pageX);
      lastUpdatedTime = value ?? lastUpdatedTime;

      const handleSeeking = (event: MouseEvent | TouchEvent) => {
        event.preventDefault();

        let pageX: number;

        if ("touches" in event) {
          if (event.touches.length !== 1) return;

          pageX = event.touches[0].pageX;
        } else {
          pageX = event.pageX;
        }

        const value = updateCurrentTime(pageX);
        lastUpdatedTime = value ?? lastUpdatedTime;
      };

      const handleEnd = async () => {
        document.removeEventListener("mousemove", handleSeeking);
        document.removeEventListener("touchmove", handleSeeking);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchend", handleEnd);

        if (
          wasPlayingRef.current &&
          lastUpdatedTime !== duration // Don't resume playing if the user seeks to the end of the video
        ) {
          await play();
        }

        wasPlayingRef.current = false;
      };

      document.addEventListener("mousemove", handleSeeking);
      document.addEventListener("touchmove", handleSeeking, {
        passive: false,
      });
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchend", handleEnd);
    },
    [isPlaying, pause, play, updateCurrentTime, duration],
  );

  return (
    <div className="pt-5 pb-3 w-full flex justify-center">
      <div
        ref={seekingBarRef}
        className="h-1.5 w-full relative bg-secondary rounded-soft cursor-pointer"
        onMouseDown={handleStartSeeking}
        onTouchStart={handleStartSeeking}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="absolute inset-y-0 left-0 bg-primary-foreground/25 rounded-soft"
          style={{ width: `${bufferPosition}%` }}
        />

        <div
          className="absolute inset-y-0 left-0 bg-primary rounded-soft"
          style={{ width: `${seekingPosition}%` }}
        />

        {duration && (
          <div
            className="absolute size-7 -ms-1.5 -top-2.75 -translate-x-2 bg-primary-foreground rounded-full"
            style={{ left: `${seekingPosition}%` }}
          />
        )}
      </div>
    </div>
  );
}

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
        React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
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
    <div
      className="group/seek pt-1 pb-0.5 w-full flex justify-center cursor-pointer touch-none"
      onMouseDown={handleStartSeeking}
      onTouchStart={handleStartSeeking}
      onClick={(event) => event.stopPropagation()}
    >
      <div className="w-full py-2.5">
        <div
          ref={seekingBarRef}
          className="h-1 w-full relative bg-white/25 rounded-full transition-[height] duration-200 group-hover/seek:h-1.5"
        >
          <div
            className="absolute inset-y-0 left-0 bg-white/35 rounded-full"
            style={{ width: `${bufferPosition}%` }}
          />

          <div
            className="absolute inset-y-0 left-0 bg-primary rounded-full"
            style={{ width: `${seekingPosition}%` }}
          />

          {duration > 0 && (
            <div
              className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full shadow-[0_0_0_4px_color-mix(in_oklab,var(--color-primary)_40%,transparent)] transition-transform duration-200 scale-90 group-hover/seek:scale-110"
              style={{ left: `${seekingPosition}%` }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

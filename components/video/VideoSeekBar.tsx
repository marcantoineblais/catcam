"use client";

import { useCallback, useRef } from "react";

import useDebounce from "@/hooks/useDebounce";

import { useVideoPlayer } from "./provider/VideoPlayerProvider";

export default function VideoSeekBar() {
  const {
    currentTime,
    buffer,
    duration,
    isPlaying,
    play,
    pause,
    seek,
  } = useVideoPlayer();

  const seekingBarRef = useRef<HTMLDivElement>(null);
  const wasPlayingRef = useRef(false);
  const debounce = useDebounce();

  const seekingPosition = duration
    ? Math.min((currentTime / duration) * 100, 100)
    : 0;

  const bufferPosition = duration
    ? Math.min((buffer / duration) * 100, 100)
    : 0;

  const updateCurrentTime = useCallback(
    (pageX: number) => {
      debounce(() => {
        const seekingBar = seekingBarRef.current;

        if (!seekingBar || !duration) return;

        const bounds = seekingBar.getBoundingClientRect();

        const position = Math.max(
          bounds.left,
          Math.min(pageX, bounds.right),
        );

        const ratio = (position - bounds.left) / bounds.width;

        seek(ratio * duration);
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

      updateCurrentTime(pageX);

      function handleSeeking(event: MouseEvent | TouchEvent) {
        event.preventDefault();

        let pageX: number;

        if ("touches" in event) {
          if (event.touches.length !== 1) return;

          pageX = event.touches[0].pageX;
        } else {
          pageX = event.pageX;
        }

        updateCurrentTime(pageX);
      }

      async function handleEnd() {
        document.removeEventListener("mousemove", handleSeeking);
        document.removeEventListener("touchmove", handleSeeking);
        document.removeEventListener("mouseup", handleEnd);
        document.removeEventListener("touchend", handleEnd);

        if (wasPlayingRef.current) {
          await play();
        }

        wasPlayingRef.current = false;
      }

      document.addEventListener("mousemove", handleSeeking);
      document.addEventListener("touchmove", handleSeeking, {
        passive: false,
      });
      document.addEventListener("mouseup", handleEnd);
      document.addEventListener("touchend", handleEnd);
    },
    [isPlaying, pause, play, updateCurrentTime],
  );

  return (
    <div className="pt-5 pb-3 w-full flex justify-center">
      <div
        ref={seekingBarRef}
        className="h-1.5 w-full relative bg-gray-800 rounded cursor-pointer dark:bg-zinc-800"
        onMouseDown={handleStartSeeking}
        onTouchStart={handleStartSeeking}
        onClick={(event) => event.stopPropagation()}
      >
        <div
          className="absolute inset-y-0 left-0 bg-gray-500 rounded dark:bg-zinc-500"
          style={{ width: `${bufferPosition}%` }}
        />

        <div
          className="absolute inset-y-0 left-0 bg-sky-700 rounded"
          style={{ width: `${seekingPosition}%` }}
        />

        {!!duration && (
          <div
            className="absolute size-7 -ms-1.5 -top-2.75 -translate-x-2 bg-gray-100 rounded-full dark:bg-zinc-200"
            style={{ left: `${seekingPosition}%` }}
          />
        )}
      </div>
    </div>
  );
}
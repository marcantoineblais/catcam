"use client";

import {
  faBackwardStep,
  faExpand,
  faForwardStep,
  faPause,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";
import { twMerge } from "tailwind-merge";

import { formatVideoTime } from "./libs/videoPlayerUtils";
import { useVideoPlayer } from "./provider/VideoPlayerProvider";

const controlButtonClasses =
  "inline-flex size-10 items-center justify-center rounded-full cursor-pointer transition-[background-color,transform] duration-200 hover:bg-white/15 active:scale-90 focus-visible:outline-2 focus-visible:outline-white/70";

export default function VideoPlayerControls() {
  const {
    currentVideo,
    currentTime,
    duration,
    isPlaying,
    play,
    pause,
    seek,
    next,
    previous,
    toggleFullscreen,
  } = useVideoPlayer();

  const isLive = currentVideo?.isLiveStream ?? false;
  const isStreamOnline = currentVideo?.isStreamOnline ?? true;

  const handlePrevious = useCallback(() => {
    if (currentTime >= 2) {
      seek(0);
      return;
    }

    previous();
  }, [currentTime, previous, seek]);

  const handlePlay = useCallback(async () => {
    await play();
  }, [play]);

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleNext = useCallback(() => {
    next();
  }, [next]);

  return (
    <div className="w-full py-1 flex justify-between items-center grow">
      <div>
        {isLive ? (
          <div
            className="group/live inline-flex items-center gap-2 h-7 px-3 rounded-full bg-danger text-xs font-bold tracking-widest data-[online=false]:bg-white/15"
            data-online={isStreamOnline}
          >
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full rounded-full bg-white opacity-75 animate-ping group-data-[online=false]/live:hidden" />
              <span className="relative inline-flex size-2 rounded-full bg-white group-data-[online=false]/live:bg-danger" />
            </span>
            <span>{isStreamOnline ? "LIVE" : "OFFLINE"}</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 md:gap-4">
            <div className="flex items-center gap-0.5">
              <button
                type="button"
                aria-label="Previous"
                onClick={handlePrevious}
                className={controlButtonClasses}
              >
                <FontAwesomeIcon icon={faBackwardStep} size="lg" />
              </button>

              {isPlaying ? (
                <button
                  type="button"
                  aria-label="Pause"
                  onClick={handlePause}
                  className={twMerge(
                    controlButtonClasses,
                    "size-11 bg-white/10",
                  )}
                >
                  <FontAwesomeIcon icon={faPause} size="lg" />
                </button>
              ) : (
                <button
                  type="button"
                  aria-label="Play"
                  onClick={handlePlay}
                  className={twMerge(
                    controlButtonClasses,
                    "size-11 bg-white/10",
                  )}
                >
                  <FontAwesomeIcon icon={faPlay} size="lg" />
                </button>
              )}

              <button
                type="button"
                aria-label="Next"
                onClick={handleNext}
                className={controlButtonClasses}
              >
                <FontAwesomeIcon icon={faForwardStep} size="lg" />
              </button>
            </div>

            <div className="flex items-center gap-1 text-xs md:text-sm font-medium tabular-nums">
              <span>{formatVideoTime(currentTime)}</span>
              <span className="text-white/50">/</span>
              <span className="text-white/70">{formatVideoTime(duration)}</span>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label="Toggle fullscreen"
        onClick={toggleFullscreen}
        className={controlButtonClasses}
      >
        <FontAwesomeIcon icon={faExpand} size="lg" />
      </button>
    </div>
  );
}

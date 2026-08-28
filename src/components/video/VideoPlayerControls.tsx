"use client";

import {
  faBackwardStep,
  faExpand,
  faForwardStep,
  faPause,
  faPlay,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useCallback } from "react";

import { formatVideoTime } from "./libs/videoPlayerUtils";
import { useVideoPlayer } from "./provider/VideoPlayerProvider";

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
    <div className="w-full py-1.5 flex justify-between items-center grow">
      <div>
        {isLive ? (
          <div
            className="relative grow animate-pulse data-[online=false]:text-red-700"
            data-online={isStreamOnline}
          >
            <FontAwesomeIcon icon={faVideo} className="pe-1" size="xl" />
            <span>LIVE</span>
          </div>
        ) : (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handlePrevious}
                className="cursor-pointer hover:brightness-75"
              >
                <FontAwesomeIcon icon={faBackwardStep} size="xl" />
              </button>

              {isPlaying ? (
                <button
                  type="button"
                  onClick={handlePause}
                  className="cursor-pointer hover:brightness-75 px-[1.7px]"
                >
                  <FontAwesomeIcon icon={faPause} size="xl" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handlePlay}
                  className="cursor-pointer hover:brightness-75"
                >
                  <FontAwesomeIcon icon={faPlay} size="xl" />
                </button>
              )}

              <button
                type="button"
                onClick={handleNext}
                className="cursor-pointer hover:brightness-75"
              >
                <FontAwesomeIcon icon={faForwardStep} size="xl" />
              </button>
            </div>

            <div className="flex items-center font-mono text-lg text-center gap-1">
              <span>{formatVideoTime(currentTime)}</span>
              <span>/</span>
              <span>{formatVideoTime(duration)}</span>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={toggleFullscreen}
        className="cursor-pointer hover:brightness-75"
      >
        <FontAwesomeIcon icon={faExpand} size="xl" />
      </button>
    </div>
  );
}

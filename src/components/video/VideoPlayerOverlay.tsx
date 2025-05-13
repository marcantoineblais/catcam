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
import { resolve } from "path";
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";

export default function VideoPlayerOverlay({
  currentTime = 0,
  buffer = 0,
  duration = 0,
  title = "",
  isLive = false,
  isPlaying = false,
  isLoaded = false,
  setCurrentTime = () => {},
  videoSource = "",
  videoRef,
  isFullscreen = false,
  toggleFullscreen,
}: {
  currentTime?: number;
  buffer?: number;
  duration?: number;
  title?: string;
  isLive?: boolean;
  isPlaying?: boolean;
  isLoaded?: boolean;
  setCurrentTime?: Function;
  videoSource?: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isFullscreen?: boolean;
  toggleFullscreen: MouseEventHandler;
}) {
  const [updatedTime, setUpdatedTime] = useState<number | null>(null);
  const [isCurrentlyPlaying, setIsCurrentlyPlaying] = useState<boolean>(false);
  const [isSeeking, setIsSeeking] = useState<boolean>(false);
  const [displayedTime, setDisplayedTime] = useState<number | null>(null);
  const [timeoutTime, setTimeoutTime] = useState<number>(0);
  const seekingBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoSource && !isLive) setTimeoutTime(1000);
  }, [videoSource, isLive]);

  useEffect(() => {
    if (!isPlaying) setTimeoutTime(1000);
  }, [isPlaying]);

  useEffect(() => {
    if (!timeoutTime || !isPlaying || updatedTime !== null) return;

    const timeout = setTimeout(() => {
      setTimeoutTime(timeoutTime - 1000);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [timeoutTime, updatedTime, isPlaying]);

  useEffect(() => {
    if (updatedTime !== null) {
      setDisplayedTime(updatedTime);
    } else {
      setDisplayedTime(currentTime === undefined ? null : currentTime);
    }
  }, [currentTime, updatedTime]);

  async function pause() {
    return new Promise((resolve, reject) => {
      const video = videoRef.current;
      if (!video) {
        reject("No videos to stop");
      } else {
        video.pause();
        resolve(true);
      }
    });
  }

  function play() {
    return new Promise((resolve, reject) => {
      const video = videoRef.current;
      if (!video) {
        reject("No videos to stop");
      } else {
        video.play();
        resolve(true);
      }
    });
  }

  function updateCurrentTime(position: number) {
    const seekingBar = seekingBarRef.current;
    if (!seekingBar) return 0;

    const bounds = seekingBar.getBoundingClientRect();
    const left = bounds.left;
    const right = bounds.right;
    const width = seekingBar.clientWidth;
    if (position < left) position = left;
    if (position > right) position = right;

    const updatedTime = (position / width) * duration;
    return updatedTime;
  }

  async function handleStartSeeking(
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>,
  ) {
    e.stopPropagation();

    if (isPlaying) {
      try {
        await pause();
      } catch (error) {
        console.error(error);
      }
    }

    let pageX = 0;
    if ("touches" in e && e.touches.length > 0) {
      if (e.touches.length > 1) return;
      pageX = e.touches[0].pageX;
    } else if ("pageX" in e) {
      pageX = e.pageX;
    }

    const updatedTime = updateCurrentTime(pageX);
    setIsCurrentlyPlaying(isPlaying || false);
    setUpdatedTime(updatedTime);
    setIsSeeking(true);

    window.addEventListener("mousemove", handleSeeking);
    window.addEventListener("touchmove", handleSeeking);
    window.addEventListener("mouseup", () => {
      window.removeEventListener("mousemove", handleSeeking);
      handleEndSeeking();
    });
    window.addEventListener("touchend", () => {
      window.removeEventListener("touchmove", handleSeeking);
      handleEndSeeking();
    });
  }

  function handleSeeking(e: TouchEvent | MouseEvent) {
    const video = videoRef.current;
    if (!isSeeking || !video) return;

    e.stopPropagation();
    let pageX = 0;
    if ("touches" in e && e.touches.length > 0) {
      if (e.touches.length > 1) return;
      pageX = e.touches[0].pageX;
    } else if ("pageX" in e) {
      pageX = e.pageX;
    }

    const time = updateCurrentTime(pageX);
    setUpdatedTime(time);
    video.currentTime = time;
  }

  async function handleEndSeeking() {
    const video = videoRef.current;

    if (!video || updatedTime === null) return;
    if (setCurrentTime) setCurrentTime(updatedTime);

    setUpdatedTime(null);
    video.currentTime = updatedTime;

    if (isCurrentlyPlaying) {
      try {
        await play();
      } catch (error) {
        console.error(error);
      }
    }

    setIsSeeking(false);
  }

  function fastSeeking(step: number) {
    if (currentTime === undefined || duration === undefined) return;

    const video = videoRef.current;
    if (!video) return;

    let updatedTime = currentTime + step;
    if (updatedTime < 0) updatedTime = 0;
    else if (updatedTime > duration) updatedTime = duration;

    video.currentTime = updatedTime;
  }

  function touchFastSeeking(e: React.TouchEvent<HTMLDivElement>, step: number) {
    const target = e.currentTarget;
    const removeListener = () => {
      target.removeEventListener("touchstart", seek);
    };
    const timer = setTimeout(removeListener, 200);
    const seek = () => {
      fastSeeking(step);
      removeListener();
      clearTimeout(timer);
    };
    target.addEventListener("touchstart", seek);
  }

  function showOverlay(e: React.TouchEvent | React.MouseEvent) {
    e.stopPropagation();
    setTimeoutTime(3000);
  }

  function renderDurationBar() {
    if (displayedTime === null || duration === undefined) return null;

    return (
      <div
        className="absolute top-0 bottom-0 left-0 bg-sky-700 rounded"
        style={{ width: `${(displayedTime / duration) * 100}%` }}
      ></div>
    );
  }

  function renderBufferBar() {
    if (buffer === undefined || duration === undefined) return null;

    return (
      <div
        className="absolute top-0 bottom-0 left-0 bg-gray-500 rounded dark:bg-zinc-500"
        style={{ width: `${(buffer / duration) * 100}%` }}
      ></div>
    );
  }

  function renderTrackingHead() {
    if (displayedTime === null || !duration) return null;

    return (
      <button
        className="absolute size-7 -top-2.5 -translate-x-2 bg-gray-100 rounded-full cursor-pointer dark:bg-zinc-200"
        style={{ left: `${(displayedTime / duration) * 100}%` }}
      ></button>
    );
  }

  return (
    <div
      className="absolute hidden opacity-0 inset-0 duration-500 md:text-lg text-gray-50 dark:text-zinc-200 data-ready:block data-visible:opacity-100 data-fullscreen:fixed"
      data-ready={isLoaded ? true : undefined}
      data-visible={timeoutTime > 0 ? true : undefined}
      data-fullscreen={isFullscreen ? true : undefined}
      onClick={showOverlay}
      onMouseMove={showOverlay}
      onTouchStart={showOverlay}
    >
      <div
        className="invisible px-5 py-1.5 absolute top-0 left-0 duration-500 bg-gray-950/75 data-visible:visible"
        data-visible={timeoutTime > 0 && title ? true : undefined}
      >
        <h3>{title}</h3>
      </div>
      <div
        className="invisible px-5 py-1.5 absolute bottom-0 left-0 right-0 flex flex-col justify-between items-center duration-500 bg-gray-950/75 data-visible:visible"
        data-visible={timeoutTime > 0 ? true : undefined}
      >
        {!isLive && (
          <div className="pt-5 pb-3 w-full flex justify-center">
            <div
              className="h-2 w-full relative bg-gray-800 rounded cursor-pointer dark:bg-zinc-800"
              onMouseDown={handleStartSeeking}
              onTouchStart={handleStartSeeking}
              ref={seekingBarRef}
            >
              {renderBufferBar()}
              {renderDurationBar()}
              {renderTrackingHead()}
            </div>
          </div>
        )}
        <div className="w-full pt-5 pb-1.5 flex justify-between items-center grow">
          <div>
            {isLive ? (
              <div className="relative grow animate-pulse">
                <FontAwesomeIcon icon={faVideo} className="pe-1" size="xl" />
                <span>LIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-7">
                <div className="flex items-center gap-10">
                  <button className="cursor-pointer">
                    <FontAwesomeIcon
                      icon={faBackwardStep}
                      size="xl"
                      className="hover:opacity-90"
                    />
                  </button>

                  <button
                    className="cursor-pointer w-6"
                    onClick={
                      isPlaying
                        ? async () => await pause()
                        : async () => await play()
                    }
                  >
                    <FontAwesomeIcon
                      icon={isPlaying ? faPause : faPlay}
                      size="xl"
                      className="hover:opacity-90"
                    />
                  </button>

                  <button className="cursor-pointer">
                    <FontAwesomeIcon
                      icon={faForwardStep}
                      size="xl"
                      className="hover:opacity-90"
                    />
                  </button>
                </div>
                <div className="flex items-center font-mono text-center gap-1">
                  {/* ADD CURRENT TIME */}
                  {/* ADD END TIME */}
                </div>
              </div>
            )}
          </div>

          <button onClick={toggleFullscreen}>
            <FontAwesomeIcon
              className="flex items-center cursor-pointer data-disabled:hidden"
              icon={faExpand}
              size="xl"
            />
          </button>
        </div>
      </div>

      {!isLive && (
        <>
          <div
            className="absolute top-0 bottom-27 left-0 w-1/5"
            onDoubleClick={() => fastSeeking(-5)}
            onTouchStart={(e) => touchFastSeeking(e, -5)}
          ></div>
          <div
            className="absolute top-0 bottom-27 right-0 w-1/5"
            onDoubleClick={() => fastSeeking(5)}
            onTouchStart={(e) => touchFastSeeking(e, 5)}
          ></div>
        </>
      )}
    </div>
  );
}

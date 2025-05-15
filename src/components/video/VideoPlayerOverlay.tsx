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
import React, { MouseEventHandler, useEffect, useRef, useState } from "react";

export default function VideoPlayerOverlay({
  currentTime = 0,
  buffer = 0,
  duration = 0,
  title = "",
  isLive = false,
  isPlaying = false,
  isLoaded = false,
  videoSource = "",
  videoRef,
  isFullscreen = false,
  seekNext = () => {},
  toggleFullscreen,
}: {
  currentTime?: number;
  buffer?: number;
  duration?: number;
  title?: string;
  isLive?: boolean;
  isPlaying?: boolean;
  isLoaded?: boolean;
  videoSource?: string;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isFullscreen?: boolean;
  seekNext?: Function;
  toggleFullscreen: MouseEventHandler;
}) {
  const [timeoutTime, setTimeoutTime] = useState<number>(0);
  const [seekingBarPosition, setSeekingBarPosition] = useState<number>(0);
  const isCurrentlyPlaying = useRef<boolean>(isPlaying);
  const seekingBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (videoSource && !isLive) setTimeoutTime(1000);
  }, [videoSource, isLive]);

  useEffect(() => {
    if (!isPlaying) setTimeoutTime(1000);
  }, [isPlaying]);

  useEffect(() => {
    setSeekingBarPosition((currentTime / duration) * 100)
  }, [currentTime, duration])

  useEffect(() => {
    if (!timeoutTime || !isPlaying) return;

    const timeout = setTimeout(() => {
      setTimeoutTime(timeoutTime - 1000);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [timeoutTime, isPlaying]);

  function pause() {
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
    const video = videoRef.current;
    if (!seekingBar || !video) return;

    const bounds = seekingBar.getBoundingClientRect();
    const left = bounds.left;
    const right = bounds.right;
    const width = seekingBar.clientWidth;
    if (position < left) position = left;
    if (position > right) position = right;

    const positionRatio = (position - left) / width;
    const updatedTime = positionRatio * duration; 
    setSeekingBarPosition(positionRatio * 100)
    video.currentTime = updatedTime;
  }

  async function handleStartSeeking(
    e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) {
    e.stopPropagation();
    isCurrentlyPlaying.current = isPlaying;

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

    updateCurrentTime(pageX);

    const removeListeners = () => {
      document.removeEventListener("mousemove", handleSeeking);
      document.removeEventListener("touchmove", handleSeeking);
      document.removeEventListener("touchend", removeListeners);
      document.removeEventListener("mouseup", removeListeners);
      handleEndSeeking();
    };

    document.addEventListener("mousemove", handleSeeking);
    document.addEventListener("touchmove", handleSeeking, { passive: false });
    document.addEventListener("mouseup", removeListeners);
    document.addEventListener("touchend", removeListeners);
  }

  function handleSeeking(e: TouchEvent | MouseEvent) {
    const video = videoRef.current;
    if (!video) return;

    e.preventDefault();
    let pageX = 0;
    if ("touches" in e && e.touches.length > 0) {
      if (e.touches.length > 1) return;
      pageX = e.touches[0].pageX;
    } else if ("pageX" in e) {
      pageX = e.pageX;
    }

    updateCurrentTime(pageX);
  }

  async function handleEndSeeking() {
    if (isCurrentlyPlaying.current) {
      try {
        await play();
      } catch (error) {
        console.error(error);
      }
    }

    isCurrentlyPlaying.current = false;
  }

  function fastSeeking(step: number = 10) {
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

  function seekNextVideo(n: number = 1) {
    const video = videoRef.current;
    if (!video) return;

    if (n < 0 && currentTime < 2) {
      seekNext(n);
    } else if (n < 0) {
      video.currentTime = 0
    } else {
      seekNext(n);
    }
  }

  function showOverlay(e: React.TouchEvent | React.MouseEvent) {
    setTimeoutTime(3000);
  }

  function renderDurationBar() {
    return (
      <div
        className="absolute top-0 bottom-0 left-0 bg-sky-700 rounded"
        style={{ width: `${seekingBarPosition}%` }}
      ></div>
    );
  }

  function renderBufferBar() {    
    return (
      <div
        className="absolute top-0 bottom-0 left-0 bg-gray-500 rounded dark:bg-zinc-500"
        style={{ width: `${seekingBarPosition}%` }}
      ></div>
    );
  }

  function renderTrackingHead() {
    if (currentTime === null || !duration) return null;

    return (
      <button
        className="absolute size-7 -ms-1.5 -top-2.75 -translate-x-2 bg-gray-100 rounded-full cursor-pointer dark:bg-zinc-200"
        style={{ left: `${seekingBarPosition}%` }}
      ></button>
    );
  }

  function renderCurrentTime() {
    const currentMinutes = Math.floor(currentTime / 60);
    const currentSeconds = Math.floor(currentTime % 60);
    const formattedCurrentTime = [currentMinutes, currentSeconds]
      .map((time) => time.toString().padStart(2, "0"))
      .join(":");

    const endMinutes = Math.floor(duration / 60);
    const endSeconds = Math.floor(duration % 60);
    const formattedEndTime = [endMinutes, endSeconds]
      .map((time) => time.toString().padStart(2, "0"))
      .join(":");

    return (
      <>
        <span>{formattedCurrentTime}</span>
        <span>/</span>
        <span>{formattedEndTime}</span>
      </>
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
              className="h-1.5 w-full relative bg-gray-800 rounded cursor-pointer dark:bg-zinc-800"
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
        <div className="w-full py-1.5 flex justify-between items-center grow">
          <div>
            {isLive ? (
              <div className="relative grow animate-pulse">
                <FontAwesomeIcon icon={faVideo} className="pe-1" size="xl" />
                <span>LIVE</span>
              </div>
            ) : (
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <button className="cursor-pointer">
                    <FontAwesomeIcon
                      icon={faBackwardStep}
                      size="xl"
                      className="hover:opacity-90"
                      onClick={() => seekNextVideo(-1)}
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
                      onClick={() => seekNextVideo(1)}
                    />
                  </button>
                </div>

                <div className="flex items-center font-mono text-lg text-center gap-1">
                  {renderCurrentTime()}
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
            onDoubleClick={() => fastSeeking(-10)}
            onTouchStart={(e) => touchFastSeeking(e, -10)}
          ></div>
          <div
            className="absolute top-0 bottom-27 right-0 w-1/5"
            onDoubleClick={() => fastSeeking(10)}
            onTouchStart={(e) => touchFastSeeking(e, 10)}
          ></div>
        </>
      )}
    </div>
  );
}

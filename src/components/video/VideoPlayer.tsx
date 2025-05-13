"use client";

import React, { useEffect, useRef, useState } from "react";
import Hls from "hls.js";
import Logo from "../Logo";
import VideoPlayerOverlay from "./VideoPlayerOverlay";
import Loader from "../Loader";

export default function VideoPlayer({
  title,
  src = "",
  isLiveStream,
}: {
  title?: string;
  src?: string;
  isLiveStream?: boolean;
}) {
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [buffer, setBuffer] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [isBuffering, setIsBuffering] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const toggleFullscreen = () => {
      if (screen.orientation.type.startsWith("landscape") && !isFullscreen)
        setIsFullscreen(true);

      if (screen.orientation.type.startsWith("portrait") && isFullscreen)
        setIsFullscreen(false);
    };

    screen.orientation.addEventListener("change", toggleFullscreen);

    return () => {
      screen.orientation.removeEventListener("change", toggleFullscreen);
    };
  }, [isFullscreen]);

  // Use HLS plugin only when required
  useEffect(() => {
    const video = videoRef.current;

    if (!video || !src) return;

    let hls: Hls;
    if (isLiveStream && Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
    } else {
      video.src = src;
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src, videoRef, isLiveStream]);

  useEffect(() => {
    setIsBuffering(true);
    setIsLoaded(false);
  }, [src])

  function setLastBuffer(e: React.SyntheticEvent<HTMLVideoElement>) {
    const length = e.currentTarget.buffered.length;

    if (length > 0) {
      const lastBuffer = e.currentTarget.buffered.end(length - 1);
      setBuffer(lastBuffer);
    } else {
      setBuffer(0);
    }
  }

  function toggleFullscreen() {
    setIsFullscreen(!!isFullscreen);
  }

  return (
    <div
      className="py-1.5 flex justify-center items-center overflow-hidden data-fullscreen:fixed data-fullscreen:inset-0 data-fullscreen:z-50 data-fullscreen:p-0 data-fullscreen:bg-black"
      data-fullscreen={isFullscreen ? true : undefined}
    >
      <div
        ref={videoContainerRef}
        className="relative aspect-[16/9] w-full flex items-center justify-center rounded overflow-hidden shadow dark:shadow-zinc-50/10"
      >
        {!src && !isLiveStream && (
          <Logo className="absolute inset-0 text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-150" />
        )}

        {src && videoRef.current && isBuffering && (
          <div className="absolute inset-0 flex justify-center items-center">
            <Loader />
          </div>
        )}

        <video
          className="w-full object-fill scale-100 bg-loading bg-no-repeat bg-center"
          ref={videoRef}
          autoPlay
          muted
          playsInline
          controlsList="noremoteplayback nufullscreen nodownload"
          poster=""
          onCanPlay={() => {
            setIsLoaded(true);
            setIsBuffering(false);
          }}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onDurationChange={(e) => setDuration(e.currentTarget.duration)}
          onProgress={setLastBuffer}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          onWaiting={() => setIsBuffering(true)}
        >
          Your browser does not support HTML5 video.
        </video>

        <VideoPlayerOverlay
          title={title}
          isLive={isLiveStream ? true : undefined}
          isPlaying={isPlaying}
          isLoaded={isLoaded}
          currentTime={currentTime}
          duration={duration}
          buffer={buffer}
          setCurrentTime={setCurrentTime}
          videoSource={src}
          videoRef={videoRef}
          isFullscreen={isFullscreen}
          toggleFullscreen={toggleFullscreen}
        />
      </div>
    </div>
  );
}

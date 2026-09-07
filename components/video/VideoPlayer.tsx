"use client";

import { twJoin } from "tailwind-merge";

import Loader from "../Loader";
import Logo from "../Logo";
import { useVideoPlayer } from "./provider/VideoPlayerProvider";
import VideoPlayerOverlay from "./VideoPlayerOverlay";

export default function VideoPlayer() {
  const { currentVideo, videoRef, videoEvents, isBuffering, isFullscreen } =
    useVideoPlayer();

  const src = currentVideo?.src ?? "";
  const isLiveStream = currentVideo?.isLiveStream ?? false;

  return (
    <div
      className="w-full h-fit flex justify-center items-center overflow-hidden data-fullscreen:fixed data-fullscreen:h-full data-fullscreen:inset-0 data-fullscreen:z-50 data-fullscreen:p-0 data-fullscreen:bg-black group/video-player"
      data-fullscreen={isFullscreen || undefined}
    >
      <div
        className={twJoin(
          "relative aspect-video w-full group-data-fullscreen/video-player:h-full flex shrink-0 items-center justify-center rounded-soft overflow-hidden bg-surface-card",
          "group-data-fullscreen/video-player:bg-black group-data-fullscreen/video-player:rounded-none",
        )}
      >
        {!src && !isLiveStream && (
          <Logo className="absolute inset-0 translate-y-1/2 scale-150" />
        )}

        {src && isBuffering && (
          <div className="absolute inset-0 flex justify-center items-center">
            <Loader />
          </div>
        )}
        
        <video
          ref={videoRef}
          className="w-full h-full object-contain scale-100 bg-loading bg-no-repeat bg-center"
          autoPlay
          muted
          playsInline
          controlsList="noremoteplayback nufullscreen nodownload"
          poster=""
          {...videoEvents}
        >
          Your browser does not support HTML5 video.
        </video>

        <VideoPlayerOverlay />
      </div>
    </div>
  );
}

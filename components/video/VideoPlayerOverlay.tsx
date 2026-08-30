"use client";

import useVideoOverlay from "./hooks/useVideoOverlay";
import { useVideoPlayer } from "./provider/VideoPlayerProvider";
import VideoPlayerControls from "./VideoPlayerControls";
import VideoSeekBar from "./VideoSeekBar";

export default function VideoPlayerOverlay() {
  const { currentVideo, isLoaded, isPlaying, isFullscreen } = useVideoPlayer();

  const overlay = useVideoOverlay({
    isLoaded,
    isPlaying,
  });

  const isLive = currentVideo?.isLiveStream ?? false;
  const title = currentVideo?.title ?? "";

  function handleMouseMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") {
      overlay.show();
    }
  }

  return (
    <div
      className="absolute opacity-0 inset-0 duration-500 md:text-lg text-primary-foreground data-visible:opacity-100 data-fullscreen:fixed"
      data-visible={overlay.isVisible || undefined}
      data-fullscreen={isFullscreen || undefined}
      onClick={overlay.toggle}
      onPointerMove={handleMouseMove}
    >
      <div
        className="invisible px-5 py-1.5 absolute top-0 left-0 right-0 duration-500 bg-black/75 data-visible:visible"
        data-visible={overlay.isVisible && title ? true : undefined}
      >
        <h3>{title}</h3>
      </div>

      <div
        className="invisible px-5 py-1.5 absolute bottom-0 left-0 right-0 flex flex-col justify-between items-center duration-500 bg-black/75 data-visible:visible"
        data-visible={overlay.isVisible || undefined}
        onClick={(event) => event.stopPropagation()}
      >
        {!isLive && <VideoSeekBar />}

        <VideoPlayerControls />
      </div>
    </div>
  );
}

"use client";

import { faBackward, faForward } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useDoubleTapSeek from "./hooks/useDoubleTapSeek";
import useVideoOverlay from "./hooks/useVideoOverlay";
import { useVideoPlayer } from "./provider/VideoPlayerProvider";
import VideoPlayerControls from "./VideoPlayerControls";
import VideoSeekBar from "./VideoSeekBar";

export default function VideoPlayerOverlay() {
  const { currentVideo, isLoaded, isPlaying, isFullscreen, videoRef, seek } =
    useVideoPlayer();

  const overlay = useVideoOverlay({
    isLoaded,
    isPlaying,
  });

  const { feedback, handleTap } = useDoubleTapSeek({
    videoRef,
    seek,
    onSingleTap: overlay.toggle,
  });

  const isLive = currentVideo?.isLiveStream ?? false;
  const title = currentVideo?.title ?? "";

  function handleMouseMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType === "mouse") {
      overlay.show();
    }
  }

  return (
    <>
      <div
        className="absolute opacity-0 inset-0 duration-300 text-white data-visible:opacity-100 data-fullscreen:fixed"
        data-visible={overlay.isVisible || undefined}
        data-fullscreen={isFullscreen || undefined}
        onClick={overlay.toggle}
        onPointerMove={handleMouseMove}
      >
        {/* Double tap zones (rendered first so the control bars stay on top) */}
        {!isLive && (
          <>
            <div
              className="absolute inset-y-0 left-0 w-1/3"
              onClick={handleTap("left")}
            />
            <div
              className="absolute inset-y-0 right-0 w-1/3"
              onClick={handleTap("right")}
            />
          </>
        )}

        <div
          className="pointer-events-none invisible px-4 md:px-5 pt-3 pb-10 absolute top-0 inset-x-0 duration-300 bg-linear-to-b from-black/70 to-transparent data-visible:visible"
          data-visible={overlay.isVisible && title ? true : undefined}
        >
          <h3 className="text-sm md:text-base font-semibold tracking-tight drop-shadow">
            {title}
          </h3>
        </div>

        <div
          className="pointer-events-none invisible px-3 md:px-4 pt-12 pb-2 absolute bottom-0 inset-x-0 duration-300 bg-linear-to-t from-black/80 via-black/45 to-transparent data-visible:visible"
          data-visible={overlay.isVisible || undefined}
        >
          {/* Only the controls catch taps; the gradient lets them through */}
          <div
            className="pointer-events-auto w-full flex flex-col justify-between items-center"
            onClick={(event) => event.stopPropagation()}
          >
            {!isLive && <VideoSeekBar />}

            <VideoPlayerControls />
          </div>
        </div>
      </div>

      {/* Seek feedback (outside the fading overlay so it shows on its own) */}
      {feedback && (
        <div
          aria-live="polite"
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          <div
            key={feedback.side}
            data-side={feedback.side}
            className="absolute inset-y-[-15%] w-2/5 flex items-center justify-center bg-white/12 animate-fade data-[side=left]:left-0 data-[side=left]:rounded-r-[50%] data-[side=right]:right-0 data-[side=right]:rounded-l-[50%]"
          >
            <div
              key={feedback.id}
              className="flex flex-col items-center gap-1 rounded-2xl bg-black/45 px-3.5 py-2.5 text-white backdrop-blur-sm animate-pop"
            >
              <FontAwesomeIcon
                icon={feedback.side === "left" ? faBackward : faForward}
                size="lg"
              />
              <span className="text-sm font-semibold tabular-nums">
                {feedback.side === "left" ? "−" : "+"}
                {feedback.amount}s
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

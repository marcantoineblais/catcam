"use client";

import { faCircleCheck, faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

import Loading from "@/components/Loader";
import { useVideoPlayer } from "@/components/video/provider/VideoPlayerProvider";
import IntersectionObserverProvider from "@/hooks/useIntersectionObserver";

import VideoCard from "../../components/VideoCard";

type RecordingsListProps = {
  isLoading?: boolean;
  nothingToLoad?: boolean;
  emptyMessage?: string;
} & React.ComponentProps<"div">;
export default function RecordingsList({
  isLoading = false,
  nothingToLoad = false,
  emptyMessage = "No videos available",
  className,
  onScroll,
  onScrollEnd,
  ...props
}: RecordingsListProps) {
  const { currentVideo, queue: videos, selectVideo } = useVideoPlayer();
  const [container, setContainer] = useState<Element | null>(null);

  if (videos.length === 0 && !isLoading) {
    return (
      <div className="w-full py-12 flex flex-col justify-center items-center gap-3 text-center">
        <span className="grid size-12 place-items-center rounded-2xl bg-text/5 text-muted">
          <FontAwesomeIcon icon={faVideoSlash} size="lg" />
        </span>
        <p className="text-sm text-muted">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <IntersectionObserverProvider root={container}>
      <div
        className={twMerge(
          "w-full h-full flex flex-col items-center overflow-hidden",
          className,
        )}
        {...props}
      >
        <div
          className="relative w-full h-full px-2.5 md:px-3.5 pb-3 flex justify-start content-start flex-wrap overflow-y-auto"
          onScroll={onScroll}
          onScrollEnd={onScrollEnd}
          ref={setContainer}
        >
          {videos.map((video) => {
            const isSelected = video.src === currentVideo?.src;

            return (
              <VideoCard
                key={video.src}
                thumbnail={video.thumbnail}
                timestamp={video.timestamp}
                isSelected={isSelected}
                onClick={() => selectVideo(video)}
              />
            );
          })}

          {nothingToLoad && (
            <div className="w-full py-6 flex justify-center items-center gap-2 text-sm text-muted">
              <FontAwesomeIcon icon={faCircleCheck} />
              <span>You&apos;re all caught up</span>
            </div>
          )}

          {isLoading && (
            <Loading
              className="w-full py-4 flex justify-center items-center"
              size={"md"}
            />
          )}
        </div>
      </div>
    </IntersectionObserverProvider>
  );
}

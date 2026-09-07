"use client";

import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
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
} & React.ComponentProps<"div">;
export default function RecordingsList({
  isLoading = false,
  nothingToLoad = false,
  className,
  onScroll,
  onScrollEnd,
  ...props
}: RecordingsListProps) {
  const { currentVideo, queue: videos, selectVideo } = useVideoPlayer();
  const [container, setContainer] = useState<Element | null>(null);

  if (videos.length === 0 && !isLoading) {
    return (
      <div className="pb-3 w-full flex justify-center items-center">
        No videos available
      </div>
    );
  }

  return (
    <IntersectionObserverProvider root={container}>
      <div
        className={twMerge(
          "pt-1 pb-3 w-full h-full flex flex-col items-center overflow-hidden bg-surface-card",
          className,
        )}
        {...props}
      >
        <div
          className="relative w-full h-full flex justify-start content-start flex-wrap overflow-y-auto"
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
            <div className="w-full flex justify-center items-center gap-1 text-warning">
              <FontAwesomeIcon icon={faCircleXmark} size="lg" />
              <h3 className="text-lg font-bold py-5">
                There is nothing more to show
              </h3>
            </div>
          )}

          {isLoading && (
            <Loading
              className="w-full py-3 flex justify-center items-center"
              size={"lg"}
            />
          )}
        </div>
      </div>
    </IntersectionObserverProvider>
  );
}

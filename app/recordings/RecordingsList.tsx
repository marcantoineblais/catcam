"use client";

import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useRef } from "react";
import { twMerge } from "tailwind-merge";

import Loading from "@/components/Loader";
import { useVideoPlayer } from "@/components/video/provider/VideoPlayerProvider";

import VideoCard from "./VideoCard";

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
  const containerRef = useRef<HTMLDivElement>(null);

  if (videos.length === 0 && !isLoading) {
    return (
      <div className="pb-3 w-full flex justify-center items-center">
        No videos available
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        "pt-1 pb-3 w-full h-full flex flex-col items-center overflow-hidden",
        className,
      )}
      {...props}
    >
      <div
        className="relative w-full h-full flex justify-start content-start flex-wrap overflow-y-auto"
        onScroll={onScroll}
        onScrollEnd={onScrollEnd}
        ref={containerRef}
      >
        {videos.map((video) => {
          const isSelected = video === currentVideo;

          return (
            <VideoCard
              key={video.src}
              thumbnail={video.thumbnail}
              timestamp={video.timestamp}
              isSelected={isSelected}
              onClick={() => selectVideo(video)}
              containerRef={containerRef}
            />
          );
        })}

        {nothingToLoad && (
          <div className="w-full flex justify-center items-center gap-1 text-sky-700">
            <FontAwesomeIcon icon={faCircleXmark} size="lg" />
            <h3 className="text-lg font-bold py-5">
              There is nothing more to show
            </h3>
            <FontAwesomeIcon icon={faCircleXmark} size="lg" />
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
  );
}

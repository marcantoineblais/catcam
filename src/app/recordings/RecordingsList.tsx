"use client";

import React, { Dispatch, useRef } from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/src/models/video";
import Loading from "@/src/components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { twMerge } from "tailwind-merge";

type RecordingsListProps = {
  videos?: Video[];
  selectedVideo?: Video;
  setSelectedVideo?: Dispatch<React.SetStateAction<Video | undefined>>;
  isLoading?: boolean;
  nothingToLoad?: boolean;
} & React.ComponentProps<"div">;
export default function RecordingsList({
  videos = [],
  selectedVideo,
  setSelectedVideo = () => {},
  isLoading = false,
  nothingToLoad = false,
  className,
  onScroll,
  onScrollEnd,
  ...props
}: RecordingsListProps) {
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
          const isSelected = selectedVideo === video;

          return (
            <VideoCard
              key={video.src}
              thumbnail={video.thumbnail}
              timestamp={video.timestamp}
              isSelected={isSelected}
              onClick={() => setSelectedVideo(video)}
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

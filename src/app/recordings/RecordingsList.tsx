"use client";

import React, { Key, ReactNode, useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/src/models/video";
import Loading from "@/src/components/Loading";

export default function RecordingsList({
  videosList = [],
  selectedVideo,
  setSelectedVideo = () => {},
  isLoading = false,
  onScroll = () => {},
}: {
  videosList?: Video[];
  selectedVideo?: Video;
  setSelectedVideo?: Function;
  isLoading?: boolean;
  onScroll?: Function;
}) {
  const [videoCards, setVideoCards] = useState<ReactNode[]>([]);
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVideoCards(
      videosList.map((video) => {
        const key = video.src as Key;
        const isSelected = selectedVideo === video;

        return (
          <VideoCard
            key={key}
            thumbnail={video.thumbnail}
            timestamp={video.timestamp}
            isSelected={isSelected}
            onClick={() => setSelectedVideo(video)}
          />
        );
      })
    );
  }, [videosList, selectedVideo, setSelectedVideo]);

  return (
    <div className="pt-1 pb-3 w-full flex flex-col items-center overflow-hidden">
      <div
        ref={containerRef}
        className="w-full flex-grow flex justify-start content-start flex-wrap overflow-y-auto"
        onScroll={(e) => onScroll(e)}
      >
        {videoCards.length > 0 ? (
          videoCards
        ) : (
          <div className="pb-3 w-full flex justify-center items-center">
            No videos available
          </div>
        )}

        {isLoading && <Loading className="w-full flex justify-center items-center" size={"lg"} />}
      </div>
    </div>
  );
}

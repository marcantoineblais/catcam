"use client";

import React, { Key, ReactNode, useEffect, useState } from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/src/models/video";

export default function RecordingList({
  videosList = [],
  selectedVideo,
  setSelectedVideo,
}: {
  videosList?: Video[];
  selectedVideo?: Video;
  setSelectedVideo: Function;
}) {
  const [videoCards, setVideoCards] = useState<ReactNode[]>([]);
  const [observer, setObserver] = React.useState<IntersectionObserver>();
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
            observer={observer}
          />
        );
      })
    );
  }, [videosList, selectedVideo, setSelectedVideo, observer]);

  useEffect(() => {
    if (!containerRef.current) return;

    function intersectionHandler(entries: IntersectionObserverEntry[]) {
      entries.forEach((entry: IntersectionObserverEntry) => {
        const card = entry.target as HTMLDivElement;
        const ratio = entry.intersectionRatio;

        if (ratio > 50) {
          card.style.opacity = "1";
        } else {
          card.style.opacity = (ratio * 2).toString();
        }
      });
    }

    const threshold = [];
    for (let i = 0; i <= 1; i += 0.05) {
      threshold.push(i);
    }

    const observer = new IntersectionObserver(intersectionHandler, {
      root: containerRef.current,
      threshold: threshold,
    });

    setObserver(observer);

    return () => {
      observer.disconnect();
    };
  }, [videosList]);

  return (
    <div className="pt-1 pb-3 w-full flex flex-col items-center overflow-hidden">
      <div
        ref={containerRef}
        className="w-full flex justify-start content-start flex-wrap overflow-hidden"
      >
        {videoCards.length > 0 ? (
          videoCards
        ) : (
          <div className="w-full h-full flex justify-center items-center">
            No videos available
          </div>
        )}
      </div>
    </div>
  );
}

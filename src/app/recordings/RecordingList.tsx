"use client";

import React from "react";
import VideoCard from "./VideoCard";

export default function RecordingList({
  selectedVideo,
  setSelectedVideo,
  observer,
}: {
  selectedVideo: any;
  setSelectedVideo: Function;
  observer?: IntersectionObserver;
}) {
  const [videos, setVideos] = React.useState<any[]>();

  function renderVideoCards() {
    if (!videos) return <VideoCard />;

    if (videos.length === 0)
      return (
        <div className="w-full h-full flex justify-center items-center">
          No videos available
        </div>
      );

    return videos.map((video, i) => {
      return (
        <VideoCard
          key={i}
          video={video}
          selectedVideo={selectedVideo}
          onClick={() => setSelectedVideo(video)}
          observer={observer}
        />
      );
    });
  }

  return (
    <div className="pt-1 pb-3 w-full flex flex-col items-center overflow-hidden">
      <div className="w-full flex justify-start content-start flex-wrap shadow dark:shadow-zinc-50/10 overflow-hidden">
        {renderVideoCards()}
      </div>
    </div>
  );
}

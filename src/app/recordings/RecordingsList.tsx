"use client";

import React, {
  ReactNode,
  RefObject,
  use,
  useEffect,
  useRef,
  useState,
} from "react";
import VideoCard from "./VideoCard";
import { Video } from "@/src/models/video";
import Loading from "@/src/components/Loader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function RecordingsList({
  videosList = [],
  selectedVideo,
  setSelectedVideo = () => {},
  isLoading = false,
  nothingToLoad = false,
  onScroll = () => {},
}: {
  videosList?: Video[];
  selectedVideo?: Video;
  setSelectedVideo?: Function;
  isLoading?: boolean;
  nothingToLoad?: boolean;
  onScroll?: Function;
}) {
  const [videosCards, setVideosCards] = useState<ReactNode[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setVideosCards(
      videosList.map((video, i) => {
        const isSelected = selectedVideo === video;

        return (
          <VideoCard
            key={i}
            thumbnail={video.thumbnail}
            timestamp={video.timestamp}
            isSelected={isSelected}
            onClick={() => setSelectedVideo(video)}
            containerRef={containerRef}
          />
        );
      })
    );
  }, [videosList, selectedVideo, setSelectedVideo]);

  return (
    <div className="pt-1 pb-3 w-full flex flex-col items-center overflow-hidden">
      <div
        className="w-full flex-grow flex justify-start content-start flex-wrap overflow-y-auto"
        onScroll={(e) => onScroll(e)}
        ref={containerRef}
      >
        {videosCards.length > 0 ? (
          videosCards
        ) : (
          <div className="pb-3 w-full flex justify-center items-center">
            No videos available
          </div>
        )}

        {nothingToLoad && videosList.length > 0 && (
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

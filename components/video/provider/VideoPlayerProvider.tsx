"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  RefObject,
  SetStateAction,
  useCallback,
  useContext,
  useState,
} from "react";

import { Video } from "@/models/video";

import useVideoFullscreen from "../hooks/useVideoFullscreen";
import useVideoPlayback from "../hooks/useVideoPlayback";

type VideoPlayerContextValue = {
  queue: Video[];
  setQueue: Dispatch<SetStateAction<Video[]>>;

  currentVideo: Video | null;
  selectVideo: (video: Video) => void;
  next: () => void;
  previous: () => void;

  videoRef: RefObject<HTMLVideoElement | null>;

  currentTime: number;
  buffer: number;
  duration: number;

  isPlaying: boolean;
  isLoaded: boolean;
  isBuffering: boolean;

  play: () => Promise<void>;
  pause: () => void;
  seek: (time: number) => void;

  videoEvents: {
    onCanPlay: () => void;
    onTimeUpdate: () => void;
    onDurationChange: () => void;
    onProgress: () => void;
    onPlay: () => void;
    onPause: () => void;
    onEnded: () => void;
    onWaiting: () => void;
  };

  isFullscreen: boolean;
  toggleFullscreen: () => void;
};

const VideoPlayerContext =
  createContext<VideoPlayerContextValue | null>(null);

type Props = {
  initialQueue?: Video[];
  children: ReactNode;
};

export function VideoPlayerProvider({
  initialQueue = [],
  children,
}: Props) {
  const [queue, setQueue] = useState(initialQueue);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  const playback = useVideoPlayback({
    src: currentVideo?.src ?? "",
    isLiveStream: currentVideo?.isLiveStream ?? false,
  });

  const fullscreen = useVideoFullscreen({ isReady: currentVideo !== null });

  const selectVideo = useCallback(
    (video: Video) => setCurrentVideo(video),
    [],
  );

  const next = useCallback(() => {
    const currentIndex = queue.findIndex((video) => video.src === currentVideo?.src);
    const nextIndex = currentIndex + 1;
    if (nextIndex < queue.length) {
      setCurrentVideo(queue[nextIndex]);
    }
  }, [currentVideo, queue]);

  const previous = useCallback(() => {
    const currentIndex = queue.findIndex((video) => video.src === currentVideo?.src);
    const previousIndex = currentIndex - 1;
    if (previousIndex >= 0) {
      setCurrentVideo(queue[previousIndex]);
    }
  }, [currentVideo, queue]);

  return (
    <VideoPlayerContext.Provider value={{
      ...playback,
      ...fullscreen,
      queue,
      setQueue,
      currentVideo,
      selectVideo,
      next,
      previous,
    }}>
      {children}
    </VideoPlayerContext.Provider>
  );
}

export function useVideoPlayer() {
  const context = useContext(VideoPlayerContext);

  if (!context) {
    throw new Error(
      "useVideoPlayer must be used inside VideoPlayerProvider",
    );
  }

  return context;
}
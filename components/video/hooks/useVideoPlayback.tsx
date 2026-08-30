import Hls from "hls.js";
import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type Options = {
  src: string;
  isLiveStream: boolean;
};

export default function useVideoPlayback({ src, isLiveStream }: Options) {
  const videoRef = useRef<HTMLVideoElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [buffer, setBuffer] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(true);

  useEffect(() => {
    const video = videoRef.current;

    if (!video || !src) return;

    let hls: Hls | undefined;

    if (isLiveStream && Hls.isSupported()) {
      const videoSrc = `/api/stream?path=${encodeURIComponent(src)}`;

      hls = new Hls();
      hls.loadSource(videoSrc);
      hls.attachMedia(video);
    } else {
      video.src = `/api/video?path=${encodeURIComponent(src)}`;
    }

    return () => {
      hls?.destroy();

      video.removeAttribute("src");
      video.load();
    };
  }, [src, isLiveStream]);

  useEffect(() => {
    startTransition(() => {
      setCurrentTime(0);
      setBuffer(0);
      setDuration(0);
      setIsPlaying(false);
      setIsLoaded(false);
      setIsBuffering(Boolean(src));
    });
  }, [src]);

  const play = useCallback(async () => {
    const video = videoRef.current;
    if (!video) return;

    await video.play();
  }, []);

  const pause = useCallback(() => {
    videoRef.current?.pause();
  }, []);

  const seek = useCallback((time: number) => {
    const video = videoRef.current;

    if (!video || !Number.isFinite(video.duration)) return;

    const nextTime = Math.max(0, Math.min(time, video.duration));

    video.currentTime = nextTime;
    setCurrentTime(nextTime);
  }, []);

  const updateBuffer = useCallback(() => {
    const video = videoRef.current;

    if (!video) return;

    const length = video.buffered.length;

    setBuffer(length > 0 ? video.buffered.end(length - 1) : 0);
  }, []);

  const onCanPlay = useCallback(() => {
    setIsLoaded(true);
    setIsBuffering(false);
    updateBuffer();
  }, [updateBuffer]);

  const onTimeUpdate = useCallback(() => {
    const video = videoRef.current;

    if (video) {
      setCurrentTime(video.currentTime);
    }
  }, []);

  const onDurationChange = useCallback(() => {
    const video = videoRef.current;

    if (video) {
      setDuration(video.duration);
    }
  }, []);

  const onPlay = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const onPause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onEnded = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const onWaiting = useCallback(() => {
    setIsBuffering(true);
  }, []);

  return {
    videoRef,
    currentTime,
    buffer,
    duration,
    isPlaying,
    isLoaded,
    isBuffering,
    play,
    pause,
    seek,
    videoEvents: {
      onCanPlay,
      onTimeUpdate,
      onDurationChange,
      onProgress: updateBuffer,
      onPlay,
      onPause,
      onEnded,
      onWaiting,
    },
  };
}

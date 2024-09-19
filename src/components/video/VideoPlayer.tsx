"use client";

import React from "react";
import Hls from "hls.js";
import Logo from "../Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import VideoPlayerOverlay from "./VideoPlayerOverlay";

export default function VideoPlayer(
    { videoSource, isLiveStream, containerRef }:
    { videoSource?: string, isLiveStream?: boolean, containerRef: React.RefObject<HTMLDivElement>; }
) {

    const [currentTime, setCurrentTime] = React.useState<number>(0);
    const [buffer, setBuffer] = React.useState<number>(0);
    const [duration, setDuration] = React.useState<number>(0);
    const [playing, setPlaying] = React.useState<boolean>(false);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const [ready, setReady] = React.useState<boolean>(false);
    const [buffering, setBuffering] = React.useState<boolean>(true);
    const [fullscreen, setFullscreen] = React.useState<boolean>(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const videoContainerRef = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (!videoSource)
            return;

        const toggleFullscreen = () => {
            if (screen.orientation.type.startsWith("landscape") && !fullscreen)
                setFullscreen(true);

            if (screen.orientation.type.startsWith("portrait") && fullscreen)
                setFullscreen(false);
        }

        screen.orientation.addEventListener("change", toggleFullscreen);
        
        return () => {
            screen.orientation.removeEventListener("change", toggleFullscreen);
        }
    }, [fullscreen, videoSource])

    // Resize streaming or recording video element when resizing window (16:9 ratio)
    React.useEffect(() => {
        const container = containerRef.current;
        const videoContainer = videoContainerRef.current;

        if (!container || !videoContainer)
            return;

        const resize = () => {
            let windowFraction: number;
            if (fullscreen)
                windowFraction = 1;
            else if (screen.orientation.type.startsWith("landscape"))
                windowFraction = 0.8;
            else
                windowFraction = 0.5

            const maxHeight =  window.innerHeight * windowFraction;
            let width = container.clientWidth;
            let height = container.clientHeight;
    
            if (width > height)
                height = width / 16 * 9;
            else
                width = height / 9 * 16;

            if (height > maxHeight) {
                height = maxHeight
                width = height / 9 * 16;
            }
    
            videoContainer.style.width = width + "px";
            videoContainer.style.height = height + "px";
        }

        resize();
        setReady(true);
        window.addEventListener("resize", resize);

        return () => {
            window.removeEventListener('resize', resize);
        };
    }, [containerRef, fullscreen]);


    // Use HLS plugin only when required
    React.useEffect(() => {
        const video = videoRef.current;

        if (!video || !videoSource)
            return;

        if (isLiveStream && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoSource);
            hls.attachMedia(video);
        } else
            video.src = videoSource;
    }, [videoSource, videoRef, isLiveStream]);

    function setLastBuffer(e: React.SyntheticEvent<HTMLVideoElement>) {
        const length = e.currentTarget.buffered.length;
        const lastBuffer = e.currentTarget.buffered.end(length - 1);
        setBuffer(lastBuffer);
    }

    function toggleFullscreen() {
        setFullscreen(!fullscreen);
    }

    return (
        <div
            className="invisible py-1.5 flex justify-center items-center overflow-hidden data-[ready]:visible data-[fullscreen]:fixed data-[fullscreen]:inset-0 data-[fullscreen]:z-50 data-[fullscreen]:p-0 data-[fullscreen]:bg-black"
            data-ready={ready ? true : undefined}
            data-fullscreen={fullscreen ? true : undefined}
        >
            <div ref={videoContainerRef} className="relative w-full flex items-center justify-center rounded overflow-hidden shadow dark:shadow-zinc-50/10">
                {!videoSource && !isLiveStream && <Logo className="absolute inset-0 text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-150" />}
                {
                    videoSource && videoRef.current && buffering && (
                        <div className="absolute inset-0 flex justify-center items-center">
                            <FontAwesomeIcon icon={faSpinner} className="w-12 h-12 md:w-18 md:h-18 animate-spin" />
                        </div>
                    )
                }

                <video
                    className="w-full h-full object-fill scale-100 bg-loading bg-no-repeat bg-center"
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    controlsList="noremoteplayback nufullscreen nodownload"
                    poster=""
                    onCanPlay={() => {
                        setLoaded(true);
                        setBuffering(false);
                    }}
                    onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    onDurationChange={(e) => setDuration(e.currentTarget.duration)}
                    onProgress={setLastBuffer}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                    onWaiting={() => setBuffering(true)}
                >
                    Your browser does not support HTML5 video.
                </video>

                <VideoPlayerOverlay
                    isLive={isLiveStream ? true : undefined}
                    isPlaying={playing}
                    isLoaded={loaded}
                    currentTime={currentTime}
                    duration={duration}
                    buffer={buffer}
                    setCurrentTime={setCurrentTime}
                    videoSource={videoSource}
                    videoRef={videoRef}
                    fullscreen={fullscreen}
                    toggleFullscreen={toggleFullscreen}
                />
            </div>
        </div>
    );
}
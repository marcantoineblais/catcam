"use client";

import React from "react";
import Hls from "hls.js";
import fscreen from "fscreen";
import Logo from "../Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faPause, faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";
import VideoPlayerOverlay from "./VideoPlayerOverlay";

export default function VideoPlayer(
    { videoSource, isLiveStream, containerRef }:
    { videoSource?: string, isLiveStream?: boolean, containerRef: React.MutableRefObject<HTMLDivElement | null>; }) {


    const [currentTime, setCurrentTime] = React.useState<number>(0);
    const [duration, setDuration] = React.useState<number>(0);
    const [playing, setPlaying] = React.useState<boolean>(false);
    const [loaded, setLoaded] = React.useState<boolean>(false);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const fullScreenRef = React.useRef<any>(null);
    const videoContainerRef = React.useRef<HTMLDivElement>(null);
    
    // Resize streaming or recording video element when resizing window (16:9 ratio)
    React.useEffect(() => {
        const videoContainer = videoContainerRef.current;
        const fullScreen = fullScreenRef.current;
        const container = containerRef.current;

        if (!container || !videoContainer || !fullScreen)
            return;

        const resize = () => {
            let width;
            let height;
            let maxHeight;

            if (fscreen.fullscreenEnabled && fscreen.fullscreenElement !== null) {
                width = window.outerWidth;
                height = window.outerHeight;

                if (width < height)
                    height = (width / 16) * 9;
                else
                    width = (height / 9) * 16;
            } else {
                width = container.clientWidth;
                height = container.clientHeight;
                maxHeight = height * 0.5;

                if (width < height)
                    height = (width / 16) * 9;
                else
                    width = (height / 9) * 16;

                if (height > maxHeight) {
                    height = maxHeight;
                    width = (height / 9) * 16;
                }
            }

            videoContainer.style.width = width + "px";
            videoContainer.style.height = height + "px";
        };

        resize();
        window.addEventListener("resize", resize);
        fscreen.addEventListener("fullscreenchange", resize);

        fullScreen.classList.remove("hidden")
        fullScreen.classList.add("flex")

        return () => {
            window.removeEventListener('resize', resize);
            fscreen.removeEventListener("fullscreenchange", resize);
        };
    }, [videoContainerRef, containerRef]);
    
    
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

    // Fullscreen video
    function setFullScreen() {
        const fullScreen = fullScreenRef.current;
        const video = videoRef.current;

        if (!fullScreen || !video)
            return;

        if (fscreen.fullscreenElement !== null)
            fscreen.exitFullscreen();
        else if (fscreen.fullscreenEnabled)
            fscreen.requestFullscreen(fullScreen);
        else
            fscreen.requestFullscreen(video);
    }

    function updateDuration(e: React.SyntheticEvent<HTMLVideoElement>) {
        
    }

    return (
        <div ref={fullScreenRef} className="hidden py-1.5 justify-center items-center overflow-hidden">
            <div ref={videoContainerRef} className="relative min-h-full flex justify-center rounded overflow-hidden shadow dark:shadow-zinc-50/10">
                {!videoSource && !isLiveStream && <Logo className="absolute inset-0 text-gray-950 dark:text-zinc-200 translate-y-1/2 scale-150" />}                
                {
                    videoSource && videoRef.current && videoRef.current.readyState < HTMLMediaElement.HAVE_ENOUGH_DATA && (
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
                    onCanPlay={() => setLoaded(true)}
                    onProgress={(e) => setCurrentTime(e.currentTarget.currentTime)}
                    
                >
                    Your browser does not support HTML5 video.
                </video>

                <VideoPlayerOverlay 
                    isLive
                    isPlaying={playing}
                    isLoaded={loaded}
                    currentTime={currentTime}
                    duration={duration}
                />
            </div>
        </div>
    );
}
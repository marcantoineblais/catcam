"use client";

import React from "react";
import Hls from "hls.js";
import fscreen from "fscreen";
import Logo from "./Logo";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faPause, faPlay, faSpinner } from "@fortawesome/free-solid-svg-icons";

export default function VideoPlayer(
    { videoSource, isLiveStream, containerRef }:
    { videoSource?: string, isLiveStream?: boolean, containerRef: React.MutableRefObject<HTMLDivElement | null>; }) {

    const [videoTime, setVideoTime] = React.useState<string>("0:00");
    const [videoEnd, setVideoEnd] = React.useState<string>("0:00");
    const [duration, setDuration] = React.useState<number>(0);
    const [overlayTimeouts] = React.useState<any[]>([]);
    const [dblClicksTimeouts] = React.useState<any[]>([]);
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const fullScreenRef = React.useRef<any>(null);
    const videoContainerRef = React.useRef<HTMLDivElement>(null);
    const overlayRef = React.useRef<HTMLDivElement>(null);
    const playBtnRef = React.useRef<SVGSVGElement>(null);
    const pauseBtnRef = React.useRef<SVGSVGElement>(null);
    const videoSeekingRef = React.useRef<HTMLDivElement>(null);
    const progressBarRef = React.useRef<HTMLDivElement>(null);
    const bufferBarRef = React.useRef<HTMLDivElement>(null);
    const trackingHeadRef = React.useRef<HTMLDivElement>(null);
    
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
        const progress = progressBarRef.current;

        if (!video || !videoSource || !progress)
            return;

        progress.style.width = "";

        if (isLiveStream && Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(videoSource);
            hls.attachMedia(video);
        } else
            video.src = videoSource;
    }, [videoSource, videoRef, isLiveStream]);


    // Reset overlay before playing new video
    React.useEffect(() => {
        const overlay = overlayRef.current;
        const playBtn = playBtnRef.current;
        const pauseBtn = pauseBtnRef.current;

        if (!overlay || !playBtn || !pauseBtn)
            return;

        overlay.classList.remove("!opacity-100", "!visible");
        playBtn.classList.add("hidden");
        pauseBtn.classList.remove("hidden");
        setVideoTime("0:00");
        setVideoEnd("0:00");
        setDuration(0);
    }, [videoSource]);

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

    // Toggle between play and pause
    function playPauseVideo() {
        const video = videoRef.current;
        const overlay = overlayRef.current;
        const playBtn = playBtnRef.current;
        const pauseBtn = pauseBtnRef.current;

        if (!video || !overlay || !playBtn || !pauseBtn || !video.src)
            return;

        if (video.ended)
            video.currentTime = 0;

        if (video.paused) {
            try {
                video.play();
            } catch (ex) {
                console.log("Playback issue just occured, reload if video is broken.");
            }

            overlay.classList.remove("!opacity-100", "!visible");
            overlay.classList.add("opacity-0", "insivible");
            playBtn.classList.add('hidden');
            pauseBtn.classList.remove('hidden');

        } else {
            try {
                video.pause();
            } catch (ex) {
                console.log("Playback issue just occured, reload if video is broken.");
            }

            overlay.classList.add("!opacity-100", "!visible");
            overlay.classList.remove("opacity-0", "insivible");
            pauseBtn.classList.add('hidden');
            playBtn.classList.remove('hidden');
        }
    }


    // Convert the duration number into a string (m:ss)
    function getTimeString(time: number) {
        let seconds = Math.floor(time % 60).toString();
        const minutes = Math.floor(time / 60).toString();

        if (seconds.length === 1)
            seconds = "0" + seconds;

        return minutes + ":" + seconds;
    }

    // Update video length when new metadata is loaded
    function updateDuration() {
        const video = videoRef.current;
        const buffers = video?.buffered;

        if (!video || !buffers || !buffers.length)
            return;

        const time = isLiveStream ? buffers.end(0) : video.duration;

        setDuration(time);
        setVideoEnd(getTimeString(time));
    }

    // Adjust the progress bar size when time passes
    function updateProgressBar() {
        const video = videoRef.current;
        const progress = progressBarRef.current;
        const head = trackingHeadRef.current;

        if (duration <= 0 || !video || !progress || !head)
            return;
        const time = video.currentTime;
        let position = time / duration;

        if (position > 1)
            position = 1;
        else if (position < 0)
            position = 0;

        if (!video.paused)
            progress.style.width = `${position * 100}%`;

        setVideoTime(getTimeString(time));
    }

    // Adjust the buffer bar sizes when data is loaded
    function updateBufferBar() {
        const video = videoRef.current;
        const buffer = bufferBarRef.current;

        if (!video || !buffer)
            return;

        const buffers = video.buffered;

        if (!buffers.length)
            return;


        const end = buffers.end(0);
        const videoDuration = isLiveStream ? buffers.end(0) : video.duration;

        let position = end / videoDuration;

        if (position > 1)
            position = 1;
        else if (position < 0)
            position = 0;

        buffer.style.width = `${position * 100}%`;
        setDuration(videoDuration);
        setVideoEnd(getTimeString(videoDuration));
    }

    // Open overlay when closed and vice-versa
    function toggleOverlay(e: React.MouseEvent | null) {
        const overlay = overlayRef.current;

        if (!overlay)
            return;

        if (overlay.classList.contains("invisible"))
            showOverlay();
        else
            hideOverlay();

        e?.stopPropagation();
    }

    function hideOverlay() {
        const overlay = overlayRef.current;

        if (!overlay)
            return;

        overlay.classList.add("opacity-0", "invisible");
    }

    // Open overlay and create timeout to close it
    function showOverlay() {
        const overlay = overlayRef.current;
        const video = videoRef.current;
        let n: number = 0;

        if (!overlay || !video || !video.src)
            return;

        overlayTimeouts.forEach(t => {
            clearTimeout(t);
            n++;
        });
        overlayTimeouts.splice(0, n);
        overlay.classList.remove("opacity-0", "invisible");

        overlayTimeouts.push(setTimeout(() => {
            overlay.classList.add("opacity-0", "invisible");
        }, 2000));
    }

    // Make the progress bar clickable to seek in video
    function videoSeekingOnMouseDown(e: React.MouseEvent) {
        const video = videoRef.current;
        const seekBar = videoSeekingRef.current;
        const head = trackingHeadRef.current;
        const progressBar = progressBarRef.current;

        if (!video || !seekBar || !progressBar || !head || !video.src)
            return;

        const paused = video.paused;
        const start = seekBar.getBoundingClientRect().left;
        const end = seekBar.getBoundingClientRect().right;

        if (!paused)
            playPauseVideo();

        const seek = (e: MouseEvent | React.MouseEvent) => {
            const position = e.clientX;
            const videoDuration = isLiveStream ? video.buffered.end(0) : video.duration;

            showOverlay();
            if (position >= start && position <= end && progressBar) {
                const progressFraction = 1 - (end - position) / (end - start);
                progressBar.style.width = `${progressFraction * 100}%`;
                video.currentTime = progressFraction * videoDuration;
            }
        };

        const clear = () => {
            window.removeEventListener("mouseup", clear);
            window.removeEventListener("mousemove", seek);
            if (!paused)
                playPauseVideo();
        };

        window.addEventListener("mouseup", clear);
        window.addEventListener("mousemove", seek);
        seek(e);
    }

    // Make the progress bar touchable to seek in video
    function videoSeekingOnTouchStart(e: React.TouchEvent) {
        const video = videoRef.current;
        const seekBar = videoSeekingRef.current;
        const progressBar = progressBarRef.current;

        if (!video || !seekBar || !progressBar || !video.src || video.seeking || e.touches.length > 1)
            return;

        const paused = video.paused;
        const start = seekBar.getBoundingClientRect().left;
        const end = seekBar.getBoundingClientRect().right;

        if (!paused)
            playPauseVideo();

        const seek = (e: TouchEvent | React.TouchEvent) => {
            const position = e.touches[0].clientX;
            const videoDuration = isLiveStream ? video.buffered.end(0) : video.duration;

            if (position >= start && position <= end && progressBar) {
                const progressFraction = 1 - ((end - position) / (end - start));
                progressBar.style.width = progressFraction * 100 + "%";
                video.currentTime = progressFraction * videoDuration;
            }

            showOverlay();
            e.stopPropagation();
        };

        const clear = () => {
            window.removeEventListener("touchend", clear);
            window.removeEventListener("touchmove", seek);
            if (!paused)
                playPauseVideo();
        };

        window.addEventListener("touchend", clear);
        window.addEventListener("touchmove", seek);
        seek(e);
        e.stopPropagation();
    }

    // seek forward or backward when double clicking sides of the video
    function seekOnDblClick(e: React.MouseEvent, value: number) {
        const video = videoRef.current;
        if (!video)
            return;

        const removeTimeouts = () => {
            let n: number = 0;
            dblClicksTimeouts.forEach(t => {
                clearTimeout(t);
                n++;
            });
            dblClicksTimeouts.splice(0, n);
        };

        const seek = () => {
            const time = video.currentTime;

            removeTimeouts();
            showOverlay();

            if (value > 0 && value + time <= duration)
                video.currentTime = time + value;
            else if (value > 0) {
                video.currentTime = duration;
                updateProgressBar();
            } else if (value < 0 && value + time >= 0)
                video.currentTime = time + value;
            else
                video.currentTime = 0;

            const progress = progressBarRef.current;
            let position = video.currentTime / duration;

            if (!progress)
                return;

            if (position > 1)
                position = 1;
            else if (position < 0)
                position = 0;

            progress.style.width = `${position * 100}%`;
        };

        if (dblClicksTimeouts.length === 0) {
            toggleOverlay(null);
            dblClicksTimeouts.push(setTimeout(() => {
                removeTimeouts();
            }, 300));
        } else if (dblClicksTimeouts.length === 1)
            seek();

        e.stopPropagation();
    }

    // show overlay when video ends
    const onVideoEnd = () => {
        const playBtn = playBtnRef.current;
        const pauseBtn = pauseBtnRef.current;
        const overlay = overlayRef.current;

        if (!playBtn || !pauseBtn || !overlay)
            return;

        overlay.classList.add("!opacity-100", "!visible");
        playBtn.classList.remove("hidden");
        pauseBtn.classList.add("hidden");
    };

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
                    onTimeUpdate={() => updateProgressBar()}
                    onProgress={() => updateBufferBar()}
                    onLoadedMetadata={() => updateDuration()}
                    onEnded={() => onVideoEnd()}
                    onClick={() => showOverlay()}
                    onMouseMove={() => showOverlay()}
                    autoPlay
                    muted
                    playsInline
                    controlsList="noremoteplayback nufullscreen nodownload"
                    poster=""
                >
                    Your browser does not support HTML5 video.
                </video>
                
                <div
                    className="absolute top-0 left-0 right-0 bottom-0 opacity-0 invisible duration-500 text-gray-50 dark:text-zinc-200"
                    ref={overlayRef}
                    onClick={(e) => toggleOverlay(e)}
                    onMouseMove={() => showOverlay()}
                >
                    <div onClick={(e) => e.stopPropagation()} className="px-5 pt-3 pb-1.5 absolute bottom-0 left-0 right-0 flex flex-col justify-between items-center bg-gray-950/75">
                        <div
                            className="w-full flex justify-center"
                            onMouseDown={(e) => videoSeekingOnMouseDown(e)}
                            onTouchStart={(e) => videoSeekingOnTouchStart(e)}
                        >
                            <div ref={videoSeekingRef} className="h-1 w-full relative bg-gray-800 rounded cursor-pointer dark:bg-zinc-800">
                                <div ref={bufferBarRef} className="absolute top-0 bottom-0 left-0 bg-gray-500 rounded dark:bg-zinc-500"></div>
                                <div ref={progressBarRef} className="absolute top-0 bottom-0 left-0 bg-sky-700 rounded cursor-pointer">
                                    <div ref={trackingHeadRef} className="absolute h-5 w-5 -top-2 -right-[0.28rem] bg-gray-100 rounded-full cursor-pointer translate-x-1/4 dark:bg-zinc-200"></div>
                                </div>
                            </div>
                        </div>
                        <div className="w-full pt-3 flex justify-between items-center flex-grow">
                            <div className="flex items-center gap-5">
                                <div onClick={() => playPauseVideo()} className="cursor-pointer">
                                    <FontAwesomeIcon ref={playBtnRef} className="hidden w-6 h-6" icon={faPlay} />
                                    <FontAwesomeIcon ref={pauseBtnRef} className="w-6 h-6" icon={faPause} />
                                </div>
                                <div className="flex-grow">{videoTime} / {videoEnd}</div>
                            </div>
                            <FontAwesomeIcon icon={faExpand} className="w-6 h-6 flex items-center cursor-pointer" onClick={() => setFullScreen()} />
                        </div>
                    </div>
                    <div
                        className=" absolute top-0 bottom-16 left-0 w-1/5"
                        onClick={(e) => seekOnDblClick(e, -10)}
                    ></div>
                    <div
                        className="absolute top-0 bottom-16 right-0 w-1/5"
                        onClick={(e) => seekOnDblClick(e, 10)}
                    ></div>
                </div>
            </div>
        </div>
    );
}
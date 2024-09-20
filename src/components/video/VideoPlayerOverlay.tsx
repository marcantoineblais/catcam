"use client";

import normaliseTime from "@/src/utils/normaliseTime";
import { faExpand, faPause, faPlay, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { MouseEventHandler } from "react";

export default function VideoPlayerOverlay(
    {
        currentTime,
        buffer,
        duration,
        isLive,
        isPlaying,
        isLoaded,
        setCurrentTime,
        videoSource,
        videoRef,
        fullscreen,
        toggleFullscreen
    }: {
        currentTime?: number,
        buffer?: number,
        duration?: number,
        isLive?: boolean,
        isPlaying?: boolean,
        isLoaded?: boolean,
        setCurrentTime?: Function,
        videoSource?: string,
        videoRef: React.RefObject<HTMLVideoElement>
        fullscreen: boolean,
        toggleFullscreen: MouseEventHandler;
    }) {

    const [updatedTime, setUpdatedTime] = React.useState<number | null>(null);
    const [isCurrentlyPlaying, setIsCurrentlyPlaying] = React.useState<boolean>(false);
    const [displayedTime, setDisplayedTime] = React.useState<number | null>(null);
    const [timeoutTime, setTimeoutTime] = React.useState<number>(0);

    React.useEffect(() => {
        if (videoSource && !isLive)
            setTimeoutTime(1000)
    }, [videoSource, isLive])

    React.useEffect(() => {
        if (!isPlaying)
            setTimeoutTime(1000);
    }, [isPlaying]) 

    React.useEffect(() => {
        if (!timeoutTime || !isPlaying || updatedTime !== null)
            return;

        const timeout = setTimeout(() => {
            setTimeoutTime(0)
        }, timeoutTime)

        return () => {
            clearTimeout(timeout);
        }
    }, [timeoutTime, updatedTime, isPlaying])

    React.useEffect(() => {
        if (updatedTime !== null) {
            setDisplayedTime(updatedTime);
        } else {
            setDisplayedTime(currentTime === undefined ? null : currentTime);
        }
    }, [currentTime, updatedTime]);

    function pause() {
        const video = videoRef.current;

        if (!video)
            return;

        try {
            video.pause();
        } catch (_) { }
    }

    function play() {
        const video = videoRef.current;

        if (!video)
            return;

        try {
            video.play();
        } catch (_) { }
    }

    function updateCurrentTime(target: HTMLDivElement, clientX: number) {
        if (!duration)
            return 0;

        const width = target.clientWidth;
        const padding = parseInt(window.getComputedStyle(target).paddingLeft);
        const positionOffset = target.getBoundingClientRect().left + padding;
        const positionRelToEnd = (clientX - positionOffset) / (width - (2 * padding))
        let updatedTime = positionRelToEnd * duration;

        if (updatedTime < 0)
            updatedTime = 0;

        if (updatedTime > duration)
            updatedTime = duration;

        return updatedTime;
    }

    function mouseStartSeeking(e: React.MouseEvent<HTMLDivElement>) {
        if (isPlaying) {
            pause();
        }

        const updatedTime = updateCurrentTime(e.currentTarget, e.clientX);
        setIsCurrentlyPlaying(isPlaying || false);
        setUpdatedTime(updatedTime);
    }

    function touchStartSeeking(e: React.TouchEvent<HTMLDivElement>) {
        if (e.touches.length > 1)
            return;
        
        if (isPlaying) {
            pause();
        }

        const updatedTime = updateCurrentTime(e.currentTarget, e.touches[0].clientX);
        setIsCurrentlyPlaying(isPlaying || false);
        setUpdatedTime(updatedTime);
    }

    function mouseSeek(e: React.MouseEvent<HTMLDivElement>) {
        const video = videoRef.current;

        if (updatedTime === null || !video)
            return;

        const time = updateCurrentTime(e.currentTarget, e.clientX);
        setUpdatedTime(time);
        video.currentTime = time;
    }

    function touchSeek(e: React.TouchEvent<HTMLDivElement>) {
        if (e.touches.length > 1)
            return;

        const video = videoRef.current;

        if (updatedTime === null || !video)
            return;

        const time = updateCurrentTime(e.currentTarget, e.touches[0].clientX);
        setUpdatedTime(time);
        video.currentTime = time;
    }

    function endSeeking() {
        const video = videoRef.current;

        if (!video || updatedTime === null)
            return;

        if (setCurrentTime)
            setCurrentTime(updatedTime);

        setUpdatedTime(null);
        video.currentTime = updatedTime;
        
        if (isCurrentlyPlaying)
            play();
    }

    function fastSeeking(step: number) {
        if (currentTime === undefined || duration === undefined)
            return;

        const video = videoRef.current
        if (!video)
            return;

        let updatedTime = currentTime + step
        if (updatedTime < 0)
            updatedTime = 0;
        else if (updatedTime > duration)
            updatedTime = duration;

        video.currentTime = updatedTime;
    }

    function touchFastSeeking(e: React.TouchEvent<HTMLDivElement>, step: number) {
        const target = e.currentTarget;
        const removeListener = () => {
            target.removeEventListener("touchstart", seek);
        }
        const timer = setTimeout(removeListener, 200);
        const seek = () => {
            fastSeeking(step);
            removeListener();
            clearTimeout(timer);
        }
        target.addEventListener("touchstart", seek);
    }
    
    function showOverlay(e: React.TouchEvent | React.MouseEvent) {
        e.stopPropagation();
        setTimeoutTime(3000);
    }

    function displayTime(time: number) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        return `${normaliseTime(minutes)}:${normaliseTime(seconds)}`;
    }

    function renderTime() {
        if (displayedTime === null || duration === undefined)
            return "";

        return (
            <div className="flex items-center gap-1">
                <span className="w-12 text-center">{displayTime(displayedTime)}</span>
                <span>/</span>
                <span className="w-12 text-center">{displayTime(duration)}</span>
            </div>
        );
    }

    function renderDurationBar() {
        if (displayedTime === null || duration === undefined)
            return null;

        return (
            <div
                className="absolute top-0 bottom-0 left-0 bg-sky-700 rounded"
                style={{ width: `${displayedTime / duration * 100}%` }}
            ></div>
        );
    }

    function renderBufferBar() {
        if (buffer === undefined || duration === undefined)
            return null;

        return (
            <div
                className="absolute top-0 bottom-0 left-0 bg-gray-500 rounded dark:bg-zinc-500"
                style={{ width: `${buffer / duration * 100}%` }}
            ></div>
        );
    }

    function renderTrackingHead() {
        if (displayedTime === null || duration === undefined)
            return null;

        return (
            <button
                className="absolute h-5 w-5 -top-2 -translate-x-2 bg-gray-100 rounded-full cursor-pointer dark:bg-zinc-200"
                style={{ left: `${displayedTime / duration * 100}%` }}
            ></button>
        );
    }

    return (
        <div
            className="absolute hidden opacity-0 inset-0 duration-500 text-gray-50 dark:text-zinc-200 data-[ready]:block data-[visible]:opacity-100 data-[fullscreen]:fixed"
            data-ready={isLoaded ? true : undefined}
            data-visible={timeoutTime > 0 ? true : undefined}
            data-fullscreen={fullscreen ? true : undefined}
            onClick={showOverlay}
            onMouseUp={endSeeking}
            onMouseLeave={endSeeking}
            onMouseMove={showOverlay}
            onTouchMove={showOverlay}
        >
            <div 
                className="max-w-full invisible px-5 py-1.5 absolute bottom-0 left-0 right-0 flex flex-col justify-between items-center duration-500 bg-gray-950/75 data-[visible]:visible"
                onMouseMove={mouseSeek}
                data-visible={timeoutTime > 0 ? true : undefined}
            >
                {!isLive &&
                    <div className="py-3 w-full flex justify-center">
                        <div
                            className="h-1 w-full relative bg-gray-800 rounded cursor-pointer dark:bg-zinc-800"
                            onMouseDown={mouseStartSeeking}
                            onTouchStart={touchStartSeeking}
                            onTouchMove={touchSeek}
                            onTouchEnd={endSeeking}
                        >
                            {renderBufferBar()}
                            {renderDurationBar()}
                            {renderTrackingHead()}
                        </div>
                    </div> 
                }
                <div className="w-full py-1 flex justify-between items-center flex-grow">
                    <div className="flex items-center gap-5">
                        {isLive ? (
                            <div className="relative flex-grow animate-pulse">
                                <FontAwesomeIcon icon={faVideo} className="pe-1" />
                                <span>LIVE</span>
                            </div>
                        ) : (
                            <>
                                <button 
                                    className="cursor-pointer"
                                    onClick={isPlaying ? pause : play}
                                >
                                    <FontAwesomeIcon
                                        className="w-6 h-6"
                                        icon={isPlaying ? faPause : faPlay}
                                    />
                                </button>
                                <div className="flex-grow">{renderTime()}</div>
                            </>
                        )}
                    </div>

                    <button onClick={toggleFullscreen}>
                        <FontAwesomeIcon
                            className="w-6 h-6 flex items-center cursor-pointer data-[disabled]:hidden"
                            icon={faExpand}
                        />
                    </button>
                </div>
            </div>

            { !isLive &&
                <>
                    <div 
                        className="absolute top-0 bottom-16 left-0 w-1/5"
                        onDoubleClick={() => fastSeeking(-5)}
                        onTouchStart={(e) => touchFastSeeking(e, -5)}
                    ></div>
                    <div 
                        className="absolute top-0 bottom-16 right-0 w-1/5"
                        onDoubleClick={() => fastSeeking(5)}
                        onTouchStart={(e) => touchFastSeeking(e, 5)}
                    ></div>
                </>
            }
        </div>
    );
}
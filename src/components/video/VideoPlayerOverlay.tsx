"use client";

import { faExpand, faPause, faPlay, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function VideoPlayerOverlay(
    {
        currentTime,
        buffer,
        duration,
        isLive,
        isPlaying,
        isLoaded,
        videoRef
    }: {
        currentTime?: number,
        buffer?: number,
        duration?: number,
        isLive?: boolean,
        isPlaying?: boolean,
        isLoaded?: boolean,
        videoRef: React.RefObject<HTMLVideoElement>;
    }) {

    const [updatedTime, setUpdatedTime] = React.useState<number | null>(null);
    const [isCurrentlyPlaying, setIsCurrentlyPlaying] = React.useState<boolean>(false);
    const [displayedTime, setDisplayedTime] = React.useState<number | null>(null);

    React.useEffect(() => {
        if (updatedTime !== null) {
            setDisplayedTime(updatedTime);
        } else {
            setDisplayedTime(currentTime || null);
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
        const positionOffset = target.getBoundingClientRect().left;
        let updatedTime = (clientX - positionOffset) / width * duration;

        if (updatedTime < 0)
            updatedTime = 0;

        if (updatedTime > duration)
            updatedTime = duration;

        return updatedTime;
    }

    function onMouseDown(e: React.MouseEvent<HTMLDivElement>) {
        if (isPlaying) {
            pause();
        }

        const updatedTime = updateCurrentTime(e.currentTarget, e.clientX);
        setIsCurrentlyPlaying(isPlaying || false);
        setUpdatedTime(updatedTime);
    }

    function onTouchStart(e: React.TouchEvent<HTMLDivElement>) {
        if (e.touches.length > 1)
            return;
        
        if (isPlaying) {
            pause();
        }

        const updatedTime = updateCurrentTime(e.currentTarget, e.touches[0].clientX);
        setIsCurrentlyPlaying(isPlaying || false);
        setUpdatedTime(updatedTime);
    }

    function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
        if (updatedTime === null)
            return;

        const time = updateCurrentTime(e.currentTarget, e.clientX);
        setUpdatedTime(time);
    }

    function onTouchMove(e: React.TouchEvent<HTMLDivElement>) {
        if (e.touches.length > 1)
            return;

        if (updatedTime === null)
            return;

        const time = updateCurrentTime(e.currentTarget, e.touches[0].clientX);
        setUpdatedTime(time);
    }

    function onMouseUp() {
        const video = videoRef.current;

        if (!video || updatedTime === null)
            return;

        setUpdatedTime(null);
        video.currentTime = updatedTime;
        if (isCurrentlyPlaying)
            play();
    }

    function normaliseTime(value: number) {
        const valueStr = value.toFixed();
        return valueStr.length < 2 ? "0" + valueStr : valueStr;
    }

    function displayTime(time: number) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;

        return `${normaliseTime(minutes)}:${normaliseTime(seconds)}`;
    }

    function renderTime() {
        if (displayedTime === null || duration === undefined)
            return "";

        return `${displayTime(displayedTime)} / ${displayTime(duration)}`;
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
            <div
                className="absolute h-5 w-5 -top-2 -translate-x-2 bg-gray-100 rounded-full cursor-pointer dark:bg-zinc-200"
                style={{ left: `${displayedTime / duration * 100}%` }}
            ></div>
        );
    }

    return (
        <div
            className="absolute invisible opacity-0 inset-0 duration-500 text-gray-50 dark:text-zinc-200 data-[loaded]:visible data-[loaded]:opacity-100"
            data-loaded={isLoaded ? true : undefined}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
        >
            <div onClick={(e) => e.stopPropagation()} className="max-w-full px-5 py-1.5 absolute bottom-0 left-0 right-0 flex flex-col justify-between items-center bg-gray-950/75">
                {
                    !isLive && (
                        <div className="py-3 w-full flex justify-center">
                            <div
                                className="h-1 w-full relative bg-gray-800 rounded cursor-pointer dark:bg-zinc-800"
                                onMouseDown={onMouseDown}
                                onMouseMove={onMouseMove}
                                onTouchStart={onTouchStart}
                                onTouchMove={onTouchMove}
                                onTouchEnd={onMouseUp}
                            >
                                {renderBufferBar()}
                                {renderDurationBar()}
                                {renderTrackingHead()}
                            </div>
                        </div>
                    )
                }
                <div className="w-full py-1 flex justify-between items-center flex-grow">
                    <div className="flex items-center gap-5">
                        {
                            isLive ? (
                                <div className="relative flex-grow animate-pulse">
                                    <FontAwesomeIcon icon={faVideo} className="pe-1" />
                                    <span>LIVE</span>
                                </div>
                            ) : (
                                <>
                                    <div className="cursor-pointer">
                                        <FontAwesomeIcon
                                            onClick={isPlaying ? pause : play}
                                            className="w-6 h-6"
                                            icon={isPlaying ? faPause : faPlay}
                                        />
                                    </div>
                                    <div className="flex-grow">{renderTime()}</div>
                                </>
                            )
                        }
                    </div>
                    <FontAwesomeIcon icon={faExpand} className="w-6 h-6 flex items-center cursor-pointer" />
                </div>
            </div>

            <div className="absolute top-0 bottom-16 left-0 w-1/5"></div>
            <div className="absolute top-0 bottom-16 right-0 w-1/5"></div>
        </div>
    );
}
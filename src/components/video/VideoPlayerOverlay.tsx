"use client"

import { faExpand, faPause, faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

export default function VideoPlayerOverlay(
    { currentTime, endTime, isLive, isPlaying }:
    { currentTime?: number, endTime?: number, isLive?: boolean, isPlaying?: boolean }) {

    function normaliseTime(time: number) {
        return time < 10 ? "0" + time : time
    }    

    function displayTime(time: number) {
        const minutes = Math.floor(time / 60)
        const seconds = time % 60

        return `${normaliseTime(minutes)}:${normaliseTime(seconds)}`
    }

    function renderTime() {
        if (isLive)
            return "LIVE"

        if (!currentTime || !endTime)
            return ""

        return `${displayTime(currentTime)} / ${displayTime(endTime)}`
    }
    
    return (
        <div className="absolute inset-0 duration-500 text-gray-50 dark:text-zinc-200">
            <div onClick={(e) => e.stopPropagation()} className="px-5 pt-3 pb-1.5 absolute bottom-0 left-0 right-0 flex flex-col justify-between items-center bg-gray-950/75">
                <div className="w-full flex justify-center">
                    <div className="h-1 w-full relative bg-gray-800 rounded cursor-pointer dark:bg-zinc-800">
                        <div className="absolute top-0 bottom-0 left-0 bg-gray-500 rounded dark:bg-zinc-500"></div>
                        <div className="absolute top-0 bottom-0 left-0 bg-sky-700 rounded cursor-pointer">
                            <div className="absolute h-5 w-5 -top-2 -right-[0.28rem] bg-gray-100 rounded-full cursor-pointer translate-x-1/4 dark:bg-zinc-200"></div>
                        </div>
                    </div>
                </div>
                <div className="w-full pt-3 flex justify-between items-center flex-grow">
                    <div className="flex items-center gap-5">
                        <div className="cursor-pointer">
                            <FontAwesomeIcon className="hidden w-6 h-6" icon={faPlay} />
                            <FontAwesomeIcon className="w-6 h-6" icon={faPause} />
                        </div>
                        <div className="flex-grow">{renderTime()}</div>
                    </div>
                    <FontAwesomeIcon icon={faExpand} className="w-6 h-6 flex items-center cursor-pointer" />
                </div>
            </div>

            <div className="absolute top-0 bottom-16 left-0 w-1/5"></div>
            <div className="absolute top-0 bottom-16 right-0 w-1/5"></div>
        </div>
    )
}
"use client";

import normaliseTime from "@/src/utils/normaliseTime";
import { Skeleton } from "@nextui-org/skeleton";
import Image from "next/image";
import React from "react";
import { MouseEventHandler } from "react";

export default function VideoCard(
    { video, selectedVideo, observer, onClick }:
        { video?: any, selectedVideo?: any, observer?: IntersectionObserver, onClick?: MouseEventHandler; }
) {
    const [dateTime, setDateTime] = React.useState<Date>();
    const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);
    const imgRef = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
        const onResize = () => {
            const img = imgRef.current;
            const container = imgRef.current?.parentElement;

            if (!img || !container)
                return;

            const width = container.clientWidth;
            const height = width / 16 * 9;
            img.style.width = width + "px";
            img.style.height = height + "px";
        };

        onResize();
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    }, []);

    React.useEffect(() => {
        if (!video)
            return;

        setDateTime(new Date(video.time));
    }, [video]);

    React.useEffect(() => {
        if (!imgRef.current)
            return;

        observer?.observe(imgRef.current);
    }, [observer]);

    function renderDateTime() {
        let dateStr = "";
        let timeStr = "";

        if (dateTime) {
            const hours = dateTime.getHours();
            const minutes = normaliseTime(dateTime.getMinutes());
            const seconds = normaliseTime(dateTime.getSeconds());
            const date = normaliseTime(dateTime.getDate());
            const month = normaliseTime(dateTime.getMonth() + 1);
            const year = dateTime.getFullYear();
            dateStr = `${date}-${month}-${year}`;
            timeStr = `${hours}:${minutes}:${seconds}`;
        }

        return (
            <>
                <Skeleton isLoaded={dateStr !== ""}><span>{dateStr}</span></Skeleton>
                <Skeleton isLoaded={timeStr !== ""}><span>{timeStr}</span></Skeleton>
            </>
        );
    }

    function onLoadHandle(e: React.SyntheticEvent<HTMLImageElement>) {
        setImageLoaded(e.currentTarget.complete);
    }

    return (
        <div className="p-1.5 basis-1/2 md:basis-1/3">
            <div
                data-active={video?.href === selectedVideo?.href ? true : undefined}
                onClick={onClick}
                className="flex flex-col rounded overflow-hidden bg-gray-50 dark:bg-neutral-800 shadow-md shadow-gray-950/5 dark:shadow-zinc-50/5 hover:brightness-125 duration-200 cursor-pointer data-[active]:brightness-50"
            >
                <Skeleton isLoaded={imageLoaded}>
                    <img
                        ref={imgRef}
                        onLoad={onLoadHandle}
                        width={160}
                        height={90}
                        src={""}
                        alt="Movement capture preview"
                        className="object-fill duration-200"
                        data-url={video ? "/api" + video.thumbnail : ""}
                    />
                </Skeleton>

                <div className="w-full pt-1.5 px-3 flex justify-between text-sm md:text-base">
                    {renderDateTime()}
                </div>
            </div>
        </div>
    );
}
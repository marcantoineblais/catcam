"use client";

import normaliseTime from "@/src/utils/normaliseTime";
import { Skeleton } from "@nextui-org/skeleton";
import React from "react";
import { MouseEventHandler } from "react";

export default function VideoCard(
    { video, selectedVideo, observer, onClick }:
        { video?: any, selectedVideo?: any, observer?: IntersectionObserver, onClick?: MouseEventHandler; }
) {
    const [dateTime, setDateTime] = React.useState<Date>();
    const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);
    const cardRef = React.useRef<HTMLDivElement>(null);
    const imgRef = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
        const onResize = () => {
            const img = imgRef.current;
            const card = cardRef.current;

            if (!img || !card)
                return;

            const width = card.clientWidth;
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
        if (!cardRef.current)
            return;

        observer?.observe(cardRef.current);
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
                <span>{dateStr}</span>
                <span>{timeStr}</span>
            </>
        );
    }

    function onLoadHandle(e: React.SyntheticEvent<HTMLImageElement>) {
        setImageLoaded(e.currentTarget.complete);
    }

    function disableAnimation() {
        const card = cardRef.current;
        
        if (!card)
            return;

        return imageLoaded;
    }

    function imgSrc() {
        if (!video) {
            return "";
        }

        return "/api" + video.thumbnail;
    }

    return (
        <div className="p-1.5 basis-1/2 md:basis-1/3">
            <div
                ref={cardRef}
                onClick={onClick}
                data-active={video?.href === selectedVideo?.href ? true : undefined}
                className="flex flex-col rounded overflow-hidden bg-gray-50 dark:bg-neutral-800 shadow-md shadow-gray-950/5 dark:shadow-zinc-50/5 hover:brightness-125 duration-200 cursor-pointer data-[active]:brightness-50"
            >
                <Skeleton isLoaded={imageLoaded} disableAnimation={disableAnimation()}>
                    <img
                        ref={imgRef}
                        onLoad={onLoadHandle}
                        width={160}
                        height={90}
                        src={imgSrc()}
                        alt="Movement capture preview"
                        className="object-fill duration-200"
                    />
                </Skeleton>

                <div className="w-full pt-1.5 px-3 flex justify-between text-sm md:text-base">
                    {renderDateTime()}
                </div>
            </div>
        </div>
    );
}
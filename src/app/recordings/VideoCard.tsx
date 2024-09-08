"use client";

import React from "react";
import { MouseEventHandler } from "react";

export default function VideoCard({ video, selectedVideo, onClick }: { video: any, selectedVideo?: any, onClick: MouseEventHandler; }) {
    const date = video.time.split("T")[0];
    const time = video.time.split("T")[1].slice(0, -1);

    const imgRef = React.useRef<HTMLImageElement>(null);

    React.useEffect(() => {
        const onResize = () => {
            const img = imgRef.current;

            if (!img)
                return;

            const height = img.clientWidth / 16 * 9;
            img.style.height = height + "px";
        };

        onResize();
        window.addEventListener("resize", onResize);

        return () => {
            window.removeEventListener("resize", onResize);
        };
    });

    return (
        <div className="p-1.5 basis-1/2 lg:basis-1/3">
            <div
                data-active={video.href === selectedVideo?.href ? true : undefined}
                onClick={onClick}
                className="flex flex-col rounded overflow-hidden bg-gray-50 dark:bg-neutral-800 shadow-md shadow-gray-950/5 dark:shadow-zinc-50/5 hover:brightness-125 duration-200 cursor-pointer data-[active]:brightness-50"
            >
                <img ref={imgRef} src={video.thumbnail} alt="Movement capture preview" className="object-fill"  />
                <div className="w-full py-1.5 px-3 flex justify-between text-sm md:text-base">
                    <span>{date}</span>
                    <span>{time}</span>
                </div>
            </div>
        </div>
    );
}
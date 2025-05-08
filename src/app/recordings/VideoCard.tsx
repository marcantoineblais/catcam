"use client";

import { getFormattedDate, getFormattedTime } from "@/src/utils/formatDate";
import imageLoader from "@/src/utils/imageLoader";
import { Skeleton } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { MouseEventHandler } from "react";

export default function VideoCard({
  thumbnail = "",
  timestamp = new Date(),
  isSelected = false,
  observer,
  onClick,
}: {
  src?: string;
  thumbnail?: string;
  timestamp?: Date;
  isSelected?: boolean;
  observer?: IntersectionObserver;
  onClick?: MouseEventHandler;
}) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  function onLoadHandle(e: React.SyntheticEvent<HTMLImageElement>) {
    setImageLoaded(e.currentTarget.complete);
  }

  return (
    <div className="p-1.5 basis-1/2 md:basis-1/3">
      <div
        ref={cardRef}
        onClick={onClick}
        data-active={isSelected ? true : undefined}
        className="flex flex-col rounded overflow-hidden bg-gray-50 dark:bg-neutral-800 shadow-md shadow-gray-950/5 dark:shadow-zinc-50/5 duration-200 ease-in-out cursor-pointer data-active:cursor-default hover:border-4 hover:border-gray-500 hover:dark:border-neutral-500 data-active:border-4 data-active:border-sky-700 data-active:hover:border-sky-700"
      >
        <Skeleton className="data-active:saturate-0"
        isLoaded={imageLoaded}
        data-active={isSelected ? true : undefined}
        >
          <Image
            className="w-full aspect-16/9 duration-200"
            ref={imgRef}
            onLoad={onLoadHandle}
            loading="lazy"
            width={160}
            height={90}
            src={thumbnail}
            loader={imageLoader}
            alt="Movement capture preview"
          />
        </Skeleton>

        <div className="w-full pt-1.5 px-3 flex justify-between text-sm md:text-base data-active:bg-gray-700 data-active:text-gray-300 data-active:dark:bg-neutral-300 data-active:dark:text-neutral-700"
        data-active={isSelected ? true : undefined}>
          <span>{getFormattedDate(timestamp)}</span>
          <span>{getFormattedTime(timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

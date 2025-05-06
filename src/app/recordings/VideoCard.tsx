"use client";

import { getFormattedDate, getFormattedTime } from "@/src/utils/formatDate";
import { Skeleton } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { MouseEventHandler } from "react";

export default function VideoCard({
  thumbnail = "",
  timestamp = new Date(),
  isSelected = false,
  isVisible = false,
  observer,
  onClick,
}: {
  src?: string;
  thumbnail?: string;
  timestamp?: Date;
  isSelected?: boolean;
  isVisible?: boolean;
  observer?: IntersectionObserver;
  onClick?: MouseEventHandler;
}) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    observer?.observe(card);
    return () => {
      observer?.unobserve(card);
    }
  }, [observer]);

  useEffect(() => {
    if (!isVisible) {
      setImageLoaded(false);
    }
  }, [isVisible])

  function onLoadHandle(e: React.SyntheticEvent<HTMLImageElement>) {
    setImageLoaded(e.currentTarget.complete);
  }

  return (
    <div className="p-1.5 basis-1/2 md:basis-1/3">
      <div
        ref={cardRef}
        onClick={onClick}
        data-active={isSelected ? true : undefined}
        className="flex flex-col rounded overflow-hidden bg-gray-50 dark:bg-neutral-800 shadow-md shadow-gray-950/5 dark:shadow-zinc-50/5 hover:brightness-125 duration-200 cursor-pointer data-active:brightness-50"
      >
        <Skeleton isLoaded={imageLoaded} disableAnimation={!isVisible} className="aspect-16/9">
          <Image
            ref={imgRef}
            onLoad={onLoadHandle}
            width={160}
            height={90}
            src={thumbnail}
            loader={({ src, width, quality }) => `${window.location.origin}/${src}?w=${width}&q=${quality ?? 1}`}
            alt="Movement capture preview"
            className="w-full h-full object-fill duration-200"
          />
        </Skeleton>

        <div className="w-full pt-1.5 px-3 flex justify-between text-sm md:text-base">
          <span>{getFormattedDate(timestamp)}</span>
          <span>{getFormattedTime(timestamp)}</span>
        </div>
      </div>
    </div>
  );
}

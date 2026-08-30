"use client";

import Image from "next/image";
import React, { startTransition, useEffect, useRef, useState } from "react";
import { MouseEventHandler } from "react";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { getFormattedDate, getFormattedTime } from "@/libs/formatDate";
import imageLoader from "@/libs/imageLoader";

export default function VideoCard({
  thumbnail = "",
  timestamp = new Date(),
  isSelected = false,
  containerRef,
  onClick,
}: {
  src?: string;
  thumbnail?: string;
  timestamp?: Date;
  isSelected?: boolean;
  containerRef?: React.RefObject<HTMLDivElement | null>;
  onClick?: MouseEventHandler;
}) {
  const [imageLoaded, setImageLoaded] = useState<boolean>(false);
  const [options, setOptions] = useState<IntersectionObserverInit>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef, options);
  const imageWidth = 240;
  const imageHeight = 135;
  const imageQuality = 75;

  useEffect(() => {
    const container = containerRef?.current;

    const root = container || null;
    const rootMargin = "50%";
    const threshold = 0;

    setOptions({
      root,
      rootMargin,
      threshold,
    });
  }, [containerRef]);

  useEffect(() => {
    const card = cardRef.current;
    const container = containerRef?.current;

    if (!card || !container || !isSelected) return;

    card.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [isSelected, containerRef]);

  useEffect(() => {
    if (!isVisible) {
      startTransition(() => setImageLoaded(false));
    }
  }, [isVisible]);

  function onLoadHandle(e: React.SyntheticEvent<HTMLImageElement>) {
    setImageLoaded(e.currentTarget.complete);
  }

  return (
    <div ref={cardRef} className="p-1.5 basis-1/2 md:basis-1/3 aspect-4/3">
      {isVisible && (
        <div
          onClick={onClick}
          data-active={isSelected ? true : undefined}
          className="relative w-full h-full flex flex-col rounded overflow-hidden bg-surface-card shadow duration-200 ease-in-out cursor-pointer data-active:cursor-default data-active:text-primary-foreground data-active:bg-primary data-active:hover:opacity-100 hover:opacity-75"
        >
          {/* {!imageLoaded && <Skeleton className="absolute inset-0 bg-gray-800 dark:bg-zinc-500" />} */}
          <Image
            data-active={isSelected ? true : undefined}
            className="w-full h-full duration-200 data-active:saturate-0"
            onLoad={onLoadHandle}
            placeholder="empty"
            loading="lazy"
            width={imageWidth}
            height={imageHeight}
            src={`/${thumbnail}`}
            loader={() =>
              imageLoader({
                src: thumbnail,
                width: imageWidth,
                height: imageHeight,
                quality: imageQuality,
              })
            }
            alt="Movement capture preview"
          />

          <div className="w-full pt-1.5 px-3 flex justify-between items-center text-sm md:text-base">
            <span>{getFormattedDate(timestamp)}</span>
            <span>{getFormattedTime(timestamp)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

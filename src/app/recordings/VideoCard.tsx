"use client";

import useIntersectionObserver from "@/src/hooks/useIntersectionObserver";
import { getFormattedDate, getFormattedTime } from "@/src/libs/formatDate";
import imageLoader from "@/src/libs/imageLoader";
import { Skeleton } from "@heroui/react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import { MouseEventHandler } from "react";

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
    if (!isVisible) setImageLoaded(false);
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
          className="flex flex-col rounded overflow-hidden bg-gray-50 dark:bg-zinc-800 shadow-md shadow-gray-950/5 dark:shadow-zinc-50/5 duration-200 ease-in-out cursor-pointer data-active:cursor-default data-active:text-white data-active:bg-sky-700 data-active:hover:brightness-100 hover:brightness-75"
        >
          <Skeleton isLoaded={imageLoaded}>
            <Image
              data-active={isSelected ? true : undefined}
              className="w-full duration-200 data-active:saturate-0"
              onLoad={onLoadHandle}
              placeholder="empty"
              loading="lazy"
              width={160}
              height={90}
              src={thumbnail}
              loader={imageLoader}
              alt="Movement capture preview"
            />
          </Skeleton>

          <div className="w-full pt-1.5 px-3 flex justify-between items-center text-sm md:text-base">
            <span>{getFormattedDate(timestamp)}</span>
            <span>{getFormattedTime(timestamp)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

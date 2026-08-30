"use client";

import React, { startTransition, useEffect, useRef, useState } from "react";
import { MouseEventHandler } from "react";

import useIntersectionObserver from "@/hooks/useIntersectionObserver";
import { getFormattedDate, getFormattedTime } from "@/libs/formatDate";
import toImageUrl from "@/libs/toImageUrl";

import Skeleton from "./Skeleton";

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
  const [imageLoading, setImageLoading] = useState<boolean>(true);
  const [options, setOptions] = useState<IntersectionObserverInit>({});
  const cardRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(cardRef, options);
  const imageWidth = 240;
  const imageHeight = 135;

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
      startTransition(() => setImageLoading(true));
    }
  }, [isVisible]);

  function onLoadHandle(e: React.SyntheticEvent<HTMLImageElement>) {
    setImageLoading(!e.currentTarget.complete);
  }

  return (
    <div ref={cardRef} className="p-1.5 basis-1/2 md:basis-1/3 aspect-4/3">
      {isVisible && (
        <div
          onClick={onClick}
          data-active={isSelected ? true : undefined}
          className="relative w-full h-full flex flex-col rounded overflow-hidden bg-surface-card shadow duration-200 ease-in-out cursor-pointer data-active:cursor-default data-active:text-primary-foreground data-active:bg-primary data-active:hover:opacity-100 hover:opacity-75"
        >
          <Skeleton isLoading={imageLoading} className="w-full h-full">
            <img
              data-active={isSelected ? true : undefined}
              className="w-full h-full duration-200 data-active:saturate-0"
              onLoad={onLoadHandle}
              loading="lazy"
              width={imageWidth}
              height={imageHeight}
              src={toImageUrl({
                src: thumbnail,
                width: imageWidth,
                height: imageHeight,
                quality: 80,
              })}
              alt="Movement capture preview"
            />
          </Skeleton>

          <div className="w-full py-1 px-2 flex justify-between items-center text-sm md:text-base">
            <span>{getFormattedDate(timestamp)}</span>
            <span>{getFormattedTime(timestamp)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

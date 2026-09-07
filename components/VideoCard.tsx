"use client";

import { startTransition, useEffect, useState } from "react";
import { MouseEventHandler } from "react";
import { twJoin } from "tailwind-merge";

import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { getFormattedDate, getFormattedTime } from "@/libs/formatDate";
import toImageUrl from "@/libs/toImageUrl";

import Skeleton from "./Skeleton";

export default function VideoCard({
  thumbnail = "",
  timestamp = new Date(),
  isSelected = false,
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
  const {
    isVisible,
    setElement: setCard,
    element: card,
  } = useIntersectionObserver();
  const imageWidth = 240;
  const imageHeight = 136;

  useEffect(() => {
    if (!card || !isSelected) return;

    card.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [card, isSelected]);

  useEffect(() => {
    if (!isVisible) {
      startTransition(() => setImageLoading(true));
    }
  }, [isVisible]);

  function onLoadHandle(e: React.SyntheticEvent<HTMLImageElement>) {
    setImageLoading(!e.currentTarget.complete);
  }

  return (
    <div ref={setCard} className="p-1.5 basis-1/2 md:basis-1/3 aspect-4/3">
      {isVisible && (
        <div
          onClick={onClick}
          data-active={isSelected ? true : undefined}
          className={twJoin(
            "relative w-full h-full flex flex-col rounded-soft overflow-hidden bg-surface-card shadow-shadow group/video-card",
            "duration-200 ease-in-out cursor-pointer",
            "data-active:cursor-default data-active:text-primary-foreground data-active:bg-primary data-active:shadow-none",
            "hover:shadow-none",
            "transition-[box-shadow,transform]",
          )}
        >
          <Skeleton
            isLoading={imageLoading}
            className="w-full h-full aspect-video overflow-hidden"
          >
            <img
              className="w-full h-full duration-200 group-data-active/video-card:blur-xs group-data-active/video-card:scale-110"
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

          <div className="w-full p-2 pb-1 flex justify-between items-center text-xs md:text-sm xl:text-base">
            <span>{getFormattedDate(timestamp)}</span>
            <span>{getFormattedTime(timestamp)}</span>
          </div>
        </div>
      )}
    </div>
  );
}

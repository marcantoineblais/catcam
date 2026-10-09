"use client";

import { faPlay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
            "relative w-full h-full flex flex-col rounded-2xl overflow-hidden bg-surface-card ring-1 ring-border group/video-card",
            "cursor-pointer transition-[box-shadow,transform,background-color] duration-200 ease-out",
            "hover:-translate-y-0.5 hover:shadow-shadow",
            "data-active:cursor-default data-active:bg-primary data-active:text-primary-foreground data-active:ring-2 data-active:ring-primary data-active:shadow-active data-active:hover:translate-y-0",
          )}
        >
          <Skeleton
            isLoading={imageLoading}
            className="w-full min-h-0 flex-1 overflow-hidden"
          >
            <img
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover/video-card:scale-105 group-data-active/video-card:scale-105"
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

            <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-colors duration-300 group-data-active/video-card:bg-black/35">
              <span className="grid size-10 place-items-center rounded-full bg-white/90 text-primary text-sm shadow-lg opacity-0 scale-75 transition duration-300 group-hover/video-card:opacity-100 group-hover/video-card:scale-100 group-data-active/video-card:opacity-100 group-data-active/video-card:scale-100">
                <FontAwesomeIcon icon={faPlay} className="translate-x-px" />
              </span>
            </div>
          </Skeleton>

          <div className="w-full px-2.5 py-2 flex justify-between items-center gap-2 text-xs md:text-sm">
            <span className="font-medium truncate">
              {getFormattedDate(timestamp)}
            </span>
            <span className="tabular-nums opacity-70">
              {getFormattedTime(timestamp)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

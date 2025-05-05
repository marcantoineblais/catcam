"use client";

import normaliseTime from "@/src/utils/normaliseTime";
import { Skeleton } from "@nextui-org/skeleton";
import Image from "next/image";
import React from "react";
import { MouseEventHandler } from "react";

export default function VideoCard({
  video,
  selectedVideo,
  observer,
  onClick,
}: {
  video?: any;
  selectedVideo?: any;
  observer?: IntersectionObserver;
  onClick?: MouseEventHandler;
}) {
  const [imageLoaded, setImageLoaded] = React.useState<boolean>(false);
  const cardRef = React.useRef<HTMLDivElement>(null);
  const imgRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    if (!cardRef.current) return;

    observer?.observe(cardRef.current);
  }, [observer]);

  function onLoadHandle(e: React.SyntheticEvent<HTMLImageElement>) {
    setImageLoaded(e.currentTarget.complete);
  }

  function disableAnimation() {
    const card = cardRef.current;

    if (!card) return;
    return imageLoaded;
  }

  return (
    <div className="p-1.5 basis-1/2 md:basis-1/3">
      <div
        ref={cardRef}
        onClick={onClick}
        data-active={video?.href === selectedVideo?.href ? true : undefined}
        className="flex flex-col rounded overflow-hidden bg-gray-50 dark:bg-neutral-800 shadow-md shadow-gray-950/5 dark:shadow-zinc-50/5 hover:brightness-125 duration-200 cursor-pointer data-active:brightness-50"
      >
        <Skeleton isLoaded={imageLoaded} disableAnimation={disableAnimation()}>
          <Image
            ref={imgRef}
            onLoad={onLoadHandle}
            width={160}
            height={90}
            src={"api/" + video.thumbnail}
            alt="Movement capture preview"
            className="ratio-[16/9] object-fill duration-200"
          />
        </Skeleton>

        <div className="w-full pt-1.5 px-3 flex justify-between text-sm md:text-base">
          {renderDateTime()}
        </div>
      </div>
    </div>
  );
}

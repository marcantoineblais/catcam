"use client";

import { TouchEvent, useMemo, useRef } from "react";
import useScroller from "../hooks/useScroller";

export default function OnOffSwitch({
  isOn = true,
  setIsOn = () => true,
  isEnabled = false,
  onLabel = "ON",
  offLabel = "OFF",
  height = 7,
  width = 15,
}: {
  isOn?: boolean;
  setIsOn?: (value: boolean) => void;
  isEnabled?: boolean;
  onLabel?: string;
  offLabel?: string;
  height?: number;
  width?: number;
}) {  
  const heightClassName = useMemo(() => {
    return `h-${height}`;
  }, [height]);

  const widthClassName = useMemo(() => {
    return `w-${width}`;
  }, [width]);

  const btnRef = useRef<HTMLButtonElement>(null);
  const {
    position,
    isScrolling,
    handleClick,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
  } = useScroller({
    containerRef: btnRef,
    itemsNumber: 2,
    offset: width,
    initialIndex: isOn ? 0 : 1
  });

  function onClick() {
    const status = !isOn;
    const index = status ? 0 : 1;
    setIsOn(status);
    handleClick(index);
  }

  function onTouchMove(e: TouchEvent) {
    handleTouchMove(e);
  }

  function onTouchEnd() {
    const index = handleTouchEnd();
    setIsOn(index === 0);
  }

  return (
    <button
      ref={btnRef}
      className={`${heightClassName} ${widthClassName} text-sm font-bold rounded-full text-white !box-content border-2 border-gray-500 dark:border-zinc-500 overflow-hidden ease-in-out disabled:opacity-50 focus:outline-none`}
      disabled={isEnabled ? undefined : true}
      data-scrolling={isScrolling || undefined}
    >
      <div
        className="relative w-[calc(150%+0.5rem)] h-full flex duration-500 data-scrolling:duration-0"
        style={{ left: `${-position}px` }}
        data-scrolling={isScrolling || undefined}
      >
        <div className="px-1.5 w-full h-full flex justify-start items-center rounded-l-full bg-sky-700 dark:bg-sky-700">
          {onLabel}
        </div>

        <div className="px-1.5 w-full h-full flex justify-end items-center rounded-r-full bg-gray-700 dark:bg-zinc-700">
          {offLabel}
        </div>

        <div
          className="absolute z-10 -top-0.5 -bottom-0.5 left-1/2 -translate-x-[50%] origin-center aspect-square rounded-full bg-gray-50 dark:bg-zinc-100 inset-ring-2 inset-ring-gray-500 dark:inset-ring-zinc-500 cursor-pointer data-disabled:cursor-default"
          onTouchStart={handleTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          onClick={onClick}
          data-disabled={isEnabled ? undefined : true}
        ></div>
      </div>
    </button>
  );
}

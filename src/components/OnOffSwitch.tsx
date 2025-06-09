"use client";

import { SyntheticEvent, UIEventHandler, useRef } from "react";
import useSmoothScroller from "../app/hooks/useSmoothScroller";

export default function OnOffSwitch({
  isOn = true,
  setIsOn = () => {},
  isEnabled = false,
  onLabel = "ON",
  offLabel = "OFF",
}: {
  isOn?: boolean;
  setIsOn?: Function;
  isEnabled?: boolean;
  onLabel?: string;
  offLabel?: string;
}) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const { isScrolling, scrollTo } = useSmoothScroller(btnRef, "left", 1);

  function handleClick() {
    const btn = btnRef.current;

    if (!isEnabled || !btn) return;

    const status = !isOn;

    if (status) {
      scrollTo(0);
    } else {
      const maxScroll = btn.scrollWidth - btn.clientWidth;
      scrollTo(maxScroll);
    }

    setIsOn(status);
  }

  function handleScrollEnd() {
    const btn = btnRef.current;
    if (!btn || isScrolling) return;

    const scrollPosition = btn.scrollLeft;
    const scrollMidway = (btn.scrollWidth - btn.clientWidth) / 2;

    if (scrollPosition <= scrollMidway) {
      scrollTo(0);
      setIsOn(true);
    } else {
      const maxScroll = btn.scrollWidth - btn.clientWidth;      
      scrollTo(maxScroll);
      setIsOn(false);
    }
  }

  return (
    <button
      ref={btnRef}
      className="h-10 w-20 text-sm font-bold rounded-full text-white !box-content border-2 border-gray-950/50 dark:border-zinc-50/50 overflow-y-hidden overflow-x-auto ease-in-out cursor-pointer disabled:grayscale-50 disabled:cursor-default no-scrollbar focus:outline-none disabled:overflow-x-hidden data-no-scroll:overflow-x-hidden"
      onClick={handleClick}
      onScrollEnd={handleScrollEnd}
      disabled={isEnabled ? undefined : true}
      data-no-scroll={isScrolling ? true : undefined}
    >
      <div className="relative w-30 h-full flex">
        <div className="px-1.5 w-full h-full flex justify-start items-center rounded-l-full bg-sky-700 dark:bg-sky-700">
          {onLabel}
        </div>

        <div className="px-1.5 w-full h-full flex justify-end items-center rounded-r-full bg-gray-700 dark:bg-zinc-700">
          {offLabel}
        </div>

        <div className="absolute z-10 -top-0.5 -bottom-0.5 left-1/2 -translate-x-1/2 origin-center aspect-square rounded-full bg-gray-50 dark:bg-zinc-950 inset-ring-2 inset-ring-gray-950/50 dark:inset-ring-zinc-50/50"></div>
      </div>
    </button>
  );
}

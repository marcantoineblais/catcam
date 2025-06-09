"use client";

import { TouchEvent, useRef, useState } from "react";

export default function OnOffSwitch({
  isOn = true,
  setIsOn = () => true,
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
  const [initPosition, setInitPosition] = useState<number | null>(null);
  const [scrollSpeed, setScrollSpeed] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(true);
  const btnRef = useRef<HTMLButtonElement>(null);
  const innerBtnRef = useRef<HTMLDivElement>(null);
  const btnHeadRef = useRef<HTMLDivElement>(null);

  function scrollToIdle(currentPosition: number | null = null) {    
    const btn = btnRef.current;
    const innerBtn = innerBtnRef.current;
    const head = btnHeadRef.current;
    if (!btn || !innerBtn || !head) return;

    const maxScroll = (innerBtn.clientWidth - head.clientWidth) / 2;
    const threshold = maxScroll / 2;

    if (currentPosition) {
      const updatedStatus = currentPosition < threshold
      setIsOn(updatedStatus);
      setScrollPosition(updatedStatus ? 0 : maxScroll)
    } else {
      const updatedStatus = !isOn
      setIsOn(updatedStatus)
      setScrollPosition(updatedStatus ? 0 : maxScroll)
    }
  }

  function handleClick() {
    if (isScrolling) return;
    scrollToIdle();
  }

  function handleTouchStart(e: TouchEvent) {
    const position = e.touches[0].clientX;
    setInitPosition(position);
  }

  function handleTouchMove(e: TouchEvent) {
    const btn = btnRef.current;
    const innerBtn = innerBtnRef.current;
    const head = btnHeadRef.current;
    if (!btn || !innerBtn || !head || initPosition === null) return;

    const position = e.touches[0].clientX;
    const delta = initPosition - position;
    setIsScrolling(true);
    setInitPosition(position);
    setScrollSpeed(delta);
    setScrollPosition((position) => {
      const maxScroll = (innerBtn.clientWidth - head.clientWidth) / 2;
      let newPosition = position + delta;

      if (newPosition < 0) newPosition = 0;
      if (newPosition > maxScroll) newPosition = maxScroll;

      return newPosition;
    });
  }

  function handleTouchEnd() {
    if (!isScrolling) return;

    const btn = btnRef.current;
    const innerBtn = innerBtnRef.current;
    const head = btnHeadRef.current;
    if (!btn || !innerBtn || !head || !initPosition) return;

    const maxScroll = (innerBtn.clientWidth - head.clientWidth) / 2;
    let speed = scrollSpeed;
    let currentPosition = scrollPosition;

    const interval = setInterval(() => {
      if (speed === 0) {
        setInitPosition(null);
        setScrollSpeed(0);
        setIsScrolling(false);
        scrollToIdle(currentPosition);
        clearInterval(interval);
      } else {
        setScrollPosition((position) => {
          let newPosition = position + speed;

          if (newPosition < 0) newPosition = 0;
          if (newPosition > maxScroll) newPosition = maxScroll;

          currentPosition = newPosition;
          return newPosition;
        });

        if (Math.abs(speed) < 1) {
          speed = 0;
        } else {
          speed = speed * 0.9;
        }
      }
    }, 20);
  }

  return (
    <button
      ref={btnRef}
      className="h-10 w-20 text-sm font-bold rounded-full text-white !box-content border-2 border-gray-950/50 dark:border-zinc-50/50 overflow-hidden ease-in-out cursor-pointer disabled:opacity-50 focus:outline-none"
      disabled={isEnabled ? undefined : true}
      data-scrolling={isScrolling || undefined}
    >
      <div
        ref={innerBtnRef}
        className="relative w-30 h-full flex duration-500 data-scrolling:duration-0"
        style={{ left: `${-scrollPosition}px` }}
        data-scrolling={isScrolling || undefined}
      >
        <div className="px-1.5 w-full h-full flex justify-start items-center rounded-l-full bg-sky-700 dark:bg-sky-700">
          {onLabel}
        </div>

        <div className="px-1.5 w-full h-full flex justify-end items-center rounded-r-full bg-gray-700 dark:bg-zinc-700">
          {offLabel}
        </div>

        <div
          ref={btnHeadRef}
          className="absolute z-10 -top-0.5 -bottom-0.5 left-1/2 -translate-x-1/2 origin-center aspect-square rounded-full bg-gray-50 dark:bg-zinc-950 inset-ring-2 inset-ring-gray-950/50 dark:inset-ring-zinc-50/50 cursor-pointer data-disabled:cursor-default"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={handleClick}
          data-disabled={isEnabled ? undefined : true}
        ></div>
      </div>
    </button>
  );
}

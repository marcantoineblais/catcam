"use client";

import { RefObject, useEffect, useState } from "react";

const useSmoothScroller = (
  element: RefObject<HTMLElement | null>,
  speed: number = 1
) => {
  const [scrollSpeed, setScrollSpeed] = useState<number>(speed);
  const [nextScrollLeft, setNextScrollLeft] = useState<number | null>(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  useEffect(() => {    
    if (nextScrollLeft === null || !element.current) return;

    const el = element.current;

    setIsScrolling(true);
    let correctedScrollLeft = nextScrollLeft;
    if (correctedScrollLeft < 0) correctedScrollLeft = 0;
    if (correctedScrollLeft > el.scrollWidth - el.clientWidth)
      correctedScrollLeft = el.scrollWidth - el.clientWidth;

    const interval = setInterval(() => {
      let nextPosition = el.scrollLeft;
      if (correctedScrollLeft > nextPosition) {
        nextPosition += scrollSpeed;

        if (nextPosition > correctedScrollLeft)
          nextPosition = correctedScrollLeft;
      } else {
        nextPosition -= scrollSpeed;

        if (nextPosition < correctedScrollLeft)
          nextPosition = correctedScrollLeft;
      }

      el.scroll({ left: nextPosition });      
      if (nextPosition === correctedScrollLeft) {
        setNextScrollLeft(null);
        setIsScrolling(false);
        clearInterval(interval);
      } 
    }, 10);

    return () => {
      clearInterval(interval);
      setIsScrolling(false);
    }
  }, [scrollSpeed, nextScrollLeft]);

  function scrollLeft(position: number) {
    setNextScrollLeft(position);
  }

  return { isScrolling, setScrollSpeed, scrollLeft };
};

export default useSmoothScroller;

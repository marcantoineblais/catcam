"use client";

import { RefObject, useCallback, useEffect, useMemo, useState } from "react";

const useSmoothScroller = (
  element: RefObject<HTMLElement | null> | null = null,
  direction: "top" | "left" = "top",
  speed: number = 1
) => {
  const [scrollSpeed, setScrollSpeed] = useState<number>(speed);
  const [nextScroll, setNextScroll] = useState<number | null>(null);
  const [scrollDirection, setScrollDirection] = useState<"top" | "left">(
    direction
  );
  const [isScrolling, setIsScrolling] = useState<boolean>(false);

  useEffect(() => {
    const el = element?.current;

    if (nextScroll === null || !el) return;

    setIsScrolling(true);

    let maxScroll = 0;
    if (scrollDirection === "left") {
      maxScroll = el.scrollWidth - el.clientWidth;
    } else {
      maxScroll = el.scrollHeight - el.clientHeight;
    }
    
    let correctedScroll = nextScroll;
    if (correctedScroll < 0) correctedScroll = 0;
    if (correctedScroll > maxScroll) correctedScroll = maxScroll;

    const interval = setInterval(() => {      
      let nextPosition = scrollDirection === "left" ? el.scrollLeft : el.scrollTop;
      if (correctedScroll > nextPosition) {
        nextPosition += scrollSpeed;

        if (nextPosition > correctedScroll) nextPosition = correctedScroll;
      } else {
        nextPosition -= scrollSpeed;

        if (nextPosition < correctedScroll) nextPosition = correctedScroll;
      }

      if (scrollDirection === "left") el.scroll({ left: nextPosition });
      else el.scroll({ top: nextPosition });

      if (nextPosition === correctedScroll) {
        setNextScroll(null);
        setIsScrolling(false);
        clearInterval(interval);
      }
    }, 10);

    return () => {
      clearInterval(interval);
      setIsScrolling(false);
    };
  }, [scrollSpeed, scrollDirection, nextScroll, element]);

  const scrollTo = useCallback((position: number) => {
    setNextScroll(position);
  }, [])

  return { isScrolling, setScrollSpeed, scrollTo, setScrollDirection };
};

export default useSmoothScroller;

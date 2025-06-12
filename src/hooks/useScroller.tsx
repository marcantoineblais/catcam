import { RefObject, TouchEvent, useCallback, useRef, useState } from "react";

export default function useScroller({
  containerRef,
  itemsNumber = 2,
  offset = 0,
  isLocked = false,
}: {
  containerRef: RefObject<HTMLElement | null>;
  itemsNumber?: number;
  offset?: number;
  isLocked?: boolean;
}) {
  const [position, setPosition] = useState<number>(0);
  const [previousPosition, setPreviousPosition] = useState<number>(0);
  const [previousYPosition, setPreviousYPosition] = useState<number>(0);
  const [scrollDirection, setScrollDirection] = useState<
    "left" | "right" | null
  >(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const timer = useRef<NodeJS.Timeout | number>(0);

  const calculateElementWidth = useCallback(() => {
    const container = containerRef.current;
    if (!container) return {};

    const scrollWidth = container.scrollWidth;
    const elementWidth = scrollWidth / itemsNumber - offset;
    const maxScroll = scrollWidth - elementWidth - offset * itemsNumber;

    return { maxScroll, elementWidth };
  }, [containerRef, itemsNumber, offset]);

  const calculateSelectedIndex = useCallback(() => {
    const { maxScroll, elementWidth } = calculateElementWidth();
    if (maxScroll === undefined || elementWidth === undefined)
      return { index: 0, newPosition: 0 };

    let currentIndex = Math.floor(position / (maxScroll / itemsNumber));
    if (currentIndex > itemsNumber - 1) currentIndex = itemsNumber - 1;

    const baseline = currentIndex * elementWidth;
    let index = currentIndex;
    if (scrollDirection === "left" && position > baseline)
      index = currentIndex + 1;
    else if (scrollDirection === "right" && position < baseline)
      index = currentIndex - 1;

    const newPosition = index * elementWidth;

    return { index, newPosition };
  }, [calculateElementWidth, position, itemsNumber, scrollDirection]);

  function resetTimer() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setScrollDirection(null);
    }, 200);
  }

  const handleClick = useCallback(
    (index: number) => {
      const { elementWidth } = calculateElementWidth();
      if (elementWidth === undefined) return;
      const scrollPosition = elementWidth * index;
      setPosition(scrollPosition);
    },
    [calculateElementWidth]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (isLocked) return;

      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientX;

      setIsScrolling(true);
      setPreviousPosition(clientX);
      setPreviousYPosition(clientY);
    },
    [isLocked]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (isLocked || !isScrolling) return;

      const { elementWidth, maxScroll } = calculateElementWidth();
      const container = containerRef.current;
      if (elementWidth === null || maxScroll === undefined || !container)
        return;

      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      const deltaX = previousPosition - clientX;
      const deltaY = previousYPosition - clientY;

      let newPosition = position + deltaX;
      if (newPosition < 0) newPosition = 0;
      if (newPosition > maxScroll) newPosition = maxScroll;

      let newScrollDirection = scrollDirection;
      if (Math.abs(deltaY) >= Math.abs(deltaX)) newScrollDirection = null;
      else if (newPosition > position) newScrollDirection = "left";
      else newScrollDirection = "right";

      setScrollDirection(newScrollDirection);
      setPreviousPosition(clientX);
      setPreviousYPosition(clientY);
      setPosition(newPosition);
      resetTimer();
    },
    [
      isLocked,
      containerRef,
      calculateElementWidth,
      isScrolling,
      position,
      previousPosition,
      scrollDirection,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    const { index, newPosition } = calculateSelectedIndex();

    setPreviousPosition(0);
    setPreviousYPosition(0);
    setScrollDirection(null);
    setIsScrolling(false);
    setPosition(newPosition);
    clearTimeout(timer.current);
    return index;
  }, [calculateSelectedIndex]);

  return {
    position,
    isScrolling,
    handleClick,
    handleTouchMove,
    handleTouchStart,
    handleTouchEnd,
  };
}

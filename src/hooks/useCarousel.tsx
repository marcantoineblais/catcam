import {
  ReactNode,
  TouchEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export default function useCarousel({
  isLocked = false,
  initialIndex = 0,
  children,
}: {
  isLocked?: boolean;
  initialIndex?: number;
  children: ReactNode[];
}) {
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);
  const [position, setPosition] = useState<number>(0);
  const [previousPosition, setPreviousPosition] = useState<number>(0);
  const [previousYPosition, setPreviousYPosition] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [scrollDirection, setScrollDirection] = useState<
    "left" | "right" | null
  >(null);
  const [isScrolling, setIsScrolling] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const timer = useRef<NodeJS.Timeout | number>(0);
  const itemsNumber = useMemo(() => children.length, [children]);

  const snapToSelection = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const elementWidth = container.clientWidth;
    const baseline = selectedIndex * elementWidth;
    let index = selectedIndex;
    if (scrollDirection === "left" && position > baseline)
      index = selectedIndex + 1;
    else if (scrollDirection === "right" && position < baseline)
      index = selectedIndex - 1;

    const newPosition = index * elementWidth;
    setSelectedIndex(index);
    setPosition(newPosition);
    return newPosition;
  }, [selectedIndex, position, scrollDirection]);

  const selectIndex = useCallback(
    (newIndex: number) => {
      const container = containerRef.current;
      if (!container) return;

      let index = newIndex;
      if (index < 0) index = itemsNumber - 1;
      if (index >= itemsNumber) index = 0;

      const elementWidth = container.clientWidth;
      const scrollPosition = elementWidth * index;
      setSelectedIndex(index);
      setPosition(scrollPosition);
    },
    [itemsNumber]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (isLocked) return;

      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;

      setIsScrolling(true);
      setPreviousPosition(clientX);
      setPreviousYPosition(clientY);
    },
    [isLocked]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      const container = containerRef.current;
      if (isLocked || !isScrolling || !container) return;

      const maxScroll = container.scrollWidth - container.clientWidth;

      const clientX = e.touches[0].clientX;
      const clientY = e.touches[0].clientY;
      const deltaX = previousPosition - clientX;
      const deltaY = previousYPosition - clientY;

      let newPosition = position + deltaX;
      let newScrollDirection = scrollDirection;

      if (Math.abs(deltaY) > 3) {
        newScrollDirection = null;
        newPosition = position;
      } else {
        if (newPosition < 0) newPosition = 0;
        if (newPosition > maxScroll) newPosition = maxScroll;

        if (newPosition > position) newScrollDirection = "left";
        else if (newPosition < position) newScrollDirection = "right";
      }

      setScrollDirection(newScrollDirection);
      setPreviousPosition(clientX);
      setPreviousYPosition(clientY);
      setPosition(newPosition);
      resetTimer();
    },
    [
      isLocked,
      containerRef,
      isScrolling,
      position,
      previousPosition,
      previousYPosition,
      scrollDirection,
    ]
  );

  const handleTouchEnd = useCallback(() => {
    snapToSelection();

    setPreviousPosition(0);
    setPreviousYPosition(0);
    setScrollDirection(null);
    setIsScrolling(false);
    clearTimeout(timer.current);
  }, [snapToSelection]);

  function resetTimer() {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      setScrollDirection(null);
    }, 200);
  }

  useEffect(() => {
    const resize = () => {
      const container = containerRef.current;
      if (!container) return;

      setIsResizing(true);
      setWidth(container.clientWidth * children.length);
      setTimeout(() => setIsResizing(false), 500);
    };

    window.addEventListener("resize", resize);
    resize();

    return () => {
      window.removeEventListener("resize", resize);
    };
  }, [containerRef, children]);

  return {
    width,
    position,
    isScrolling,
    isResizing,
    selectIndex,
    handleTouchMove,
    handleTouchStart,
    handleTouchEnd,
    containerRef,
    selectedIndex,
  };
}

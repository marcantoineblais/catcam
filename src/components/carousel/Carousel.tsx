import {
  ReactElement,
  ReactNode,
  TouchEvent,
  useEffect,
  useRef,
  useState,
} from "react";
import CarouselButton from "./CarouselButton";
import React from "react";
import { select } from "@heroui/react";

export default function Carousel({
  sections,
  isLocked = false,
}: {
  sections?: { label: string; node: ReactElement }[];
  isLocked?: boolean;
}) {
  const [buttons, setButtons] = useState<ReactNode[]>([]);
  const [nodes, setNodes] = useState<ReactNode[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const [initPosition, setInitPosition] = useState<number | null>(null);
  const [scrollSpeed, setScrollSpeed] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState<number>(0);
  const [isScrolling, setIsScrolling] = useState<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sections) return;

    const labels = sections.map(({ label }) => label);
    const nodes = sections.map(({ node }) => node);
    const median = Math.floor(labels.length / 2);
    const hasCenter = labels.length % 2 === 1;
    const getAlignment = (i: number) => {
      switch (true) {
        case hasCenter && i === median:
          return "center";
        case i + 1 > median:
          return "right";
        default:
          return "left";
      }
    };

    const buttons = labels.map((label, i) => {
      const isActive = i === selectedIndex;
      const align = getAlignment(i);

      return (
        <CarouselButton
          key={i}
          label={label}
          isActive={isActive}
          onClick={() => setSelectedIndex(i)}
          align={align}
        />
      );
    });

    setButtons(buttons);
    setNodes(nodes);
  }, [sections, selectedIndex]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;
    setWidth(container.clientWidth * nodes.length);
  }, [containerRef, nodes]);

  useEffect(() => {
    if (width === 0) return;
    setIsScrolling(false);
  }, [width]);

  useEffect(() => {
    setScrollPosition(selectedIndex * (width / nodes.length));
  }, [selectedIndex, nodes, width]);

  useEffect(() => {
    setInitPosition(null);
    setScrollSpeed(0);
  }, [isLocked]);

  function handleTouchStart(e: TouchEvent) {
    if (isLocked) return;

    const position = e.touches[0].clientX;
    setInitPosition(position);
    setIsScrolling(true);
  }

  function handleTouchMove(e: TouchEvent) {
    if (isLocked || initPosition === null) return;

    const position = e.touches[0].clientX;
    const delta = initPosition - position;

    setInitPosition(position);
    setScrollSpeed(delta);
    setScrollPosition((position) => {
      const maxScroll = (width / nodes.length) * (nodes.length - 1);
      let newPosition = position + delta;

      if (newPosition < 0) newPosition = 0;
      if (newPosition > maxScroll) newPosition = maxScroll;

      return newPosition;
    });
  }

  function handleTouchEnd() {
    const maxScroll = (width / nodes.length) * (nodes.length - 1);
    let speed = scrollSpeed;
    let currentPosition = scrollPosition;

    const interval = setInterval(() => {
      if (speed === 0) {
        let index = Math.floor(currentPosition / (maxScroll / nodes.length));

        if (index > nodes.length - 1) {
          index = nodes.length - 1;
        }

        const position = selectedIndex * (width / nodes.length);
        setInitPosition(null);
        setScrollPosition(position);
        setScrollSpeed(0);
        setSelectedIndex(index);
        setIsScrolling(false);
        clearInterval(interval);
      } else {
        setScrollPosition((position) => {
          const maxScroll = (width / nodes.length) * (nodes.length - 1);
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
    <div className="z-10 flex-grow flex flex-col bg-gray-100 dark:bg-zinc-900 overflow-hidden landscape:hidden lg:landscape:flex">
      <div className="w-full flex justify-between items-center gap-3">
        {buttons}
      </div>

      <div ref={containerRef} className="pt-3 w-full h-full overflow-hidden">
        <div
          className="relative h-full flex duration-500 data-scrolling:duration-0"
          style={{ width: `${width}px`, left: `${-scrollPosition}px` }}
          data-scrolling={isScrolling || undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {nodes}
        </div>
      </div>
    </div>
  );
}

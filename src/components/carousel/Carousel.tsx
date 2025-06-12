import { ReactElement, ReactNode, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CarouselButton from "./CarouselButton";
import React from "react";
import useScroller from "@/src/hooks/useScroller";

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
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const {
    position,
    isScrolling,
    handleClick,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
  } = useScroller({
    containerRef: containerRef,
    itemsNumber: nodes.length,
    isLocked: isLocked,
  });

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
      const selectIndex = () => {
        setSelectedIndex(i);
        handleClick(i);
      }

      return (
        <CarouselButton
          key={i}
          label={label}
          isActive={isActive}
          onClick={selectIndex}
          align={align}
        />
      );
    });

    setButtons(buttons);
    setNodes(nodes);
  }, [sections, selectedIndex, handleClick]);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;
    setWidth(container.clientWidth * nodes.length);
  }, [containerRef, nodes]);

  useEffect(() => {
    setIsLoaded(width > 0);
  }, [width]);

  return (
    <div className="z-10 flex-grow flex flex-col bg-gray-100 dark:bg-zinc-900 overflow-hidden landscape:hidden lg:landscape:flex">
      <div className="w-full flex justify-between items-center gap-3">
        {buttons}
      </div>

      <div ref={containerRef} className="pt-3 w-full h-full overflow-hidden">
        <div
          className="relative h-full flex duration-500 data-scrolling:duration-0"
          style={{ width: `${width}px`, left: `${-position}px` }}
          data-scrolling={!isLoaded || isScrolling || undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={() => setSelectedIndex(handleTouchEnd())}
        >
          {nodes}
        </div>
      </div>
    </div>
  );
}

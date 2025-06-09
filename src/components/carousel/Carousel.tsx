import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import CarouselButton from "./CarouselButton";
import React from "react";
import useSmoothScroller from "@/src/app/hooks/useSmoothScroller";

export default function Carousel({
  sections,
}: {
  sections?: { label: string; node: ReactElement }[];
}) {
  const [buttons, setButtons] = useState<ReactNode[]>([]);
  const [nodes, setNodes] = useState<ReactNode[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [width, setWidth] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { isScrolling, scrollTo } = useSmoothScroller(carouselRef, "left", 20);

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
    const carousel = carouselRef.current;

    if (!carousel) return;
    setWidth(carousel.clientWidth * nodes.length);
  }, [carouselRef, nodes]);

  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollPosition = selectedIndex * carousel.clientWidth;
    scrollTo(scrollPosition);
  }, [selectedIndex, scrollTo]);

  function handleScrollEnd() {
    const carousel = carouselRef.current;
    if (!carousel || isScrolling) return;

    const scrollPosition = carousel.scrollLeft;
    let index = Math.floor(
      scrollPosition /
        ((carousel.scrollWidth - carousel.clientWidth) / nodes.length)
    );

    if (index > nodes.length - 1) {
      index = nodes.length - 1
    }
    
    if (index === selectedIndex) {
      const scrollPosition = selectedIndex * carousel.clientWidth;
      scrollTo(scrollPosition);
    } else {
      setSelectedIndex(index);
    }
  }

  return (
    <div className="z-10 flex-grow flex flex-col bg-gray-100 dark:bg-zinc-900 overflow-hidden landscape:hidden lg:landscape:flex">
      <div className="w-full flex justify-between items-center gap-3">
        {buttons}
      </div>

      <div
        className="pt-3 w-full h-full overflow-y-hidden overflow-x-scroll no-scrollbar data-no-scroll:overflow-x-hidden"
        ref={carouselRef}
        onScrollEnd={handleScrollEnd}
        data-no-scroll={isScrolling ? true : undefined}
      >
        <div
          className="h-full flex overflow-hidden"
          style={{ width: `${width}px`}}
        >
          {nodes}
        </div>
      </div>
    </div>
  );
}

import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import CarouselButton from "./CarouselButton";
import React from "react";

export default function Carousel({
  sections,
  toggleCarouselDrawer = () => {},
  isOpen = false,
}: {
  sections?: { label: string; node: ReactElement }[];
  isOpen?: boolean;
  toggleCarouselDrawer?: Function;
}) {
  const [buttons, setButtons] = useState<ReactNode[]>([]);
  const [nodes, setNodes] = useState<ReactNode[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

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

    carousel.style.left = `${selectedIndex * -100}%`;
  }, [selectedIndex]);

  return (
    <div className="z-10 flex-grow flex flex-col bg-gray-100 dark:bg-zinc-900 overflow-hidden landscape:hidden lg:landscape:flex">
      <div className="w-full flex flex-col items-center shadow dark:shadow-zinc-50/10">
        <FontAwesomeIcon
          onClick={() => toggleCarouselDrawer()}
          icon={faAngleUp}
          className="duration-500 text-3xl lg:text-5xl cursor-pointer data-active:rotate-180"
          data-active={isOpen ? true : undefined}
        />

        <div className="w-full flex justify-between items-center gap-3">
          {buttons}
        </div>
      </div>

      <div
        className="pt-3 relative flex h-full overflow-hidden"
        ref={carouselRef}
        style={{ width: `${nodes.length * 100}%` }}
      >
        {nodes}
      </div>
    </div>
  );
}

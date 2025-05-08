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
  const [node, setNode] = useState<ReactNode>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sections) return;

    const labels = sections.map(({ label }) => label);
    const node = sections[selectedIndex].node;
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
    setNode(node);
  }, [sections, selectedIndex]);

  useEffect(() => {
  }, [selectedIndex]);

  return (
    <div className="z-10 flex-grow flex flex-col bg-gray-100 dark:bg-zinc-900 overflow-hidden duration-1000 landscape:hidden lg:landscape:flex">
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
        className="pt-3 relative flex h-full duration-700 overflow-hidden"
        ref={carouselRef}
      >
        {node}
      </div>
    </div>
  );
}

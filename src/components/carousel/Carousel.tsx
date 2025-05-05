import { faAngleUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ReactNode, useEffect, useRef, useState } from "react";
import CarouselButton from "./CarouselButton";

export default function Carousel({
  buttonsLabel = [],
  isOpen = false,
  toggleCarouselDrawer = () => {},
  children = [],
}: {
  buttonsLabel?: string[];
  isOpen?: boolean;
  toggleCarouselDrawer?: Function;
  children?: ReactNode[];
}) {
  const [buttons, setButtons] = useState<ReactNode[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const median = Math.floor(buttonsLabel.length / 2);
    const hasCenter = buttonsLabel.length % 2 === 1;
    const getAlignment = (i: number) => {
      switch(true) {
        case hasCenter && i === median:
          return "center";
        case i + 1 > median:
          return "right"
        default:
          return "left"
      }
    }

    const buttons = buttonsLabel.map((label, i) => {
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
  }, [buttonsLabel, selectedIndex]);

  useEffect(() => {
    const carousel = carouselRef.current;

    if (!carousel) return;

    const pageWidth = carousel.clientWidth / children.length;
    const position = pageWidth * selectedIndex;
    carousel.style.left = -position + "px";
  }, [selectedIndex]);

  function calcWidth() {
    return (100 * children.length) + "%"
  }

  return (
    <div className="max-h-full h-full z-10 flex flex-col bg-gray-100 dark:bg-zinc-900 overflow-hidden duration-1000 landscape:hidden lg:landscape:flex">
      <div className="w-full flex flex-col items-center shadow dark:shadow-zinc-50/10">
        <FontAwesomeIcon
          onClick={() => toggleCarouselDrawer()}
          icon={faAngleUp}
          className="-mb-3 text-2xl md:text-3xl duration-500 cursor-pointer data-active:rotate-180"
          data-active={isOpen ? true : undefined}
        />

        <div className="w-full flex justify-between items-center gap-3">
          {buttons}
        </div>
      </div>

      <div
        className="pt-3 relative flex h-full duration-700 overflow-hidden"
        style={{ width: calcWidth() }}
        ref={carouselRef}
      >
        {children}
      </div>
    </div>
  );
}

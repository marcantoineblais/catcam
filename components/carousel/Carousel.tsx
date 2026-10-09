import React from "react";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

import useCarousel from "@/hooks/useCarousel";

type CarouselProps = {
  children: ReactNode[];
  selectors?:
    | ReactNode
    | (({
        selectedIndex,
        selectIndex,
      }: {
        selectedIndex: number;
        selectIndex: (index: number) => void;
      }) => ReactNode);
  isLocked?: boolean;
} & React.ComponentProps<"div">;

export default function Carousel({
  className,
  children,
  selectors,
  isLocked = false,
  ...props
}: CarouselProps) {
  const {
    isResizing,
    selectedIndex,
    position,
    isScrolling,
    selectIndex,
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
    containerRef,
  } = useCarousel({ children, isLocked });

  return (
    <div className={twMerge("z-10 h-full flex flex-col", className)} {...props}>
      <div className="mx-3 md:mx-4 p-1 flex items-center gap-1 rounded-full bg-text/5 ring-1 ring-border">
        {typeof selectors === "function"
          ? selectors({ selectedIndex, selectIndex })
          : selectors}
      </div>

      <div
        ref={containerRef}
        className="flex min-h-0 flex-1 pt-3 w-full overflow-x-hidden"
      >
        {/*
          Sized with percentages (not measured in JS) so the slides are laid
          out correctly from the very first frame: no flash of the filters
          slide on load, and the active slide stays aligned on resize.
          Pixel offsets are only used while the user is dragging.
        */}
        <div
          className="relative h-full flex shrink-0 duration-500 data-scrolling:duration-0"
          style={{
            width: `${children.length * 100}%`,
            left: isScrolling ? `${-position}px` : `${-selectedIndex * 100}%`,
          }}
          data-scrolling={isResizing || isScrolling || undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children.map((child, i) => (
            <div
              className="flex h-full min-w-0"
              style={{ width: `${100 / children.length}%` }}
              aria-hidden={i !== selectedIndex || undefined}
              inert={i !== selectedIndex || undefined}
              key={i}
            >
              {child}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

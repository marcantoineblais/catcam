import useCarousel from "@/src/hooks/useCarousel";
import { ReactNode } from "react";
import React from "react";
import { twMerge } from "tailwind-merge";

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
    width,
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
    <div
      className={twMerge(
        "z-10 h-full flex flex-col bg-gray-100 dark:bg-zinc-900 landscape:hidden lg:landscape:flex",
        className
      )}
      {...props}
    >
      <div className="w-full flex justify-between items-center gap-3">
        {typeof selectors === "function"
          ? selectors({ selectedIndex, selectIndex })
          : selectors}
      </div>

      <div
        ref={containerRef}
        className="flex pt-3 w-full h-full overflow-x-hidden"
      >
        <div
          className="relative h-full flex duration-500 data-scrolling:duration-0"
          style={{ width: `${width}px`, left: `${-position}px` }}
          data-scrolling={isResizing || isScrolling || undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {children.map((child, i) => (
            <div
              className="flex h-full"
              style={{ width: `${width / children.length}px` }}
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

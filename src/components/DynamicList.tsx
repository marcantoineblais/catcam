"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

export default function DynamicList({ children }: { children: ReactNode[] }) {
  const [visibleElements, setVisibleElements] = useState<ReactNode[]>([]);
  const [firstIndex, setFirstIndex] = useState<number>(0);
  const [lastIndex, setLastIndex] = useState<number>(1);
  const [paddingTop, setPaddingTop] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const visibleRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   const container = containerRef.current;
  //   if (!container) return;

  //   container.scrollTo({ top: 0 });

  // }, [children, containerRef]);

  useEffect(() => {
    const container = containerRef.current;
    const visible = visibleRef.current;
    if (!container || !visible) return;

    const onScroll = () => {
      const container = containerRef.current;
      const visible = visibleRef.current;
      if (
        !container ||
        !visible ||
        children.length === 0 ||
        visible.children.length === 0
      )
        return;

      const containerHeight = container.clientHeight;
      const containerWidth = container.clientWidth;
      const currentScroll = container.scrollTop;
      const elementHeight = visible.children[0].clientHeight;
      const elementWidth = visible.children[0].clientWidth;
      const verticalCount = Math.ceil(containerHeight / elementHeight);
      const horizontalCount = Math.floor(containerWidth / elementWidth);
      const scrollRatio = currentScroll / height;
      const scrollRemainder = currentScroll % elementHeight;
      let firstVisibleElement = Math.floor(scrollRatio * children.length);
      firstVisibleElement -= firstVisibleElement % horizontalCount;
      const maxVisibleElements = verticalCount * horizontalCount;
      const paddingTop = currentScroll - scrollRemainder;

      setFirstIndex(firstVisibleElement);
      setLastIndex(firstVisibleElement + maxVisibleElements);
      setPaddingTop(paddingTop);
      console.log(scrollRemainder);
      
    };

    const onResize = () => {
      const container = containerRef.current;
      const visible = visibleRef.current;
      if (!container || !visible || visible.children.length === 0) return;

      const containerWidth = container.clientWidth;
      const elementHeight = visible.children[0].clientHeight;
      const elementWidth = visible.children[0].clientWidth;
      const horizontalCount = Math.floor(containerWidth / elementWidth);
      const containerScrollHeight =
        Math.ceil(children.length / horizontalCount) * elementHeight;
      const currentScroll = container.scrollTop;
      const scrollRemainder = currentScroll % elementHeight;
      const paddingTop = currentScroll - scrollRemainder;
      setHeight(containerScrollHeight);
      setPaddingTop(paddingTop);
    };

    const observer = new ResizeObserver(onResize);
    observer.observe(container);
    container.addEventListener("scroll", onScroll);
    const timeout = setTimeout(() => {
      onResize();
      onScroll();
    }, 10);
    return () => {
      container.removeEventListener("scroll", onScroll);
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [children, containerRef, visibleRef, height]);

  useEffect(() => {
    const visible = visibleRef.current;
    if (!visible) return;

    visible.style.height = height + "px";
    visible.style.paddingTop = paddingTop + "px";
  }, [paddingTop, height]);

  useEffect(() => {
    setVisibleElements(children.slice(firstIndex, lastIndex));
  }, [firstIndex, lastIndex, children]);

  return (
    <div className="w-full h-full overflow-hidden">
      <div className="w-full h-full overflow-y-auto" ref={containerRef}>
        <div
          ref={visibleRef}
          className="flex justify-start content-start flex-wrap"
        >
          {visibleElements}
        </div>
      </div>
    </div>
  );
}

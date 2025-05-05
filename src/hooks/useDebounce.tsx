"use client";

import React from "react";

export default function useDebounce() {
  const timer = React.useRef<NodeJS.Timeout | number>();

  React.useEffect(() => {
    return () => {
      clearTimeout(timer.current);
    };
  }, []);

  const handler = (func: Function, wait: number) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(func, wait);
  };

  return handler;
}

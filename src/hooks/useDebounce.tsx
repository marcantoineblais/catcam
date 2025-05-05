"use client";

import { useEffect, useRef } from "react";

export default function useDebounce() {
  const timer = useRef<NodeJS.Timeout | number>(0);

  useEffect(() => {
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

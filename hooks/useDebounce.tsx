"use client";

import { useEffect, useRef } from "react";

export default function useDebounce() {
  const timer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }
    };
  }, []);

  const handler = (func: () => void, wait: number) => {
    if (timer.current) return;

    timer.current = setTimeout(() => (timer.current = null), wait);
    func();
  };

  return handler;
}

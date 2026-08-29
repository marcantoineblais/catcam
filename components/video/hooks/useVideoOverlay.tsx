import { useCallback, useEffect, useRef, useState } from "react";

const OVERLAY_TIMEOUT = 3000;

type Options = {
  isLoaded: boolean;
  isPlaying: boolean;
};

export default function useVideoOverlay({ isLoaded, isPlaying }: Options) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHideTimeout = useCallback(() => {
    if (!timeoutRef.current) return;

    clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  const hide = useCallback(() => {
    clearHideTimeout();
    setIsVisible(false);
  }, [clearHideTimeout]);

  const show = useCallback(() => {
    if (!isLoaded) return;

    clearHideTimeout();
    setIsVisible(true);

    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        timeoutRef.current = null;
      }, OVERLAY_TIMEOUT);
    }
  }, [clearHideTimeout, isLoaded, isPlaying]);

  const toggle = useCallback(() => {
    setIsVisible((visible) => {
      if (visible) {
        clearHideTimeout();
        return false;
      }

      if (!isLoaded) {
        return false;
      }

      return true;
    });
  }, [clearHideTimeout, isLoaded]);

  useEffect(() => {
    if (!isVisible) return;

    clearHideTimeout();

    if (isPlaying) {
      timeoutRef.current = setTimeout(() => {
        setIsVisible(false);
        timeoutRef.current = null;
      }, OVERLAY_TIMEOUT);
    }

    return clearHideTimeout;
  }, [clearHideTimeout, isPlaying, isVisible]);

  useEffect(() => {
    return clearHideTimeout;
  }, [clearHideTimeout]);

  return {
    isVisible,
    show,
    hide,
    toggle,
  };
}

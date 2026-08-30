import { useCallback, useEffect, useState } from "react";

export default function useVideoFullscreen({ isReady = true } = {}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((fullscreen) => !fullscreen);
  }, []);

  useEffect(() => {
    if (!screen.orientation || !isReady) return;

    function handleOrientationChange() {
      if (screen.orientation.type.startsWith("landscape")) {
        setIsFullscreen(true);
      } else if (screen.orientation.type.startsWith("portrait")) {
        setIsFullscreen(false);
      }
    }

    screen.orientation.addEventListener("change", handleOrientationChange);

    return () => {
      screen.orientation.removeEventListener("change", handleOrientationChange);
    };
  }, [isReady]);

  useEffect(() => {
    const overflow = isFullscreen ? "hidden" : "";
    document.body.style.overflow = overflow;

    return () => {
      document.body.style.overflow = "";
    };
  }, [isFullscreen]);

  return {
    isFullscreen,
    toggleFullscreen,
  };
}

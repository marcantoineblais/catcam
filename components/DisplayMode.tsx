"use client";

import { useCallback, useLayoutEffect, useMemo } from "react";

import { AUTO_DARK_MODE_TIME } from "../app/config";
import { useSession } from "../hooks/useSession";

// App background of each theme, used for the browser and system bars
const THEME_COLORS: Record<string, string> = {
  dark: "#0f0e0d",
  light: "#f7f6f4",
};

export default function DisplayMode() {
  const {
    session: { settings },
  } = useSession();

  const DISPLAY_MODES_CLASSES = useMemo(
    () => ({
      dark: "dark",
      light: "light",
    }),
    [],
  );

  const getDarkModeClass = useCallback(() => {
    if (settings.mode === "dark") {
      return DISPLAY_MODES_CLASSES.dark;
    }

    if (settings.mode === "auto") {
      const { start, end } = AUTO_DARK_MODE_TIME;
      const hour = new Date().getHours();
      const isDarkMode = hour < end || hour >= start;
      if (isDarkMode) return DISPLAY_MODES_CLASSES.dark;
    }

    return DISPLAY_MODES_CLASSES.light;
  }, [settings.mode, DISPLAY_MODES_CLASSES]);

  useLayoutEffect(() => {
    const darkModeClass = getDarkModeClass();
    document.body.classList.add(darkModeClass);
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", THEME_COLORS[darkModeClass]);

    return () => {
      document.body.classList.remove(darkModeClass);
    };
  }, [settings.mode, getDarkModeClass]);

  return null;
}

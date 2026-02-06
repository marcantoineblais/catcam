"use client";

import { useState, useLayoutEffect, useCallback, startTransition, useMemo } from "react";
import { useSession } from "../hooks/useSession";
import { AUTO_DARK_MODE_TIME } from "../config";
import { TZDate } from "@date-fns/tz";

export default function DisplayMode({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const {
    session: { settings },
  } = useSession();

  const DISPLAY_MODES_CLASSES = useMemo(() => ({
    dark: "dark",
    light: "",
  }), []);

  const [darkModeClass, setDarkModeClass] = useState(DISPLAY_MODES_CLASSES.light);
  
  const getDarkModeClass = useCallback(() => {
    if (settings.mode === "dark") {
      return DISPLAY_MODES_CLASSES.dark;
    }

    if (settings.mode === "auto") {
      const { start, end } = AUTO_DARK_MODE_TIME;
      const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      const hour = new TZDate(new Date(), userTimeZone).getHours();
      const isDarkMode = hour < end || hour >= start;
      if (isDarkMode) return DISPLAY_MODES_CLASSES.dark;
    }

    return DISPLAY_MODES_CLASSES.light;
  }, [settings.mode, DISPLAY_MODES_CLASSES]);

  useLayoutEffect(() => {
    startTransition(() => {
      setDarkModeClass(getDarkModeClass());
    });
  }, [settings.mode, getDarkModeClass]);

  return <div className={`${darkModeClass} ${className}`}>{children}</div>;
}

"use client";

import {
  startTransition,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { twJoin } from "tailwind-merge";

import { AUTO_DARK_MODE_TIME } from "../app/config";
import { useSession } from "../hooks/useSession";

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

  const DISPLAY_MODES_CLASSES = useMemo(
    () => ({
      dark: "dark",
      light: "",
    }),
    [],
  );

  const [darkModeClass, setDarkModeClass] = useState(
    DISPLAY_MODES_CLASSES.light,
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
    startTransition(() => {
      setDarkModeClass(getDarkModeClass());
    });
  }, [settings.mode, getDarkModeClass]);

  return <div className={twJoin(darkModeClass, className)}>{children}</div>;
}

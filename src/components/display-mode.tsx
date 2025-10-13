"use client";

import { useMemo } from "react";
import { useSession } from "../hooks/useSession";
import { AUTO_DARK_MODE_TIME } from "../config";

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

  const darkMode = useMemo(() => {
    if (settings.mode === "dark") {
      return "dark";
    } else if (settings.mode === "light") {
      return "";
    } else {
      const { start, end } = AUTO_DARK_MODE_TIME;
      const hour = new Date().getHours();
      return hour < end || hour >= start ? "dark" : "";
    }
  }, [settings.mode]);

  return <div className={`${darkMode} ${className}`}>{children}</div>;
}

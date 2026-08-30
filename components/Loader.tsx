"use client";

import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

export default function Loader({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizeClass = useMemo(() => {
    switch (size) {
      case "sm":
        return "cc-spinner-sm";
      case "lg":
        return "cc-spinner-lg";
      default:
        return "cc-spinner-md";
    }
  }, [size]);

  return (
    <div
      className={twMerge("cc-spinner", sizeClass, className)}
      role="status"
      aria-label="Loading"
    >
      <span className="cc-spinner-ring" aria-hidden="true" />
    </div>
  );
}

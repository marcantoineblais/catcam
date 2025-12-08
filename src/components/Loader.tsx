"use client";

import { Spinner } from "@heroui/react";

export default function Loader({
  size = "md",
  className = "",
}: {
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  return (
    <div className={`${className}`}>
      <Spinner
        classNames={{
          circle1: "text-sky-700 border-b-sky-700",
          circle2: "text-sky-700 border-b-sky-700",
        }}
        size={size}
      />
    </div>
  );
}

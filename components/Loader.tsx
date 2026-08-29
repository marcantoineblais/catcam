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
    <div className={className}>
      <Spinner className="text-sky-700 border-b-sky-700" size={size} />
    </div>
  );
}

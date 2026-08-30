"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

type Props = {
  children: ReactNode;
  isLoading?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export default function Skeleton({
  children,
  isLoading = false,
  className,
  ...props
}: Props) {
  return (
    <div
      className={twMerge(
        "relative",
        isLoading && "overflow-hidden rounded-inherit",
        className,
      )}
      aria-busy={isLoading || undefined}
      {...props}
    >
      <div className={isLoading ? "opacity-0" : undefined}>{children}</div>
      {isLoading && (
        <div
          aria-hidden="true"
          className="cc-skeleton absolute inset-0 bg-surface/80 dark:bg-secondary/80"
        />
      )}
    </div>
  );
}

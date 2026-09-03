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
      className={twMerge("relative group/skeleton", className)}
      data-loading={isLoading || undefined}
      aria-busy={isLoading || undefined}
      {...props}
    >
      <div
        aria-hidden={isLoading || undefined}
        className="group-data-loading/skeleton:cc-skeleton absolute inset-0 bg-secondary/10"
      />
      <div className="w-full h-full group-data-loading/skeleton:invisible">
        {children}
      </div>
    </div>
  );
}

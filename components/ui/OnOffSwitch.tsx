"use client";

import { twJoin, twMerge } from "tailwind-merge";

type OnOffSwitchProps = {
  isOn?: boolean;
  onLabel?: string;
  offLabel?: string;
  height?: number;
  width?: number;
} & React.ComponentProps<"button">;

export default function OnOffSwitch({
  isOn = true,
  onLabel = "ON",
  offLabel = "OFF",
  height = 24,
  width = 56,
  className,
  style,
  ...props
}: OnOffSwitchProps) {
  const radius = height / 2;
  const totalWidth = (width - radius) * 2;
  const fontSize = Math.min(height / 2, width / 6);
  return (
    <button
      className={twMerge(
        "text-sm font-bold rounded-full text-primary-foreground box-content! border-2 border-text/50 ease-in-out cursor-pointer overflow-hidden",
        "disabled:opacity-50 focus:outline-none disabled:cursor-default",
        className,
      )}
      style={{ width, height, ...style }}
      {...props}
    >
      <div
        className="relative h-full flex duration-500"
        style={{
          width: totalWidth,
          left: isOn ? 0 : -(totalWidth / 2) + radius,
          fontSize,
        }}
      >
        <div
          className={twJoin(
            "relative px-1.5 w-full h-full flex justify-start items-center leading-0 rounded-l-full bg-primary",
            "shine-effect",
          )}
        >
          {onLabel}
        </div>

        <div
          className={twJoin(
            "relative px-1.5 w-full h-full flex justify-end items-center rounded-r-full bg-secondary leading-0",
            "shine-effect",
          )}
        >
          {offLabel}
        </div>

        <div
          className={twJoin(
            "absolute! z-10 -top-0.5 -bottom-0.5 left-1/2",
            "-translate-x-1/2 origin-center aspect-square rounded-full",
            "bg-surface-card inset-ring-2 inset-ring-text/50 cursor-pointer",
            "overflow-hidden",
            "before:rounded-full shadow-effect dark:shine-effect",
          )}
        />
      </div>
    </button>
  );
}

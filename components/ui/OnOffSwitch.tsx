"use client";

import { useMemo } from "react";
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
  const radius = useMemo(() => height / 2, [height]);
  const sectionWidth = useMemo(() => width - radius, [width, radius]);
  const knobPosition = useMemo(() => width - height, [width, height]);
  const fontSize = useMemo(
    () => Math.min(height / 2, width / 6),
    [height, width],
  );

  return (
    <button
      className={twMerge(
        "relative text-sm font-bold rounded-full text-primary-foreground box-content! border-2 border-text/50 ease-in-out cursor-pointer shadow-shadow",
        "disabled:opacity-50 focus:outline-none disabled:cursor-default",
        "dark:border-text/30",
        className,
      )}
      style={{ width, height, fontSize, ...style }}
      {...props}
    >
      <div
        className={twJoin(
          "absolute left-0 inset-y-0 pt-0.5 px-1.5 flex justify-start items-center leading-0 rounded-l-full bg-primary overflow-hidden",
          "shine-effect duration-300",
        )}
        style={{ width: isOn ? sectionWidth : 0 }}
      >
        {onLabel}
      </div>

      <div
        className={twJoin(
          "absolute right-0 inset-y-0 pt-0.5 px-1.5 flex justify-end items-center rounded-r-full bg-secondary leading-0 overflow-hidden",
          "shine-effect duration-300",
        )}
        style={{ width: isOn ? 0 : sectionWidth }}
      >
        {offLabel}
      </div>

      <div
        className={twJoin(
          "absolute! z-10 inset-y-0 duration-300 scale-125",
          "origin-center aspect-square rounded-full",
          "bg-radial from-surface-card to-shadow dark:to-shine from-50% cursor-pointer",
          "before:rounded-full dark:shine-effect",
        )}
        style={{ right: isOn ? 0 : knobPosition }}
      />
    </button>
  );
}

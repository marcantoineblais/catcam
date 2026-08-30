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
  height = 28,
  width = 64,
  className,
  style,
  ...props
}: OnOffSwitchProps) {
  const radius = height / 2;
  const totalWidth = (width - radius) * 2;

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
        }}
      >
        <div className="px-1.5 w-full h-full flex justify-start items-center rounded-l-full bg-primary">
          {onLabel}
        </div>

        <div className="px-1.5 w-full h-full flex justify-end items-center rounded-r-full bg-secondary">
          {offLabel}
        </div>

        <div
          className={twJoin(
            "absolute z-10 -top-0.5 -bottom-0.5 left-1/2",
            "-translate-x-1/2 origin-center aspect-square rounded-full",
            "bg-surface-card inset-ring-2 inset-ring-text/50 cursor-pointer",
            "overflow-hidden",

            // Permanent gloss
            "before:pointer-events-none",
            "before:absolute before:top-[8%] before:left-[15%]",
            "before:w-[70%] before:h-[42%]",
            "before:rounded-full",
            "before:bg-linear-to-b before:from-shine/30 before:to-transparent",
          )}
        />
      </div>
    </button>
  );
}

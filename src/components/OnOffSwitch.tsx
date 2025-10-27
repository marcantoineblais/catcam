"use client";

import { twMerge } from "tailwind-merge";

type OnOffSwitchProps = {
  isOn?: boolean;
  onLabel?: string;
  offLabel?: string;
  height?: number;
  width?: number;
  borderWidth?: number;
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
  const totalWidth = (width - radius) * 2

  return (
    <button
      className={twMerge(
        "text-sm font-bold rounded-full text-white box-content! border-2 border-gray-500 dark:border-zinc-500 overflow-hidden ease-in-out cursor-pointer disabled:opacity-50 focus:outline-none disabled:cursor-default",
        className
      )}
      style={{ width, height, ...style }}
      {...props}
    >
      <div className="relative h-full flex duration-500" style={{ width: totalWidth, left: isOn ? 0 : -(totalWidth / 2) + radius}}>
        <div className="px-1.5 w-full h-full flex justify-start items-center rounded-l-full bg-sky-700 dark:bg-sky-700">
          {onLabel}
        </div>

        <div className="px-1.5 w-full h-full flex justify-end items-center rounded-r-full bg-gray-700 dark:bg-zinc-700">
          {offLabel}
        </div>

        <div className="absolute z-10 -top-0.5 -bottom-0.5 left-1/2 -translate-x-[50%] origin-center aspect-square rounded-full bg-gray-50 dark:bg-zinc-100 inset-ring-2 inset-ring-gray-500 dark:inset-ring-zinc-500 cursor-pointer"></div>
      </div>
    </button>
  );
}

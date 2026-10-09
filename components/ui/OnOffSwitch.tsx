"use client";

import { useMemo } from "react";
import { twMerge } from "tailwind-merge";

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
  width = 60,
  className,
  style,
  ...props
}: OnOffSwitchProps) {
  const padding = 3;
  const knobSize = useMemo(() => height - padding * 2, [height]);
  const knobTravel = useMemo(() => width - height, [width, height]);
  const labelInset = useMemo(() => Math.round(height * 0.38), [height]);
  const fontSize = useMemo(
    () => Math.min(height * 0.4, width / 6),
    [height, width],
  );

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      data-on={isOn || undefined}
      className={twMerge(
        "relative shrink-0 rounded-full font-bold tracking-wide cursor-pointer",
        "bg-text/12 inset-shadow-[0_1px_2px_rgb(0_0_0/0.12)]",
        "transition-[background-color,box-shadow,opacity] duration-300 ease-out",
        "data-on:bg-primary data-on:shadow-glow",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
        "disabled:opacity-50 disabled:cursor-default",
        className,
      )}
      style={{ width, height, fontSize, ...style }}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0 left-0 flex items-center leading-none text-primary-foreground transition-opacity duration-300"
        style={{ paddingLeft: labelInset, opacity: isOn ? 1 : 0 }}
      >
        {onLabel}
      </span>

      <span
        aria-hidden="true"
        className="absolute inset-y-0 right-0 flex items-center leading-none text-muted transition-opacity duration-300"
        style={{ paddingRight: labelInset, opacity: isOn ? 0 : 1 }}
      >
        {offLabel}
      </span>

      <span
        aria-hidden="true"
        className="absolute rounded-full bg-white shadow-[0_1px_3px_rgb(0_0_0/0.25),0_2px_8px_-2px_rgb(0_0_0/0.2)] transition-transform duration-300 ease-[cubic-bezier(0.34,1.4,0.64,1)]"
        style={{
          top: padding,
          left: padding,
          width: knobSize,
          height: knobSize,
          transform: `translateX(${isOn ? knobTravel : 0}px)`,
        }}
      />
    </button>
  );
}

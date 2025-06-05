"use client";

export default function OnOffSwitch({
  isOn = true,
  setIsOn = () => {},
  isEnabled = false,
  onLabel = "ON",
  offLabel = "OFF",
}: {
  isOn?: boolean;
  setIsOn?: Function;
  isEnabled?: boolean;
  onLabel?: string;
  offLabel?: string;
}) {
  return (
    <button
      className="h-10 w-20 text-sm font-bold rounded-full text-white overflow-hidden ease-in-out cursor-pointer disabled:grayscale-50 disabled:cursor-default"
      disabled={isEnabled ? undefined : true}
      onClick={isEnabled ? () => setIsOn(!isOn) : undefined}
    >
      <div
        className="relative w-30 h-full flex -translate-x-10 data-on:translate-0 duration-1000 ease-in-out"
        data-on={isOn ? true : undefined}
      >
        <div
          className="px-1.5 w-full h-full flex justify-start items-center rounded-l-full bg-transparent data-on:bg-sky-700 data-on:dark:bg-sky-700 inset-ring-2 inset-ring-gray-50/50 dark:inset-ring-zinc-50/50 delay-1000 data-on:delay-[0ms]"
          data-on={isOn ? true : undefined}
        >
          {onLabel}
        </div>

        <div
          className="px-1.5 w-full h-full flex justify-end items-center rounded-r-full bg-gray-700 dark:bg-zinc-700 data-on:bg-transparent data-on:dark:bg-transparent inset-ring-2 inset-ring-gray-50/50 dark:inset-ring-zinc-50/50 data-on:delay-1000"
          data-on={isOn ? true : undefined}
        >
          {offLabel}
        </div>

        <div className="absolute z-10 top-0 bottom-0 left-1/2 -translate-x-1/2 aspect-square rounded-full bg-white inset-ring-2 inset-ring-gray-900/25 dark:inset-ring-zinc-950/25 dark:bg-zinc-300"></div>
      </div>
    </button>
  );
}

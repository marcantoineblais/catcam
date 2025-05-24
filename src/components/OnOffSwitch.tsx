"use client";

export default function OnOffSwitch({
  isOn = true,
  setIsOn = () => {},
  isEnabled = false,
  onLabel = "ON",
  offLabel = "OFF"
}: {
  isOn?: boolean;
  setIsOn?: Function;
  isEnabled?: boolean;
  onLabel?: string;
  offLabel?: string
}) {
  return (
    <button
      className="h-10 w-20 flex text-sm font-bold inset-ring-2 inset-ring-gray-50/50 dark:inset-ring-zinc-50/50 rounded-full bg-gray-700 dark:bg-zinc-700 duration-500 delay-500 text-white ease-in-out data-on:bg-sky-700 data-on:dark:bg-sky-700 cursor-pointer disabled:grayscale-50 disabled:cursor-default"
      data-on={isOn ? true : undefined}
      disabled={isEnabled ? undefined : true}
      onClick={isEnabled ? () => setIsOn(!isOn) : undefined}
    >
      <div
        className="px-0 w-0 max-w-0 h-full flex justify-start items-center rounded-l-full duration-1000 ease-in-out overflow-hidden data-on:w-10 data-on:max-w-[2.5rem] data-on:px-1.5"
        data-on={isOn ? true : undefined}
      >
        {onLabel}
      </div>

      <div className="z-10 size-10 rounded-full bg-white inset-ring-2 inset-ring-gray-900/25 dark:inset-ring-zinc-950/25 dark:bg-zinc-300"></div>

      <div
        className="px-1.5 w-10 max-w-[2.5rem] h-full flex justify-end items-center rounded-r-full overflow-hidden duration-1000 ease-in-out data-on:w-0 data-on:max-w-0 data-on:px-0"
        data-on={isOn ? true : undefined}
      >
        {offLabel}
      </div>
    </button>
  );
}

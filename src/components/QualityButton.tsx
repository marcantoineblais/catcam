"use client";

import { useEffect } from "react";

export default function QualityButton({
  isHQ = true,
  setIsHQ = () => {},
  isEnabled = false,
}: {
  isHQ?: boolean;
  setIsHQ?: Function;
  isEnabled?: boolean;
}) {
  return (
    <button
      className="h-10 w-20 flex justify-center items-center border-2 border-gray-300 dark:border-zinc-700 rounded-full overflow-hidden cursor-pointer disabled:grayscale-50 disabled:cursor-default"
      onClick={isEnabled ? () => setIsHQ(!isHQ) : undefined}
      disabled={isEnabled ? undefined : true}
    >
      <div className="w-full h-full flex gap-1">
        <div
          className="w-full h-full flex text-sm font-bold bg-gray-700 dark:bg-zinc-700 duration-500 delay-500 ease-in-out data-hq:bg-sky-700 data-hq:dark:bg-sky-700 data-hq:text-white"
          data-hq={isHQ ? true : undefined}
        >
          <div
            className="px-0 w-0 max-w-0 h-full flex justify-start items-center rounded-l-full duration-1000 ease-in-out overflow-hidden data-hq:w-10 data-hq:max-w-[2.5rem] data-hq:px-1.5"
            data-hq={isHQ ? true : undefined}
          >
            HQ
          </div>

          <div className="z-10 w-9 h-9 rounded-full bg-white inset-ring-2 inset-ring-black/10 dark:bg-zinc-900 dark:inset-ring-white/10 origin-center scale-105"></div>

          <div
            className="px-1.5 w-10 max-w-[2.5rem] h-full flex justify-end items-center rounded-r-full overflow-hidden duration-1000 ease-in-out data-hq:w-0 data-hq:max-w-0 data-hq:px-0"
            data-hq={isHQ ? true : undefined}
          >
            SQ
          </div>
        </div>
      </div>
    </button>
  );
}

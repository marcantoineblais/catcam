"use client";

export default function QualityButton({
  isHQ,
  setIsHQ,
}: {
  isHQ: boolean;
  setIsHQ: Function;
}) {
  return (
    <button
      className="h-10 w-20 flex justify-center items-center border-2 border-gray-300 dark:border-zinc-700 rounded-full"
      onClick={() => setIsHQ(!isHQ)}
    >
      <div className="w-full h-full flex gap-1 overflow-x-hidden cursor-pointer rounded-full overflow-hidden">
        <div
          className="w-full h-full flex text-sm font-bold text-white bg-gray-500 dark:bg-zinc-500 duration-500 delay-500 ease-in-out data-hq:bg-sky-700 data-hq:dark:bg-sky-700"
          data-hq={isHQ ? true : undefined}
        >
          <div
            className="px-0 w-0 max-w-0 h-full flex justify-start items-center rounded-l-full duration-1000 ease-in-out overflow-hidden data-hq:w-10 data-hq:max-w-[2.5rem] data-hq:px-1.5"
            data-hq={isHQ ? true : undefined}
          >
            HQ
          </div>

          <div className="z-10 w-9 h-9 rounded-full bg-white cursor-pointer shadow-inner shadow-black/10 dark:bg-zinc-700 dark:shadow-white/10 origin-center scale-105"></div>

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

import { Monitor } from "@/src/models/monitor";
import { ReactNode, useEffect, useState } from "react";

export default function SourceSelector({
  monitors = [],
  selectedMonitor,
  setSelectedMonitor = () => {},
}: {
  monitors?: (Monitor | "all")[];
  selectedMonitor?: Monitor | "all";
  setSelectedMonitor: Function;
}) {
  const [buttons, setButtons] = useState<ReactNode[]>([]);

  useEffect(() => {
    const buttons = monitors.map((monitor, i) => {
      const isActive = selectedMonitor === monitor ? true : undefined;

      return (
        <div key={i} className="p-1.5 w-full md:w-fit md:basis-1/3 h-12">
          <button
            className="w-full h-full bg-gray-700 dark:bg-zinc-700 inset-ring-2 inset-ring-gray-50/50 dark:inset-ring-zinc-50/50 text-white rounded shadow shadow-gray-900/10 cursor-pointer dark:shadow-zinc-50/10 duration-200 hover:brightness-75 data-active:bg-sky-700 data-active:cursor-default data-active:hover:brightness-100 data-active:text-white data-active:shadow-sky-700/10"
            onClick={() => setSelectedMonitor(monitor)}
            data-active={isActive}
          >
            {monitor === "all" ? "All" : monitor.name}
          </button>
        </div>
      );
    });

    setButtons(buttons);
  }, [monitors, selectedMonitor, setSelectedMonitor]);

  return (
    <div className="w-full h-full flex flex-wrap content-start justify-start">
      {buttons}
    </div>
  );
}

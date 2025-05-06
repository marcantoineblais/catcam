import { Monitor } from "@/src/models/monitor";
import { ReactNode, useEffect, useState } from "react";

export default function SourceSelector({
  monitors = [],
  selectedMonitor,
  setSelectedMonitor = () => {},
}: {
  monitors?: Monitor[];
  selectedMonitor?: Monitor;
  setSelectedMonitor: Function;
}) {

  const [buttons, setButtons] = useState<ReactNode[]>([]);

  useEffect(() => {
    const buttons = monitors.map((monitor, i) => {
      const isActive = selectedMonitor === monitor;

      return (
        <div key={i} className="p-1.5 w-full md:w-fit md:basis-1/3 h-12">
          <button
            className="w-full h-full bg-linear-to-t from-gray-900 to-sky-700 text-white rounded shadow shadow-gray-900/50 cursor-pointer dark:shadow-zinc-50/50 duration-200 hover:brightness-125 disabled:cursor-default disabled:brightness-100 disabled:saturate-0"
            onClick={() => setSelectedMonitor(monitor)}
            disabled={isActive}
          >
            {monitor.name}
          </button>
        </div>
      );
    });

    setButtons(buttons);
  }, [monitors, selectedMonitor])

  return (
    <div className="w-full h-full flex flex-wrap content-start justify-start">
      {buttons}
    </div>
  );
}

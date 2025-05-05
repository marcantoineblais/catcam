import { Monitor } from "@/src/models/monitor";

export default function SourceSelector({
  monitors,
  selectedMonitor,
  setSelectedMonitor,
}: {
  monitors?: Monitor[];
  selectedMonitor?: Monitor;
  setSelectedMonitor: Function;
}) {
  function renderButtons() {
    if (monitors)
      return monitors.map((monitor, i) => {
        const isActive = selectedMonitor?.mid === monitor.mid;

        return (
          <div key={i} className="p-1.5 w-full md:w-fit md:basis-1/3 h-12 ">
            <button
              className="w-full h-full bg-linear-to-t from-gray-900 to-sky-700 text-white rounded shadow shadow-gray-900/50 dark:shadow-zinc-50/50 duration-200 hover:brightness-125 disabled:cursor-default disabled:brightness-100 disabled:saturate-0"
              onClick={() => setSelectedMonitor(monitor)}
              disabled={isActive}
            >
              {monitor.name}
            </button>
          </div>
        );
      });
  }

  return (
    <div className="py-3 w-full h-full flex flex-wrap content-start justify-start">
      {renderButtons()}
    </div>
  );
}

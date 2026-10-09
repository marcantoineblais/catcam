import { faLayerGroup, faVideo } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dispatch, SetStateAction } from "react";
import { twJoin, twMerge } from "tailwind-merge";

import { Monitor } from "@/models/monitor";

export default function SourceSelector({
  monitors = [],
  selectedMonitor,
  setSelectedMonitor = () => {},
  className,
}: {
  className?: string;
  monitors?: (Monitor | null)[];
  selectedMonitor?: Monitor | null;
  setSelectedMonitor: Dispatch<SetStateAction<Monitor | null>>;
}) {
  return (
    <div className={twMerge("w-full p-1", className)}>
      {monitors.length === 0 ? (
        <div className="w-full py-8 text-center text-sm text-muted">
          No monitors available
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 content-start">
          {monitors.map((monitor, i) => {
            const isActive = selectedMonitor === monitor;

            return (
              <button
                key={i}
                type="button"
                onClick={() => setSelectedMonitor(monitor)}
                disabled={isActive}
                aria-pressed={isActive}
                data-active={isActive || undefined}
                className={twJoin(
                  "group/source flex h-12 min-w-0 items-center gap-2.5 px-3.5 rounded-soft text-left text-sm font-medium",
                  "bg-text/3 ring-1 ring-border cursor-pointer",
                  "transition-[background-color,box-shadow,color,transform] duration-200 active:scale-[0.98]",
                  "hover:bg-text/6",
                  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                  "data-active:cursor-default data-active:bg-primary data-active:text-primary-foreground data-active:ring-primary data-active:shadow-active data-active:active:scale-100",
                )}
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-text/6 text-xs text-muted transition-colors group-data-active/source:bg-white/20 group-data-active/source:text-primary-foreground">
                  <FontAwesomeIcon icon={monitor ? faVideo : faLayerGroup} />
                </span>
                <span className="truncate">
                  {monitor ? monitor.name : "All"}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

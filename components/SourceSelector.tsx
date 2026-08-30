import { Dispatch, SetStateAction } from "react";

import { Monitor } from "@/models/monitor";

import Button from "./ui/Button";

export default function SourceSelector({
  monitors = [],
  selectedMonitor,
  setSelectedMonitor = () => {},
}: {
  monitors?: (Monitor | null)[];
  selectedMonitor?: Monitor | null;
  setSelectedMonitor: Dispatch<SetStateAction<Monitor | null>>;
}) {
  return (
    <div className="w-full h-full flex flex-wrap content-start justify-start">
      {monitors.length === 0 ? (
        <div className="w-full">
          <h2 className="text-center">No monitors available</h2>
        </div>
      ) : (
        monitors.map((monitor, i) => {
          const isActive = selectedMonitor === monitor ? true : undefined;
          const color = isActive ? "primary" : "default";

          return (
            <div key={i} className="p-1.5 w-full md:w-fit md:basis-1/3 h-12">
              <Button
                className="w-full"
                color={color}
                onClick={() => setSelectedMonitor(monitor)}
              >
                {monitor ? monitor.name : "All"}
              </Button>
            </div>
          );
        })
      )}
    </div>
  );
}

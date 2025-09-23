"use client";

import React, { useEffect, useState } from "react";
import VideoPlayer from "../../components/video/VideoPlayer";
import SourceSelector from "../../components/SourceSelector";
import { Monitor } from "@/src/models/monitor";
import OnOffSwitch from "../../components/OnOffSwitch";
import { useSession } from "@/src/hooks/useSession";

export default function LiveStream() {
  const {
    session: { monitors, settings },
  } = useSession();

  const [selectedMonitor, setSelectedMonitor] = useState<Monitor>(
    monitors.find((m) => m.id === settings.camera) || monitors[0],
  );
  const [videoSource, setVideoSource] = React.useState<string>();
  const [isHQ, setIsHQ] = React.useState<boolean>(settings.quality === "HQ");
  const containerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const streams = selectedMonitor?.streams;
    if (!streams) return;

    const index = streams.length > 1 && !isHQ ? 1 : 0;
    setVideoSource("api" + streams[index]);
  }, [selectedMonitor, isHQ]);

  return (
    <div className="flex flex-col h-full">
      <main className="relative grow p-1 container mx-auto max-w-(--breakpoint-lg) overflow-hidden flex flex-col">
        <div ref={containerRef} className="w-full max-h-full">
          <VideoPlayer
            title={selectedMonitor?.name}
            src={videoSource}
            isLiveStream
          />
        </div>

        <div className="min-h-9 h-12 pt-1 flex justify-end landscape:hidden lg:landscape:flex">
          <OnOffSwitch
            onLabel="HQ"
            offLabel="SQ"
            isOn={isHQ}
            setIsOn={setIsHQ}
            isEnabled={(selectedMonitor?.streams?.length ?? 0) > 1}
          />
        </div>

        <div className="flex flex-col landscape:hidden lg:landscape:flex">
          <h2 className="pl-3 border-b-4 border-sky-700 text-gray-700 cursor-default text-xl text-left duration-200 dark:text-zinc-300">
            {selectedMonitor?.name || ""}
          </h2>

          <SourceSelector
            monitors={monitors}
            selectedMonitor={selectedMonitor}
            setSelectedMonitor={setSelectedMonitor}
          />
        </div>
      </main>
    </div>
  );
}

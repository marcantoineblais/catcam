"use client";

import React, {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import SourceSelector from "../../components/SourceSelector";
import { Monitor } from "@/src/models/monitor";
import OnOffSwitch from "../../components/OnOffSwitch";
import { useSession } from "@/src/hooks/useSession";
import { isMonitorOnline } from "@/src/libs/monitor-status";
import VideoPlayer from "@/src/components/video/VideoPlayer";
import { useVideoPlayer } from "@/src/components/video/provider/VideoPlayerProvider";

export default function LiveStream() {
  const {
    session: { monitors, settings, permissions },
  } = useSession();

  const { selectVideo } = useVideoPlayer();

  const [selectedMonitor, setSelectedMonitor] = useState<Monitor | null>(
    monitors.find((m) => m.id === settings.camera) || monitors[0],
  );
  const [isHQ, setIsHQ] = useState<boolean>(settings.quality === "HQ");
  const containerRef = useRef<HTMLDivElement>(null);

  const isOnline = useMemo(() => {
    if (permissions !== "all") return true;
    return isMonitorOnline(selectedMonitor);
  }, [selectedMonitor, permissions]);

  useEffect(() => {
    if (!selectedMonitor) return;
    
    const streams = selectedMonitor.streams;
    if (!streams) return;

    const index = streams.length > 1 && !isHQ ? 1 : 0;
    startTransition(() => selectVideo({ 
      title: selectedMonitor.name,
      src: streams[index],
      mid: selectedMonitor.id,
      isLiveStream: true,
      isStreamOnline: isOnline,
    }));
  }, [selectedMonitor, isHQ, isOnline, selectVideo]);

  return (
    <div className="flex flex-col h-full">
      <main className="relative grow p-1 container mx-auto max-w-(--breakpoint-lg) overflow-hidden flex flex-col">
        <div ref={containerRef} className="w-full max-h-full">
          <VideoPlayer />
        </div>

        <div className="min-h-9 h-12 pt-1 flex justify-end landscape:hidden lg:landscape:flex">
          <OnOffSwitch
            onLabel="HQ"
            offLabel="SQ"
            isOn={isHQ}
            onClick={() => setIsHQ(!isHQ)}
            disabled={!(selectedMonitor as Monitor)?.streams?.length}
          />
        </div>

        <div className="flex flex-col landscape:hidden lg:landscape:flex">
          <h2 className="pl-3 border-b-4 border-sky-700 text-gray-700 cursor-default text-xl text-left duration-200 dark:text-zinc-300">
            {(selectedMonitor as Monitor)?.name || ""}
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

"use client";

import {
  startTransition,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import SourceSelector from "@/components/SourceSelector";
import OnOffSwitch from "@/components/ui/OnOffSwitch";
import { useVideoPlayer } from "@/components/video/provider/VideoPlayerProvider";
import VideoPlayer from "@/components/video/VideoPlayer";
import { useSession } from "@/hooks/useSession";
import { isMonitorOnline } from "@/libs/monitor-status";
import { Monitor } from "@/models/monitor";

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
      <main className="relative grow p-1 container mx-auto max-w-lg overflow-hidden flex flex-col">
        <div ref={containerRef} className="w-full max-h-full">
          <VideoPlayer />
        </div>

        <div className="min-h-9 h-12 pt-1 flex justify-end">
          <OnOffSwitch
            onLabel="HQ"
            offLabel="SQ"
            isOn={isHQ}
            onClick={() => setIsHQ(!isHQ)}
            disabled={!(selectedMonitor as Monitor)?.streams?.length}
          />
        </div>

        <div className="flex flex-col">
          <h2 className="pl-3 border-b-2 border-text/30 text-text cursor-default text-xl text-left duration-200">
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

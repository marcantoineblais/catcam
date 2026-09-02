"use client";

import { startTransition, useEffect, useMemo, useRef, useState } from "react";

import Container from "@/components/Container";
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
    startTransition(() =>
      selectVideo({
        title: selectedMonitor.name,
        src: streams[index],
        mid: selectedMonitor.id,
        isLiveStream: true,
        isStreamOnline: isOnline,
      }),
    );
  }, [selectedMonitor, isHQ, isOnline, selectVideo]);

  return (
    <Container className="flex flex-col gap-2">
      <div ref={containerRef} className="w-full max-h-full">
        <VideoPlayer />
      </div>

      <div className="pt-4 pb-8 px-2 flex flex-col bg-surface-card rounded-lg shadow-sm">
        <div className="mb-2 flex justify-between items-center border-b-2 pb-1 border-text/30">
          <h2 className="pl-2 text-2xl text-left">
            {(selectedMonitor as Monitor)?.name || ""}
          </h2>

          <OnOffSwitch
            onLabel="HQ"
            offLabel="SQ"
            isOn={isHQ}
            height={22}
            width={48}
            onClick={() => setIsHQ(!isHQ)}
            disabled={!(selectedMonitor as Monitor)?.streams?.length}
          />
        </div>

        <SourceSelector
          monitors={monitors}
          selectedMonitor={selectedMonitor}
          setSelectedMonitor={setSelectedMonitor}
        />
      </div>
    </Container>
  );
}

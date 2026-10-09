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
    <Container className="flex flex-col gap-4">
      <div ref={containerRef} className="w-full card overflow-hidden">
        <VideoPlayer />
      </div>

      <section className="card p-4 md:p-5 flex flex-col gap-4">
        <div className="flex justify-between items-center gap-4">
          <div className="min-w-0">
            <p className="eyebrow">Watching</p>
            <h2 className="mt-0.5 text-xl md:text-2xl font-semibold tracking-tight truncate">
              {(selectedMonitor as Monitor)?.name || "No camera"}
            </h2>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <span className="hidden sm:inline text-sm text-muted">Quality</span>
            <OnOffSwitch
              onLabel="HQ"
              offLabel="SQ"
              isOn={isHQ}
              height={28}
              width={60}
              aria-label="High quality stream"
              onClick={() => setIsHQ(!isHQ)}
              disabled={!(selectedMonitor as Monitor)?.streams?.length}
            />
          </div>
        </div>

        <div className="h-px bg-border" />

        <SourceSelector
          monitors={monitors}
          selectedMonitor={selectedMonitor}
          setSelectedMonitor={setSelectedMonitor}
        />
      </section>
    </Container>
  );
}

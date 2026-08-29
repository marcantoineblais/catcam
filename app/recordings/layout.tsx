"use client";

import { VideoPlayerProvider } from "@/components/video/provider/VideoPlayerProvider";

export default function RecordingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VideoPlayerProvider>{children}</VideoPlayerProvider>;
}

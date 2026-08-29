"use client";

import { VideoPlayerProvider } from "@/src/components/video/provider/VideoPlayerProvider";

export default function LiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <VideoPlayerProvider>{children}</VideoPlayerProvider>;
}

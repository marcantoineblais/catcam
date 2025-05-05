import React from "react";
import Recordings from "./Recordings";
import { fetchMonitors, fetchVideos } from "@/src/utils/fetch";

export default async function RecordingPage() {
  const monitors = await fetchMonitors();
  const videos = await fetchVideos();

  return <Recordings monitors={monitors} videos={videos} />;
}

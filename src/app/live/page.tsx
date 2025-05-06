import React from "react";
import LiveStream from "./LiveStream";
import { fetchMonitors, readSettings } from "@/src/utils/fetch";

export default async function HomePage() {
  const monitors = await fetchMonitors();
  const settings = await readSettings();
  const quality = settings.quality === "HQ" ? "HQ" : "SQ";

  return (
    <LiveStream
      monitors={monitors}
      defaultMonitor={settings.camera}
      defaultQuality={quality}
    />
  );
}

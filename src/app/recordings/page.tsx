import React from "react";
import Recordings from "./Recordings";
import { fetchMonitors, readSettings } from "@/src/utils/fetch";

export default async function RecordingPage() {

    const monitors = await fetchMonitors();
    const settings = readSettings();

    return (
        <Recordings nbItems={settings.nbItems} monitors={monitors} defaultMonitor={settings.camera} />
    );
}
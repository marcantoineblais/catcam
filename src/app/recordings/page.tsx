import React from "react";
import Recordings from "./Recordings";
import { fetchMonitors, readSettings } from "@/src/utils/fetch";

export default async function RecordingPage() {

    let monitors = await fetchMonitors();
    const settings = readSettings();
    
    if (monitors.length > 0) {
        const all = { ...monitors[0] };
        all.name = "All";
        all.mid = "";
        monitors = [all, ...monitors];
    }

    return (
        <Recordings nbItems={settings.nbItems} monitors={monitors} />
    );
}
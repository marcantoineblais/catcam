import React from "react";
import Recordings from "./Recordings";
import { fetchMonitors } from "@/src/utils/fetch";
import { Monitor } from "@/src/models/monitor";

export default async function RecordingPage() {

    let monitors = await fetchMonitors();
    
    if (monitors.length > 0) {
        monitors.sort((m1: Monitor, m2: Monitor) => m1.name > m2.name ? 1 : -1);
        const all = { ...monitors[0] };
        all.name = "All";
        all.mid = "";
        monitors = [all, ...monitors];
    }

    return (
        <Recordings monitors={monitors} />
    );
}
import React from "react";
import LiveStream from "./LiveStream";
import { getDefaultMonitor, getMonitors } from "@/src/utils/read-cookies";

export default async function HomePage() {

    const monitors = await getMonitors();
    const defaultMonitor = await getDefaultMonitor();

    return (
        <LiveStream monitors={monitors} defaultMonitor={defaultMonitor} />
    );
}
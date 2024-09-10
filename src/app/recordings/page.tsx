import React from "react";
import Recordings from "./Recordings";
import { getDefaultMonitor, getMonitors, getNbItems } from "@/src/utils/read-cookies";

export default async function RecordingPage() {

    const monitors = await getMonitors();
    const defaultMonitor = getDefaultMonitor();
    const nbItems = getNbItems();

    return (
        <Recordings nbItems={nbItems} monitors={monitors} defaultMonitor={defaultMonitor} />
    );
}
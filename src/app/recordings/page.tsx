import React from "react";
import Recordings from "./Recordings";
import { getDefaultMonitor, getMonitors, getNbItems } from "@/src/utils/read-cookies";

export default async function RecordingPage() {

    const monitors = await getMonitors();
    const defaultMonitor = await getDefaultMonitor();
    const nbItems = await getNbItems();

    return (
        <main className="flex flex-col">
            <Recordings nbItems={nbItems} monitors={monitors} defaultMonitor={defaultMonitor} />
        </main>
    );
}
import React from "react";
import Settings from "./Settings";
import Navbar from "../../components/navbar/Navbar";
import { getMonitors, getSettings } from "@/src/utils/read-cookies";

export default async function SettingsPage() {

    const monitors = await getMonitors();
    const currentSettings = getSettings();

    return (
        <main className="flex flex-col">
            <Navbar />
            <Settings currentSettings={currentSettings} monitors={monitors} />
        </main>
    );
}
import React from "react";
import Settings from "./Settings";
import Navbar from "../../components/navbar/Navbar";
import { getMonitors, getSettings } from "@/src/utils/read-cookies";

export default async function SettingsPage() {

    const currentSettings = await getSettings();
    const monitors = await getMonitors();

    return (
        <main className="flex flex-col">
            <Navbar />
            <Settings currentSettings={currentSettings} monitors={monitors} />
        </main>
    );
}
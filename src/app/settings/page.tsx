import React from "react";
import Settings from "./Settings";
import { fetchMonitors, readSettings,  } from "@/src/utils/fetch";

export default async function SettingsPage() {

    const monitors = await fetchMonitors();
    const settings = readSettings();

    return (
        <Settings currentSettings={settings} monitors={monitors} />
    )
}
"use client"

import React from "react";
import AuthManager from "../components/AuthManager";
import PageRefresh from "../components/PageRefresh";
import Settings from "./Settings";
import Navbar from "../components/Navbar";
import SettingsManager from "../components/SettingsManager";

export default function SettingsPage() {
    
    const [session, setSession] = React.useState<any>(null)

    return (
        <main className="flex flex-col">
            <AuthManager session={null} setSession={setSession} />
            <SettingsManager session={session} setPageSize={null} />
            <PageRefresh />
            <Navbar activePage="settings"/>
            { session ? <Settings /> : null }
        </main>
    )
}
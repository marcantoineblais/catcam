"use client"

import React from "react";
import LiveStream from "./LiveStream";
import AuthManager from "./components/AuthManager";
import PageRefresh from "./components/PageRefresh";
import SettingsManager from "./components/SettingsManager";

export default function HomePage() {
    
    const [session, setSession] = React.useState<any>(null)

    return (
        <main className="flex flex-col">
            <AuthManager session={session} setSession={setSession} />
            <SettingsManager session={session} setPageSize={null}/>
            <PageRefresh />
            { session ? <LiveStream session={session} setSession={setSession} /> : null }
        </main>
    )
}
"use client"

import React from "react"
import AuthManager from "../components/AuthManager"
import Recordings from "./Recordings"
import PageRefresh from "../components/PageRefresh"
import SettingsManager from "../components/SettingsManager"

export default function RecordingPage() {
    
    const [session, setSession] = React.useState<any>(null)
    const [pageSize, setPageSize] = React.useState(null)
    
    return (
        <main className="flex flex-col">
            <AuthManager session={session} setSession={setSession} />
            <SettingsManager session={session} setPageSize={setPageSize}/>
            <PageRefresh />
            { session ? <Recordings session={session} pageSize={pageSize} setSession={setSession} /> : null }
        </main>
    )
}
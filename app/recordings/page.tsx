"use client"

import React from "react"
import AuthManager from "../components/AuthManager"
import Recordings from "../components/Recordings"
import PageRefresh from "../components/PageRefresh"

export default function RecordingPage() {
    
    const [session, setSession] = React.useState<any>(null)
    const [location, setLocation] = React.useState(null)
    
    return (
        <main className="flex flex-col">
            <AuthManager location={location} setLocation={setLocation} session={null} setSession={setSession} />
            <PageRefresh />
            { session ? <Recordings session={session} /> : null }
        </main>
    )
}
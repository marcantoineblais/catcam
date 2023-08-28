"use client"

import React from "react";
import LiveStream from "./components/LiveStream";
import AuthManager from "./components/AuthManager";

export default function HomePage() {
    
    const [session, setSession] = React.useState<any>(null)
    const [location, setLocation] = React.useState(null)

    return (
        <main className="flex flex-col">
            <AuthManager location={location} setLocation={setLocation} session={null} setSession={setSession} />
            { session ? <LiveStream session={session} /> : null }
        </main>
    )
}
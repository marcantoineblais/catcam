"use client"

import React from "react";
import LiveStream from "./components/LiveStream";
import AuthManager from "./components/AuthManager";

export default function Home() {
    
    const [session, setSession] = React.useState<any>(null)

    return (
        <main>
            <AuthManager setSession={setSession}/>
            { session ? <LiveStream session={session} /> : null }
        </main>
    )
}
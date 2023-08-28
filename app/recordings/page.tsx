"use client"

import React from "react";
import AuthManager from "../components/AuthManager";
import Recordings from "../components/Recordings";

export default function RecordingPage() {
    
    const [session, setSession] = React.useState<any>(null)

    return (
        <main className="flex flex-col">
            <AuthManager setSession={setSession}/>
            { session ? <Recordings session={session} /> : null }
        </main>
    )
}
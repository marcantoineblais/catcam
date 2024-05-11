"use client"

import React from "react"
import AuthManager from "../components/AuthManager"
import Login from "./Login"
import PageRefresh from "../components/PageRefresh"
import SettingsManager from "../components/SettingsManager"

export default function LoginPage() {
    const [session, setSession] = React.useState(null)
    
    return (
        <main>
            <AuthManager session={session} setSession={setSession} />
            <SettingsManager session={session} setPageSize={null}/>
            <PageRefresh />
            <Login setSession={setSession} />
        </main>       
    )
}
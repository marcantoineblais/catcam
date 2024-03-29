"use client"

import React from "react"
import AuthManager from "../components/AuthManager"
import Login from "./Login"
import PageRefresh from "../components/PageRefresh"
import SettingsManager from "../components/SettingsManager"

export default function LoginPage() {

    const [location, setLocation] = React.useState(null)
    const [session, setSession] = React.useState(null)
    
    return (
        <main>
            <AuthManager location={location} setLocation={setLocation} session={session} setSession={setSession} />
            <SettingsManager session={session} setPageSize={null}/>
            <PageRefresh />
            <Login location={location} setSession={setSession} />
        </main>       
    )
}
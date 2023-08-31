"use client"

import React from "react"
import AuthManager from "../components/AuthManager"
import Login from "../components/Login"
import PageRefresh from "../components/PageRefresh"

export default function LoginPage() {

    const [location, setLocation] = React.useState(null)
    const [session, setSession] = React.useState(null)

    return (
        <main>
            <AuthManager location={location} setLocation={setLocation} session={session} setSession={null} />
            <PageRefresh />
            <Login location={location} setSession={setSession} />
        </main>
        
    )
}
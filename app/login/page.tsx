"use client"

import React from "react";
import AuthManager from "../components/AuthManager";
import Login from "../components/Login";

export default function LoginPage() {

    const [location, setLocation] = React.useState(null)
    const [session, setSession] = React.useState(null)

    return (
        <main>
            <AuthManager location={location} setLocation={setLocation} session={session} setSession={null} />
            <Login location={location} setSession={setSession} />
        </main>
    )
}
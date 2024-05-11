"use client"

import React from "react";
import { useRouter } from "next/navigation";

export default function AuthManager(
    { session, setSession }:
    { session: any|null, setSession: Function|null }
) {    

    const router = useRouter()
    const logout = React.useCallback(() => {
        localStorage.removeItem("JWT")
        sessionStorage.clear()
        if (setSession)
            setSession(null)
        
        router.push("/login")
    }, [router, setSession])

    // Prevent use in Iframe
    React.useEffect(() => {
        if (window.top !== window.self)
            window.location.href = document.location.href
    }, [])
    

    // Check if jwt can be found in local or session storage
    React.useEffect(() => {    
        async function getSession() {
            if (session || !setSession)
                return
            
            let jwt: any = JSON.parse(localStorage.getItem("JWT") || "{}")
            
            if (Object.keys(jwt).length !== 3)
                jwt = JSON.parse(sessionStorage.getItem("JWT") || "{}")
            
            if (Object.keys(jwt).length !== 3) {
                logout()
                return
            }
            setSession(jwt)          
        }

        getSession()
    }, [setSession, logout])

    // When login is successful, store jwt in local or session storage
    React.useEffect(() => {
        async function storeSession() {
            if (!session || !setSession)
                return
            
            if (!session.data) {
                if (!session.auth_token)
                    logout()

                return
            }

            const sessionJson = session.data
            const jwt = {
                auth_token: sessionJson.$user.auth_token,
                ke: sessionJson.$user.ke,
                uid: sessionJson.$user.uid
            }
            
            if (session.rememberMe) {
                localStorage.setItem("JWT", JSON.stringify(jwt))
            } else {
                sessionStorage.setItem("JWT", JSON.stringify(jwt))
            }
            setSession(jwt)
        }

        storeSession()
    }, [session, setSession, logout])

    return null
}
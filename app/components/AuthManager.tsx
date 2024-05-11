"use client"

import React from "react";
import { useRouter } from "next/navigation";

export default function AuthManager(
    { session, setSession }:
    { session: any|null, setSession: Function|null }
) {    

    const router = useRouter()

    // Prevent use in Iframe
    React.useEffect(() => {
        if (window.top !== window.self)
            window.location.href = document.location.href
    }, [])
    

    // Check if jwt can be found in local or session storage
    // If cannot be decrypted or some keys are missing, then wipe the storage and redirect to login
    React.useEffect(() => {    
        function logout() {
            localStorage.removeItem("JWT")
            sessionStorage.clear()
            if (setSession)
                setSession(null)
            router.push("/login")
        }

        async function getSession() {
            if (!setSession || !location)
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
    }, [router, setSession])

    // When login is successful, encrypt and store jwt in local or session storage
    React.useEffect(() => {
        async function storeSession() {
            if (!session || !location || !setSession || !session.session)
                return

            const sessionJson = session.session
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
    }, [router, session, setSession])

    return null
}
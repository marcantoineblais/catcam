"use client"

import React from "react";
import { useRouter } from "next/navigation";
import requestJSON from "../util/requestJSON";
import { encryptData, decryptData } from "../util/encryptor"

export default function AuthManager(
    { location, setLocation, session, setSession }:
    { location: any, setLocation: Function, session: any|null, setSession: Function|null }
) {    

    const router = useRouter()

    // Prevent use in Iframe
    React.useEffect(() => {
        if (window.top !== window.self)
            window.location.href = document.location.href
    }, [])
    
    // Verify if the connected user is in a reasonnable area
    React.useEffect(() => {
        async function getLocation() {
            const url = "https://api.ipgeolocation.io/ipgeo?apiKey="
            const data = await requestJSON(url + process.env.geolocationAPIKey)
            
            setLocation(data)
        }

        getLocation()
    }, [setLocation])

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
            
            let jwt
            let decryptedData
            let encryptedData: any = localStorage.getItem("JWT")
            
            if (encryptedData) {
                try {
                    decryptedData = await decryptData(encryptedData)
                    jwt = JSON.parse(decryptedData)
                } catch(ex) {
                    logout()
                }
            }
            
            if (!jwt || Object.entries(jwt).some(([_k, v]) => !v)) {
                encryptedData = sessionStorage.getItem("JWT")
                if (encryptedData) {
                    try {
                        decryptedData = await decryptData(encryptedData)
                        jwt = JSON.parse(decryptedData)
                    } catch(ex) {
                        logout()
                    }
                }                 
            }
            
            if (!jwt || Object.entries(jwt).some(([_k, v]) => !v)) {
                logout()
                return
            }

            if (
                jwt.location && jwt.location.ip !== location.ip && (
                    parseInt(location.latitude) < parseInt(jwt.location.latitude) - 10 || parseInt(location.latitude) > parseInt(jwt.location.latitude) + 10 ||
                    parseInt(location.longitude) < parseInt(jwt.location.longitude) - 10 || parseInt(location.longitude) > parseInt(jwt.location.longitude) + 10 
                )
            ) {
                logout()
                return
            } else if (!jwt.date || Date.now() - jwt.date > (1000 * 3600 * 24 * 7)) { // If token has more than 7 days
                logout()
                return
            } else {
                setSession(jwt)          
            }
        }

        getSession()
    }, [router, location, setSession])

    // When login is successful, encrypt and store jwt in local or session storage
    React.useEffect(() => {
        async function storeSession() {
            if (!session || !location)
                return

            const jwt = session.session
            const sessionLocation = {
                ip: location.ip,
                latitude: location.latitude,
                longitude: location.longitude,
                time_zone: location.time_zone
            }
            const sessionJSON = JSON.stringify({
                auth_token: jwt.$user.auth_token,
                ke: jwt.$user.ke,
                uid: jwt.$user.uid,    
                location: sessionLocation,
                date: Date.now()
            })

            const encryptedSession = await encryptData(sessionJSON)
            if (Object.entries(sessionLocation).some(([_k, v]) => !v))
                session.rememberMe = false

            if (session.rememberMe) {
                localStorage.setItem("JWT", encryptedSession)
            } else {
                sessionStorage.setItem("JWT", encryptedSession)
            }
            
            router.push(localStorage.getItem("landing") || "/")
        }

        storeSession()
    }, [router, location, session, setSession])

    return null
}
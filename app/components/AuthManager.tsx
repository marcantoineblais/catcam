"use client"

import React from "react";
import { useRouter } from "next/navigation";
import requestJSON from "../util/requestJSON";
import { encryptData, decryptData } from "../util/encryptor"

export default function AuthManager({ location, setLocation, session, setSession }: { location: any, setLocation: Function, session: any|null, setSession: Function|null }) {    

    const router = useRouter()

    React.useEffect(() => {
        async function getLocation() {
            const url = "https://api.ipgeolocation.io/ipgeo?apiKey="
            const data = await requestJSON(url + process.env.geolocationAPIKey)
            
            setLocation(data)
        }

        getLocation()
    }, [setLocation])

    React.useEffect(() => {
        
        async function getSession() {
            if (!setSession || !location)
                return
            
            let jwt
            let decryptedData
            let encryptedData: any = localStorage.getItem("JWT")
            
            if (encryptedData) {
                decryptedData = await decryptData(encryptedData)
                jwt = JSON.parse(decryptedData)
            }

            if (!jwt || Object.entries(jwt).some(([_k, v]) => !v)) {
                encryptedData = sessionStorage.getItem("JWT")
                if (encryptedData) {
                    decryptedData = await decryptData(encryptedData)
                    jwt = JSON.parse(decryptedData)
                }                 
            }
        
            if (!jwt || Object.entries(jwt).some(([_k, v]) => !v)) {
                localStorage.clear()
                sessionStorage.clear()
                setSession(null)
                router.push("/login")
                return
            }

            if (
                jwt.location && jwt.location.ip !== location.ip && (
                    parseInt(location.latitude) < parseInt(jwt.location.latitude) - 0.5 || parseInt(location.latitude) > parseInt(jwt.location.latitude) + 0.5 ||
                    parseInt(location.longitude) < parseInt(jwt.location.longitude) - 0.5 || parseInt(location.longitude) > parseInt(jwt.location.longitude) + 0.5 
                )
            ) {
                localStorage.clear()
                sessionStorage.clear()
                setSession(null)
                router.push("/login")
                return
            } else
                setSession(jwt)          
        }

        getSession()
    }, [router, location, setSession])

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
                location: sessionLocation
            })

            const encryptedSession = await encryptData(sessionJSON)
            if (Object.entries(sessionLocation).some(([_k, v]) => !v))
                session.rememberMe = false

            if (session.rememberMe) {
                localStorage.setItem("JWT", encryptedSession)
            } else {
                sessionStorage.setItem("JWT", encryptedSession)
            }
            
            router.push("/")
        }

        storeSession()
    }, [router, location, session, setSession])

    return null
}
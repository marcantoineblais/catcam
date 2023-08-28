"use client"

import React from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import requestJSON from "../util/requestJSON";

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

            let sessionInfo: any = secureLocalStorage.getItem("object")         
            
            if (!sessionInfo || Object.entries(sessionInfo).some(([_k, v]) => !v)) {
                sessionInfo = sessionStorage.getItem("session")
                if (sessionInfo) sessionInfo = JSON.parse(sessionInfo)                 
            }
        
            if (!sessionInfo || Object.entries(sessionInfo).some(([_k, v]) => !v)) {
                secureLocalStorage.clear()
                sessionStorage.clear()
                setSession(null)
                router.push("/login")
            }
            
            if (sessionInfo.location && (sessionInfo.location.country_name !== location.country_name || (sessionInfo.location.ip !== location.ip && sessionInfo.location.city !== location.city))) {
                secureLocalStorage.clear()
                sessionStorage.clear()
                setSession(null)
                router.push("/login")
            } else
                setSession(sessionInfo)   
        }

        getSession()
    }, [router, location, setSession])

    React.useEffect(() => {
        function storeSession() {
            if (!session || !location)
                return

            const sessionInfo = session.session
            const sessionLocation = {
                ip: location.ip,
                city: location.city,
                country_name: location.country_name,
                time_zone: location.time_zone
            }

            if (Object.entries(sessionLocation).some(([_k, v]) => !v))
                session.rememberMe = false

            if (session.rememberMe) {
                secureLocalStorage.setItem("object", {
                    auth_token: sessionInfo.$user.auth_token,
                    ke: sessionInfo.$user.ke,
                    uid: sessionInfo.$user.uid,    
                    location: sessionLocation
                })
            } else {
                sessionStorage.setItem("session", JSON.stringify({
                    auth_token: sessionInfo.$user.auth_token,
                    ke: sessionInfo.$user.ke,
                    uid: sessionInfo.$user.uid,
                    location: sessionLocation
                }))
            }

            router.push("/")
        }

        storeSession()
    }, [router, location, session, setSession])

    return null
}
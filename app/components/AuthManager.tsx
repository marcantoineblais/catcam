"use client"

import React from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import requestJSON from "../util/requestJSON";

export default function AuthManager({ setSession }: { setSession: Function }) {    

    const router = useRouter()

    React.useEffect(() => {
        async function getSession() {
            const url = "https://api.ipgeolocation.io/ipgeo?apiKey="
            const data = await requestJSON(url + process.env.geolocationAPIKey)
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
                return
            }
            
            if (!sessionInfo || (sessionInfo.location.city !== data.city && sessionInfo.location.ip !== data.ip)) {
                secureLocalStorage.clear()
                sessionStorage.clear()
                setSession(null)
                router.push("/login")
                return
            } else
                setSession(sessionInfo)
       
        }

        getSession()
    }, [router, setSession])

    return null
}
"use client"

import React from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";

export default function AuthManager({ setSession }: { setSession: Function }) {    

    const router = useRouter()

    React.useEffect(() => {
        async function getSession() {
            const res: Response = await fetch("https://api.ipify.org?format=json")
            const data: {ip: string} = await res.json()
            const ip: string|null = data.ip
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
            
            if (!sessionInfo || (sessionInfo.ipAddress && ip !== sessionInfo.ipAddress)) {
                secureLocalStorage.clear()
                sessionStorage.clear()
                setSession(null)
                router.push("/login")
                return
            } else
                setSession(sessionInfo)
        }

        getSession()
    }, [])

    return null
}
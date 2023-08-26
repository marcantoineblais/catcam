"use client"

import React from "react";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import LiveStream from "./components/LiveStream";

export default function Home() {

    const [session, setSession] = React.useState<any>(null)
    const router = useRouter()

    React.useEffect(() => {
        async function getSession() {
            const res: Response = await fetch("https://api.ipify.org?format=json")
            const data: {ip: string} = await res.json()
            const ip: string|null = data.ip
            let sessionInfo: any = secureLocalStorage.getItem("object")
            
            if (!sessionInfo || Object.entries(sessionInfo).some(([_k, v]) => !v)) {
                sessionInfo = {
                    auth_token: sessionStorage.getItem("auth_token"),
                    ke: sessionStorage.getItem("ke"),
                    uid: sessionStorage.getItem("uid"),
                }    
            }

            if (Object.entries(sessionInfo).some(([_k, v]) => !v)) {
                secureLocalStorage.clear()
                sessionStorage.clear()
                setSession(null)
                router.push("/login")
            }
            
            if (!sessionInfo || (sessionInfo.ipAddress && ip !== sessionInfo.ipAddress)) {
                secureLocalStorage.clear()
                sessionStorage.clear()
                setSession(null)
                router.push("/login")
            } else
                setSession(sessionInfo)
        }

        getSession()
    }, [])

    return (
        <main>
            { session ? <LiveStream session={session} /> : null }
        </main>
    )
}
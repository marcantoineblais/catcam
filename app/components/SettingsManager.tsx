"use client"

import React from "react"
import { useRouter } from "next/navigation"

export default function SettingsManager({ session, setPageSize }: { session: any, setPageSize: Function|null }) {
    
    const router = useRouter()
       
    // Check if dark mode is activated
    React.useEffect(() => {
        const appearance = localStorage.getItem("appearance")
        
        if (appearance === "dark")
            document.body.classList.add("dark")
        else if (appearance === "auto") {
            const time = new Date(Date.now()).getHours()
            
            if (time >= 20 || time <= 8)
                document.body.classList.add("dark")
            else
                document.body.classList.remove("dark")
        } else 
            document.body.classList.remove("dark")
    })

    React.useEffect(() => {
        const landing = localStorage.getItem("landing")
        const landed = sessionStorage.getItem("landed")
        
        if (!landed && session && landing) {
            router.push(landing)
            sessionStorage.setItem("landed", "true")
        }

    }, [session, router])
    
    React.useEffect(() => {
        if (setPageSize) {
            const pageSize = localStorage.getItem("pageSize")

            if (pageSize) {
                try {
                    setPageSize(parseInt(pageSize))
                } catch (ex) {
                    setPageSize(12)
                }
            }
        }
    }, [setPageSize])

    return null
}
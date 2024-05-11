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
            
            if (time >= 19 || time < 7)
                document.body.classList.add("dark")
            else
                document.body.classList.remove("dark")
        } else 
            document.body.classList.remove("dark")
    })


    // Handle portrait mode
    React.useEffect(() => {
        function portraitModeHandle() {
            const width = window.innerWidth
            const height = window.innerHeight
            
            if (width > height && height < 420)
                document.body.classList.add("paysage")
            else
                document.body.classList.remove("paysage")
        }

        portraitModeHandle()
        window.addEventListener("resize", portraitModeHandle)
        
        return () => {
            window.removeEventListener("resize", portraitModeHandle)
        }
    }, [])
    

    // Apply to number of pages set in settings when in recordings
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

    // Redirect to recordings on first connection
    React.useEffect(() => {
        if (!session)
            return
        
        let landed = sessionStorage.getItem("landed")
        
        if (!landed) {            
            sessionStorage.setItem("landed", "1")
            router.push(localStorage.getItem("landing") || "/")
        }

    }, [session, router])

    return null
}
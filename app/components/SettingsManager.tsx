"use client"

import React from "react"
import { useRouter } from "next/navigation"

export default function SettingsManager({ session, setPageSize }: { session: any, setPageSize: Function|null }) {
    
    const [unsupportedSize, setUnsupportedSize] = React.useState<boolean>(false) 
    const router = useRouter()
       
    // Check if dark mode is activated
    React.useEffect(() => {
        const appearance = localStorage.getItem("appearance")
        
        if (appearance === "dark")
            document.body.classList.add("dark")
        else if (appearance === "auto") {
            const time = new Date(Date.now()).getHours()
            
            if (time >= 20 || time < 8)
                document.body.classList.add("dark")
            else
                document.body.classList.remove("dark")
        } else 
            document.body.classList.remove("dark")
    }, [])

    React.useEffect(() => {
        function portraitModeHandle() {
            const width = window.innerWidth
            const height = window.innerHeight
            
            if (width > height && height < 380)
                document.body.classList.add("paysage")
            else
                document.body.classList.remove("paysage")
        }

        portraitModeHandle()
        window.addEventListener("resize", portraitModeHandle)
        
        return () => {
            window.removeEventListener("resize", portraitModeHandle)
        }
    }, [setUnsupportedSize])

    React.useEffect(() => {
        const landing = localStorage.getItem("landing")
        const landed = sessionStorage.getItem("landed")
        
        if (!landed && session && landing) {
            sessionStorage.setItem("landed", "true")
            router.push(landing)
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

    if (unsupportedSize) {
        return (
            <div className="z-50 fixed top-0 bottom-0 left-0 right-0 flex flex-col justify-center items-center bg-black text-gray-50">
                <span>Unsupported screen orientation.</span>
                <span>Please resize window or rotate device.</span>
            </div>
        )
    } else {
        return null
    }
}
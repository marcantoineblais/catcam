"use client"

import { useRouter } from "next/navigation"
import React from "react"

export default function PageRefresh() {

    const refreshTimer: any[] = React.useState<any[]>([])
    const router = useRouter()

    // Refresh page when scrolling down and releasing (overwrite default behavior)
    React.useEffect(() => {
        const refreshPage = (e: TouchEvent) => {
            const refreshIcon = document.getElementById("refresh")
            const body = document.body
            const start = e.touches[0].clientY

            if (!refreshIcon)
                return

            const clearListeners = () => {
                refreshTimer.forEach(t => clearTimeout(t))
                refreshTimer.splice(0, refreshTimer.length)
                refreshIcon.classList.add("-translate-y-16")
                window.removeEventListener("touchmove", scrollToRefresh)
                window.removeEventListener("touchend", refresh)
            }

            const refresh = () => {
                clearListeners()
                router.refresh()
            }

            const scrollToRefresh = (e: TouchEvent) => {
                if (e.touches.length > 1) {
                    clearListeners()
                    return
                }

                const position = e.touches[0].clientY
                const scrollValue = ((position - start) / body.clientHeight)


                if (scrollValue > 0.1) {
                    refreshIcon.classList.remove("-translate-y-16")
                    if (refreshTimer.length === 0) {
                        refreshTimer.push(setTimeout(() => {
                            window.removeEventListener("touchend", clearListeners)
                            window.addEventListener("touchend", refresh)
                            refreshTimer.forEach(t => clearTimeout(t))
                            refreshTimer.splice(0, refreshTimer.length)
                        }, 200))
                    }
                } else {
                    refreshIcon.classList.add("-translate-y-16")
                    refreshTimer.forEach(t => clearTimeout(t))
                    refreshTimer.splice(0, refreshTimer.length)
                    window.removeEventListener("touchend", refresh)
                    window.addEventListener("touchend", clearListeners)
                }
            }

            window.addEventListener("touchend", clearListeners)
            window.addEventListener("touchmove", scrollToRefresh)
        }

        window.addEventListener("touchstart", refreshPage)

        return () => {
            window.removeEventListener("touchstart", refreshPage)
        }
    })

    return (
        <div id="refresh" className="fixed top-0 left-0 right-0 h-12 flex justify-center items-center bg-gray-50/50 dark:bg-zinc-950/50 -translate-y-16 duration-200">
            <div className="w-8 h-8 z-50 animate-spin">
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500">
                    <path fill="currentColor" d="M250,20.23c-125.72,0-227.64,101.92-227.64,227.64,0,125,100.67,226.37,225.33,227.61q0-14.87,0-29.73,0-10.26,0-20.51a177.74,177.74,0,0,1-89.23-24.36L122.33,373a178.28,178.28,0,0,1-45.91-78.76q-3.18-23.73-6.37-47.46A134.36,134.36,0,0,1,85.42,178a133.8,133.8,0,0,1,36.91-57.45,133.78,133.78,0,0,1,57.44-36.9,134.5,134.5,0,0,1,68.78-15.38,177.73,177.73,0,0,1,90.09,24.37l36.12,27.91a178.32,178.32,0,0,1,45.91,78.77q3.18,23.73,6.38,47.45a136.38,136.38,0,0,1-6.19,46.79q11.59,11.37,23,22.86Q452.45,325,461,333.55a227,227,0,0,0,16.69-85.68C477.64,122.15,375.72,20.23,250,20.23Z"/>
                    <path fill="currentColor" d="M247.25,425.25h5.57a4.06,4.06,0,0,1,4.06,4.06v42.1a4.06,4.06,0,0,1-4.06,4.06h-5.57a0,0,0,0,1,0,0V425.25A0,0,0,0,1,247.25,425.25Z"/>
                    <path fill="currentColor" d="M391,391.36,498.22,329a3.58,3.58,0,0,0,0-6.19L391.39,261.17a3.58,3.58,0,0,0-5.36,3.09l-.38,124A3.58,3.58,0,0,0,391,391.36Z"/>
                </svg>
            </div>
        </div>
    )
}
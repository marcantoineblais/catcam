"use client"

import React from "react"
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useRouter } from "next/navigation"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Catcam',
    description: 'Catcam live stream app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

    const [refreshTimer] = React.useState<any[]>([])
    const refreshIconRef = React.useRef<HTMLImageElement|null>(null)
    const router = useRouter()

    React.useEffect(() => {
        if (window.top !== window.self)
            window.location.href = document.location.href
    }, [])

    React.useEffect(() => {
        const refreshPage = (e: TouchEvent) => {
            const refreshIcon = refreshIconRef.current
            const body = document.body
            const start = e.touches[0].clientY
            
            if (!refreshIcon)
                return

            const clearListeners = () => {
                refreshTimer.forEach(t => clearTimeout(t))
                refreshTimer.splice(0, refreshTimer.length)
                // refreshIcon.classList.add("-translate-y-36")
                // refreshIcon.classList.remove("animate-spin")
                window.removeEventListener("touchmove", scrollToRefresh)
                window.removeEventListener("touchend", refresh)
            }

            const refresh = () => {
                refreshIcon.classList.add("animate-spin")
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
                    refreshIcon.classList.remove("-translate-y-36", "-rotate-180")
                    if (refreshTimer.length === 0) {
                        refreshTimer.push(setTimeout(() => {
                            window.removeEventListener("touchend", clearListeners)
                            window.addEventListener("touchend", refresh)
                            refreshTimer.forEach(t => clearTimeout(t))
                            refreshTimer.splice(0, refreshTimer.length)
                        }, 200))
                    }
                } else {
                    refreshIcon.classList.remove("rotate-360")
                    refreshIcon.classList.add("-translate-y-36")

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
        <html lang="en">
            <body className={inter.className}>
                <img ref={refreshIconRef} src="Refresh.svg" alt="refresh icon" className="top-4 absolute w-full h-8 z-50 object-contain -rotate-180 duration-500 -translate-y-36" />
                {children}
            </body>
        </html>
    )
}

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
        <html lang="en">
            <body className={inter.className}>
                <div ref={refreshIconRef} className="absolute top-0 left-0 right-0 h-12 flex justify-center items-center bg-gray-950/10 -translate-y-16 duration-200">
                    <img src="Refresh.svg" alt="refresh icon" className="w-full h-8 z-50 object-contain animate-spin" />
                </div>
                {children}
            </body>
        </html>
    )
}

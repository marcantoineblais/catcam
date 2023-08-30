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
                window.removeEventListener("touchmove", scrollToRefresh)
                window.removeEventListener("touchend", refresh)
            }

            const refresh = () => {
                clearListeners()
                router.reload()
            }

            const scrollToRefresh = (e: TouchEvent) => {
                if (e.touches.length > 1) {
                    clearListeners()
                    return
                }

                const position = e.touches[0].clientY
                const scrollValue = ((position - start) / body.clientHeight) * 100

                if (scrollValue > 15) {
                    refreshIcon.classList.remove("-translate-y-50")
                    refreshIcon.classList.add("animate-spin-1")
                    if (refreshTimer.length === 0) {
                        refreshTimer.push(setTimeout(() => {
                            window.removeEventListener("touchend", clearListeners)
                            window.addEventListener("touchend", refresh)
                            refreshTimer.forEach(t => clearTimeout(t))
                            refreshTimer.splice(0, refreshTimer.length)
                        }, 350))
                    }
                } else {
                    refreshIcon.classList.remove("animate-spin-1")
                    refreshIcon.classList.add("-translate-y-50")

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
                {children}
            </body>
        </html>
    )
}

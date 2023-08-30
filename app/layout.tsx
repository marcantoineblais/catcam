import React from "react"
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useRouter } from "next/navigation"
import PageRefresh from "./components/PageRefresh"

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Catcam',
    description: 'Catcam live stream app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <body className={inter.className}>
                <PageRefresh />
                <div id="refresh" className="absolute top-0 left-0 right-0 h-12 flex justify-center items-center bg-gray-950/10 -translate-y-16 duration-200">
                    <img src="Refresh.svg" alt="refresh icon" className="w-full h-8 z-50 object-contain animate-spin" />
                </div>
                {children}
            </body>
        </html>
    )
}

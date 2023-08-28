"use client"

import React from "react"
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Catcam',
    description: 'Catcam live stream app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {

    React.useEffect(() => {
        if (window.top !== window.self)
            window.location.href = document.location.href
    }, [])

    return (
        <html lang="en">
            <body className={inter.className}>{children}</body>
        </html>
    )
}

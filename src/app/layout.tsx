import React from "react";
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from "next/headers";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Catcam',
    description: 'Catcam live stream app',
};

async function darkMode() {
    const mode = cookies().get("mode")?.value || "";

    if (mode === "auto") {
        const time = new Date(Date.now());

        if (time.getHours() > 19 || time.getHours() < 7)
            return "dark"
    }

    return mode;
}

export default async function RootLayout({ children }: { children: React.ReactNode; }) {

    const darkClass = await darkMode();

    return (
        <html lang="en">
            <body className={`${inter.className} ${darkClass}`}>{children}</body>
        </html>
    );
}

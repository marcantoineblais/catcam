import React from "react";
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { cookies } from "next/headers";
import ServiceManager from "../components/ServiceManager";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    title: 'Catcam',
    description: 'Catcam live stream app',
    icons: [{
        rel: "icon",
        url: "/favicon.ico",
        type: "image/x-icon",
        sizes: "any"
    }],
    applicationName: "Catcam"
};

async function darkMode() {
    const mode = cookies().get("mode")?.value || "";

    if (mode === "auto") {
        const time = new Date(Date.now());
        const offset = -5;
        time.setHours(time.getHours() + offset);

        if (time.getHours() > 19 || time.getHours() < 7 - 5)
            return "dark"
    }

    return mode;
}

export default async function RootLayout({ children }: { children: React.ReactNode; }) {

    const darkClass = await darkMode();

    return (
        <html lang="en">
            <ServiceManager />
            
            <body className={`${inter.className} ${darkClass}`}>
                {children}
            </body>
        </html>
    );
}

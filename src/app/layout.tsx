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
    return cookies().get("mode")?.value || "";
}

export default async function RootLayout({ children }: { children: React.ReactNode; }) {

    const darkClass = await darkMode();

    return (
        <html lang="en">
            <body className={`${inter.className} ${darkClass}`}>{children}</body>
        </html>
    );
}

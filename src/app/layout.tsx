import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import Navbar from "../components/navbar/Navbar";
import { AUTO_DARK_MODE_TIME } from "../config";
import SessionWrapper from "../components/SessionWrapper";
import { fetchSession } from "../utils/fetch";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Catcam",
  description: "Catcam live stream app",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
      type: "image/x-icon",
      sizes: "any",
    },
  ],
  applicationName: "Catcam",
};

function darkMode(mode = "light") {
  if (mode === "auto") {
    const { start, end } = AUTO_DARK_MODE_TIME;
    const now = new Date();

    if (now.getHours() >= start || now.getHours() < end) {
      return "dark";
    }
  }

  return mode;
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await fetchSession();
  const dark = darkMode(session?.settings?.mode);
  return (
    <html lang="en">
      <body
        className={`${inter.className} ${dark} bg-gray-100 text-gray-900 dark:bg-zinc-900 dark:text-zinc-50 h-[100lvh] w-[100lvw]`}
      >
        <SessionWrapper initialSession={session}>
          <div className="flex flex-col h-[100dvh] w-[100dvw] overflow-hidden">
            <Navbar />
            {children}
          </div>
        </SessionWrapper>
      </body>
    </html>
  );
}

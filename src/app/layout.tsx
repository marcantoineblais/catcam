import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import ServiceManager from "../components/ServiceManager";
import Navbar from "../components/navbar/Navbar";

const inter = Inter({ subsets: ["latin"] });
const autoDarkModeTime = { start: 19, end: 7 };

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

async function darkMode() {
  const cookiesValue = await cookies();
  const mode = cookiesValue.get("mode")?.value || "";
  const { start, end } = autoDarkModeTime;

  if (mode === "auto") {
    const time = new Date(Date.now());
    const timezoneOffset = parseInt(cookiesValue.get("timezone")?.value || "0");
    time.setMinutes(time.getUTCMinutes() - timezoneOffset);

    if (time.getUTCHours() > start || time.getUTCHours() < end) {
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
  const dark = await darkMode();

  return (
    <html lang="en" className={dark}>
      {/* <ServiceManager /> */}

      <body className={inter.className}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}

import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { cookies } from "next/headers";
import ServiceManager from "../components/ServiceManager";
import Navbar from "../components/navbar/Navbar";
import { TZDate } from "@date-fns/tz";

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
    const timezone = cookiesValue.get("timezone")?.value || "GMT_0000";
    const time = new TZDate(new Date(), timezone);

    if (time.getHours() >= start || time.getHours() < end) {
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

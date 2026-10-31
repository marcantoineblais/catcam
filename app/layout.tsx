import "./globals.css";

import type { Metadata, Viewport } from "next";
import { Sora } from "next/font/google";
import { redirect } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

import Footer from "@/components/Footer";
import Splash from "@/components/splash/Splash";
import { APPLE_STARTUP_IMAGES } from "@/libs/pwa";
import { getSession } from "@/services/session-service";

import DisplayMode from "../components/DisplayMode";
import { ModalProvider } from "../components/modal/useModal";
import Navbar from "../components/navbar/Navbar";
import { SessionProvider } from "../hooks/useSession";
import { DEFAULT_SETTINGS } from "./config";

export const sora = Sora({
  subsets: ["latin"],
  variable: "--font-nunito-sans",
});

export const metadata: Metadata = {
  title: "Catcam",
  description: "Catcam live stream app",
  icons: [
    {
      rel: "icon",
      url: "/favicon.ico",
      sizes: "32x32",
    },
    {
      rel: "icon",
      url: "/pwa/icon.svg",
      type: "image/svg+xml",
    },
    {
      rel: "apple-touch-icon",
      url: "/pwa/apple-touch-icon.png",
      sizes: "180x180",
    },
  ],
  applicationName: "Catcam",
  appleWebApp: {
    capable: true,
    title: "Catcam",
    statusBarStyle: "default",
    startupImage: APPLE_STARTUP_IMAGES,
  },
  // Launch images need the legacy tag on older iOS versions
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  // Light background; DisplayMode switches it with the theme
  themeColor: "#f7f6f4",
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, error } = await getSession();
  if (error) {
    redirect("/api/auth/logout");
  }

  return (
    <html lang="en">
      <body
        className={twMerge(
          "h-lvh w-lvw bg-app text-text antialiased overflow-y-auto overflow-x-hidden",
          sora.className,
        )}
      >
        <Splash mode={session?.settings.mode ?? DEFAULT_SETTINGS.mode} />
        <div className="w-dvw h-lvh flex flex-col">
          <SessionProvider initialSession={session}>
            <ModalProvider>
              <DisplayMode />
              <Navbar />
              {children}
              <Footer />
            </ModalProvider>
          </SessionProvider>
        </div>
      </body>
    </html>
  );
}

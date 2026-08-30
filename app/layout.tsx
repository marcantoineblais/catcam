export const dynamic = "force-dynamic";

import "./globals.css";

import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

import DisplayMode from "../components/DisplayMode";
import { ModalProvider } from "../components/modal/useModal";
import Navbar from "../components/navbar/Navbar";
import { SessionProvider } from "../hooks/useSession";
import { SessionService } from "../services/session-service";
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
      type: "image/x-icon",
      sizes: "any",
    },
  ],
  applicationName: "Catcam",
};

async function getSession() {
  try {
    return await SessionService.getSession();
  } catch (error) {
    console.error("[GetSession] Error while fetching session:", error);

    const headersStore = await headers();
    const currentPath = headersStore.get("x-pathname") || "";

    // Prevent redirect loop on token revocation
    if (currentPath === "/logout") {
      return {
        monitors: [],
        videos: [],
        settings: DEFAULT_SETTINGS,
      };
    }

    redirect("/logout");
  }
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="en">
      <body
        className={twMerge(
          "h-lvh w-lvw bg-surface text-text overflow-y-auto overflow-x-hidden",
          sora.className,
        )}
      >
        <div className="w-dvw h-lvh">
        <SessionProvider initialSession={session}>
          <ModalProvider>
            <DisplayMode className="flex flex-col h-full w-full">
              <Navbar />
              {children}
            </DisplayMode>
          </ModalProvider>
        </SessionProvider>
        </div>
      </body>
    </html>
  );
}

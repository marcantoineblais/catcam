export const dynamic = "force-dynamic";

import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/navbar/Navbar";
import SessionWrapper from "../components/SessionWrapper";
import { redirect } from "next/navigation";
import DisplayMode from "../components/display-mode";
import ModalWrapper from "../components/modal-wrapper";
import { headers } from "next/headers";
import { DEFAULT_SETTINGS } from "../config";
import { SessionService } from "../services/session-service";

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
      <body className={`${inter.className} h-lvh w-lvw overflow-x-hidden`}>
        <SessionWrapper initialSession={session}>
          <ModalWrapper>
            <DisplayMode className="flex flex-col h-dvh w-dvw bg-gray-100 text-gray-900 dark:bg-zinc-900 dark:text-zinc-50 overflow-hidden">
              <Navbar />
              {children}
            </DisplayMode>
          </ModalWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}

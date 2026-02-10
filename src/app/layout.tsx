export const dynamic = "force-dynamic";

import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/navbar/Navbar";
import { redirect } from "next/navigation";
import DisplayMode from "../components/display-mode";
import { headers } from "next/headers";
import { DEFAULT_SETTINGS, DOMAIN_NAME } from "../config";
import { SessionService } from "../services/session-service";
import { ModalProvider } from "../hooks/useModal";
import { SessionProvider } from "../hooks/useSession";
import { ConfigProvider } from "../hooks/use-config";

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
  const config = {
    domainName: DOMAIN_NAME,
  };

  return (
    <html lang="en">
      <body
        className={`${inter.className} h-screen w-screen max-w-screen max-h-screen overflow-x-hidden`}
      >
        <SessionProvider initialSession={session}>
          <ConfigProvider config={config}>
            <ModalProvider>
              <DisplayMode className="flex flex-col h-dvh w-dvw max-w-dvw max-h-dvh bg-gray-100 text-gray-900 dark:bg-zinc-900 dark:text-zinc-50 overflow-hidden">
                <Navbar />
                {children}
              </DisplayMode>
            </ModalProvider>
          </ConfigProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

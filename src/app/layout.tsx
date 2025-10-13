export const dynamic = "force-dynamic";

import React from "react";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "../components/navbar/Navbar";
import SessionWrapper from "../components/SessionWrapper";
import { fetchSession } from "../libs/fetch";
import { redirect } from "next/navigation";
import DisplayMode from "../components/display-mode";
import ModalWrapper from "../components/modal-wrapper";

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
    const session = await fetchSession();
    return session;
  } catch (error) {
    console.error("[GetSession] Error while fetching session:", error);
    redirect("/login");
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
      <body className={`${inter.className} h-[100lvh] w-[100lvw]`}>
        <SessionWrapper initialSession={session}>
          <ModalWrapper>
            <DisplayMode className="flex flex-col h-[100dvh] w-[100dvw] bg-gray-100 text-gray-900 dark:bg-zinc-900 dark:text-zinc-50 overflow-hidden">
              <Navbar />
              {children}
            </DisplayMode>
          </ModalWrapper>
        </SessionWrapper>
      </body>
    </html>
  );
}

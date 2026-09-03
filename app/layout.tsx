import "./globals.css";

import type { Metadata } from "next";
import { Sora } from "next/font/google";
import { redirect } from "next/navigation";
import React from "react";
import { twMerge } from "tailwind-merge";

import Footer from "@/components/Footer";
import { getSession } from "@/services/session-service";

import DisplayMode from "../components/DisplayMode";
import { ModalProvider } from "../components/modal/useModal";
import Navbar from "../components/navbar/Navbar";
import { SessionProvider } from "../hooks/useSession";

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
          "h-lvh w-lvw bg-surface text-text overflow-y-auto overflow-x-hidden",
          sora.className,
        )}
      >
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

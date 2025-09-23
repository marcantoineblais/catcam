"use client";

import { SessionProvider } from "../hooks/useSession";
import { Session } from "../models/session";

export default function SessionWrapper({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Session;
}) {
  return (
    <SessionProvider initialSession={initialSession}>
      {children}
    </SessionProvider>
  );
}

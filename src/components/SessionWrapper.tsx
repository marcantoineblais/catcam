"use client";

import { SessionProvider } from "../hooks/useSession";
import { Session } from "../models/session";

const SessionWrapper = ({
  children,
  initialSession,
}: {
  children: React.ReactNode;
  initialSession: Session;
}) => {
  return (
    <SessionProvider initialSession={initialSession}>
      {children}
    </SessionProvider>
  );
};

export default SessionWrapper;

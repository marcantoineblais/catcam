import { createContext, useCallback, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { Session } from "../models/session";
import { DEFAULT_SETTINGS } from "../config";

type SessionContextType = {
  session: Session;
  getSession: () => Promise<any>;
  updateSession: (data: Partial<Session>) => void;
  signIn: (data: any) => Promise<{ ok: boolean; session?: Session }>;
  signOut: () => Promise<void>;
};

type SessionProviderProps = React.PropsWithChildren<{
  initialSession: Session;
}>;

const SessionContext = createContext<SessionContextType>({
  session: {
    authToken: null,
    groupKey: null,
    monitors: [],
    videos: [],
    settings: DEFAULT_SETTINGS,
  },
  getSession: async () => {},
  updateSession: () => {},
  signIn: async () => ({ ok: false }),
  signOut: async () => {},
});

export function SessionProvider({
  children,
  initialSession = {
    authToken: null,
    groupKey: null,
    monitors: [],
    videos: [],
    settings: DEFAULT_SETTINGS,
  },
}: SessionProviderProps) {
  const [session, setSession] = useState<Session>(initialSession);
  const router = useRouter();

  // Renew token and update session data
  const getSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (response.ok) {
        setSession(data.session);
        return data.session;
      }
    } catch (error) {
      setSession((prev) => ({
        ...prev,
        authToken: null,
        groupKey: null,
        monitors: [],
        videos: [],
      }));
      console.error("[GetSession] Error while fetching session:", error);
      throw error;
    }
  }, []);

  const updateSession = useCallback((data: Partial<Session>) => {
    setSession((prev) => ({
      ...prev,
      ...data,
    }));
  }, []);

  const signIn = useCallback(
    async (data: any) => {
      try {
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (response.ok) {
          const session = await getSession();
          router.replace("/");
          return { ok: true, session };
        } else {
          return { ok: false };
        }
      } catch (error) {
        console.error("SignIn error:", error);
        throw error;
      }
    },
    [getSession, router],
  );

  const signOut = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/logout");

      if (response.ok) {
        setSession((prev) => ({
          ...prev,
          authToken: null,
          groupKey: null,
          monitors: [],
          videos: [],
        }));
        router.push("/login");
      } else {
        throw new Error("Logout failed");
      }
    } catch (error) {
      console.error("SignOut error:", error);
      throw error;
    }
  }, [router]);

  return (
    <SessionContext.Provider
      value={{ session, getSession, updateSession, signIn, signOut }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("useSession must be used within a SessionProvider");
  }
  return context;
}

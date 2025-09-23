import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Session} from "../models/session";

type SessionContextType = {
  session: Session | null;
  getSession: () => Promise<any>;
  signIn: (data: any) => Promise<void>;
  signOut: () => Promise<void>;
};

type SessionProviderProps = React.PropsWithChildren<{
  initialSession: Session | null;
}>;

const SessionContext = createContext<SessionContextType>({
  session: null,
  getSession: async () => {},
  signIn: async () => {},
  signOut: async () => {},
});

export function SessionProvider({
  children,
  initialSession = null,
}: SessionProviderProps) {
  const [session, setSession] = useState<Session | null>(initialSession);
  const router = useRouter();

  // Renew token and update session data
  const getSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      
      if (response.ok) {
        setSession(data.session || null);
        return data.session || null;
      }
    } catch {
      setSession(null);
      return null;
    }
  }, []);

  const signIn = useCallback(async (data: any) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const session = await getSession();
        router.push("/");
        return session;
      } else {
        throw new Error("Login failed");
      }
    } catch (error) {
      console.error("SignIn error:", error);
      throw error;
    }
  }, [getSession]);

  const signOut = useCallback(async () => {
    try {
      const response = await fetch("/api/logout", {
        method: "POST",
      });

      if (response.ok) {
        setSession(null);
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
      value={{ session, getSession, signIn, signOut }}
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

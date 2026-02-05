"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { Session } from "../models/session";
import { DEFAULT_SETTINGS } from "../config";
import { getDateTime } from "../libs/formatDate";
import { TZDate } from "@date-fns/tz";
import { filterNewVideos } from "../libs/filter-new-videos";

type SessionContextType = {
  session: Session;
  getSession: () => Promise<any>;
  updateSession: (
    data: Partial<Session> | ((prev: Session) => Partial<Session>),
  ) => void;
  signIn: (data: any) => Promise<{ ok: boolean; session?: Session }>;
  signOut: () => Promise<void>;
};

type SessionProviderProps = React.PropsWithChildren<{
  initialSession: Session;
}>;

const SessionContext = createContext<SessionContextType>({
  session: {
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
    monitors: [],
    videos: [],
    settings: DEFAULT_SETTINGS,
  },
}: SessionProviderProps) {
  const [session, setSession] = useState<Session>(initialSession);
  const router = useRouter();
  const firstVideoTime = useRef(session.videos[0]?.timestamp || null);
  const videoRefreshRate = 30000; // 30 seconds

  // Fetch newer videos every 30 seconds
  useEffect(() => {
    if (!session.authToken) return;

    const fetchNewVideos = async () => {
      const time = firstVideoTime.current;
      let searchParams = null;
      if (time) {
        searchParams = new URLSearchParams({
          start: getDateTime(new TZDate(time, "UTC")),
          startOperator: ">",
        });
      }

      try {
        const response = await fetch(`/api/videos/?${searchParams}`);
        if (response.ok) {
          const newVideos = await response.json();
          if (newVideos.length > 0) {
            setSession((prev) => ({
              ...prev,
              videos: filterNewVideos([...newVideos, ...prev.videos]),
            }));
          }
        } else {
          console.error("Failed to fetch new videos:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching new videos:", error);
      }
    };

    const timeout = setInterval(fetchNewVideos, videoRefreshRate); // Fetch new videos every 30 seconds
    return () => clearInterval(timeout);
  }, [session.authToken]);

  // Update first video time when videos change
  useEffect(() => {
    firstVideoTime.current = session.videos[0]?.timestamp || null;
  }, [session.videos]);

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
      if (!data.ok) {
        throw new Error("Failed to fetch session");
      }

      setSession(data.session);
      return data.session;
    } catch (error) {
      setSession({
        monitors: [],
        videos: [],
        settings: DEFAULT_SETTINGS,
      });
      console.error("[GetSession] Error while fetching session:", error);
      throw error;
    }
  }, []);

  const updateSession = useCallback(
    (data: Partial<Session> | ((prev: Session) => Partial<Session>)) => {
      setSession((prev) => {
        if (typeof data === "function") {
          return {
            ...prev,
            ...data(prev),
          };
        }
        return {
          ...prev,
          ...data,
        };
      });
    },
    [],
  );

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
        setSession({
          monitors: [],
          videos: [],
          settings: DEFAULT_SETTINGS,
        });
        router.replace("/login");
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

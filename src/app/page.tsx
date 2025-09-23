"use client";

import { useRouter } from "next/router";
import { useSession } from "../hooks/useSession";
import { useEffect, useRef } from "react";

const DefaultPage = () => {
  const router = useRouter();
  const { session } = useSession();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (hasRedirected.current) return;
    
    hasRedirected.current = true;
    if (session) {
      const defaultPage = session.settings?.home || "/live";
      router.push(defaultPage);
    } else {
      router.push("/login");
    }
  }, [router, session]);

  return null;
};

export default DefaultPage;

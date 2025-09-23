"use client";

import { useRouter } from "next/navigation";
import { useSession } from "../hooks/useSession";
import { useEffect, useRef } from "react";

export default function DefaultPage() {
  const router = useRouter();
  const { session } = useSession();
  const hasRedirected = useRef(false);

  useEffect(() => {    
    if (hasRedirected.current) return;
    
    hasRedirected.current = true;
    if (session) {
      const defaultPage = session.settings.home;
      router.push(defaultPage);
    } else {
      router.push("/login");
    }
  }, [router, session]);

  return null;
};

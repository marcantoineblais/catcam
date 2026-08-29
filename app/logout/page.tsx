"use client";

import { useEffect } from "react";

import { useSession } from "@/hooks/useSession";

export default function Logout() {
  const { signOut } = useSession();

  useEffect(() => {
    signOut();
  }, [signOut]);

  return null;
}

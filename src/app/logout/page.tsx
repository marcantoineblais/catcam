import { useSession } from "@/src/hooks/useSession";
import { useEffect } from "react";

export default function Logout() {
  const { signOut } = useSession();

  useEffect(() => {
    signOut();
  }, [signOut])
  
  return null;
}
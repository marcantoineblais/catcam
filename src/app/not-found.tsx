"use client";

import Logo from "@/src/components/Logo";
import renderPopup from "@/src/utils/renderPopup";
import { useRouter } from "next/navigation";
import React, { useRef } from "react";

export default function FourOFour() {
  const router = useRouter();
  const redirected = useRef(false);

  React.useEffect(() => {
    if (redirected.current) return;
    
    redirected.current = true;
    renderPopup(
      [
        "Well well well...",
        "How the turn table.",
        "Anyway, looks like you're lost, let's get you back home.",
      ],
      "Error 404",
    );
    router.push("/");
  }, [router]);

  return <Logo />;
}

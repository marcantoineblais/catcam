"use client";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import renderPopup from "../utils/renderPopup";

export default function ServiceManager() {
  const router = useRouter();
  const path = usePathname();

  React.useEffect(() => {
    const resetIdle = () => {
      navigator.serviceWorker.controller?.postMessage({ type: "resetIdle" });
    };

    const logout = async () => {
      const response = await fetch("/logout");

      if (response.ok) {
        router.push("/login");
      } else {
        renderPopup([
          "Could not disconnect you at the moment.",
          "Please retry later.",
        ]);
      }
    };

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js", { scope: "/" })
        .then((_registration) => {
          window.addEventListener("mousemove", resetIdle);
          window.addEventListener("touchmove", resetIdle);
          window.addEventListener("keyup", resetIdle);
          window.addEventListener("click", resetIdle);

          navigator.serviceWorker.addEventListener("message", (e) => {
            if (e.data === "/logout") {
              renderPopup(
                "You have been disconnect due to inactivity.",
                "Information",
              );
              logout();
              return;
            }

            router.push(e.data);
          });
        });
    }

    return () => {
      window.addEventListener("mousemove", resetIdle);
      window.addEventListener("touchmove", resetIdle);
      window.addEventListener("keyup", resetIdle);
      window.addEventListener("click", resetIdle);
    };
  }, [router]);

  React.useEffect(() => {
    navigator.serviceWorker.controller?.postMessage({
      type: "navigation",
      path: path,
    });
  }, [path]);

  return null;
}

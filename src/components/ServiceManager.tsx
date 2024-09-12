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

        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js', { scope: '/' }).then((registration) => {

                window.addEventListener("mousemove", resetIdle);
                window.addEventListener("touchmove", resetIdle);
                window.addEventListener("keyup", resetIdle);
                window.addEventListener("click", resetIdle);

                navigator.serviceWorker.addEventListener('message', (e) => {
                    navigator.serviceWorker.controller?.postMessage({ type: "resetIdle" });

                    if (e.data === "/logout")
                        renderPopup("You have been disconnect due to inactivity.", "Information");

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
        navigator.serviceWorker.controller?.postMessage({ type: "navigation", path: path }); 
    }, [path]);

    return null;
}
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { Monitor } from "../models/monitor";

export async function fetchMonitors() {
    const jwt = headers().get("session") as string;

    try {
        const session = JSON.parse(jwt);
        const apiUrl = process.env.SERVER_URL;
        const key = session.auth_token;
        const groupKey = session.ke;
        const response = await fetch(`${apiUrl}/${key}/monitor/${groupKey}`);

        if (response.ok) {
            const monitors = await response.json()
            monitors.sort((m1: Monitor, m2: Monitor) => m1.name > m2.name ? 1 : -1);
            return monitors;
        } else {
            redirect("/login");
        }
    } catch (ex) {
        redirect("/login");
    }
}

export function readSettings() {
    const cookie = cookies();
    const mode = cookie.get("mode")?.value || "light";
    const camera = cookie.get("camera")?.value || "";
    const home = cookie.get("home")?.value || " live";
    const quality = cookie.get("quality")?.value || "HQ"

    return { mode, camera, home, quality };
}

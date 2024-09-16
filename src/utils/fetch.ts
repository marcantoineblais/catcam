import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchMonitors() {
    const jwt = headers().get("session") as string;

    try {
        const session = JSON.parse(jwt);
        const apiUrl = process.env.API_URL;
        const key = session.auth_token;
        const groupKey = session.ke;
        const response = await fetch(`${apiUrl}/${key}/monitor/${groupKey}`);

        if (response.ok) {
            return await response.json();
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
    const nbItems = cookie.get("nbItems")?.value || "12";
    const camera = cookie.get("camera")?.value || "";
    const home = cookie.get("home")?.value || " live";
    const quality = cookie.get("quality")?.value || "HQ"

    return { mode, nbItems, camera, home, quality };
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getMonitors() {
    const session = getSession();
    const apiURL = process.env.API_URL;
    const key = session.auth_token;
    const groupKey = session.ke;
    const data = await fetch(`${apiURL}/${key}/monitor/${groupKey}`);

    if (data.ok)
        return await data.json()
}

export function getDefaultMonitor() {
    return cookies().get("camera")?.value || "";
}

export function getNbItems() {
    return cookies().get("nbItems")?.value || "12";
}

export function getSettings() {
    const mode = cookies().get("mode")?.value || "light";
    const home = cookies().get("home")?.value || "live";
    const nbItems = cookies().get("nbItems")?.value || "12";
    const camera = cookies().get("camera")?.value || "";

    return { mode, home, nbItems, camera };
}

export function getSession() {
    const sessionJson = cookies().get("session")?.value;

    if (!sessionJson) {
        redirect("/login");
    }

    return JSON.parse(sessionJson);
}

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function fetchMonitors() {
    const jwt = cookies().get("session")?.value;

    try {
        const session = JSON.parse(jwt || "");
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

    return { mode, nbItems, camera, home };
}

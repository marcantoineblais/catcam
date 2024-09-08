import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export function GET() {
    const defaultPage = cookies().get("home")?.value || "live"

    if (cookies().has("session"))
        redirect("/" + defaultPage)
    else 
        redirect("/login")
}
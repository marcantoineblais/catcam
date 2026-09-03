import { redirect } from "next/navigation";

import { getToken } from "@/libs/jwt";
import { getSettings } from "@/services/settings-service";

export default async function RedirectPage() {
  const token = await getToken();
  const settings = await getSettings(token?.email);

  redirect(settings?.home || "/login");
}

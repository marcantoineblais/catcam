import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export function GET(request: NextRequest) {
  const defaultPage = request.cookies.get("home")?.value || "live";
  redirect("/" + defaultPage);
}

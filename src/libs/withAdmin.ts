import { NextRequest, NextResponse } from "next/server";
import { getToken } from "./jwt";
import { SESSION_COOKIE_NAME } from "../config";

export function withAdminRole(
  handler: (req: NextRequest, ctx: any) => Promise<NextResponse>,
) {
  return async (req: NextRequest, ctx: any) => {
    try {
      const token = await getToken({ isServerAction: true });
      if (!token || !token.authToken || token.permissions !== "all") {
        const response = NextResponse.json(
          { message: "unauthorized" },
          { status: 401 },
        );
        response.cookies.set(SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
        return response;
      }

      return handler(req, ctx);
    } catch (error) {
      console.error([
        "[With Admin Role] Failed to determine if user is admin",
        error,
      ]);
      const response = NextResponse.json(
        { message: "unauthorized" },
        { status: 401 },
      );
      response.cookies.set(SESSION_COOKIE_NAME, "", { maxAge: 0, path: "/" });
      return response;
    }
  };
}
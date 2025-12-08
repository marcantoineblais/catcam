import Tokens from "csrf";
import {
  CSRF_COOKIE_NAME,
  CSRF_HEADER_NAME,
  CSRF_TOKEN_SECRET,
  isProd,
} from "../config";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const tokens = new Tokens();

export function createToken() {
  return tokens.create(CSRF_TOKEN_SECRET);
}

export function verifyToken(token: string) {
  return tokens.verify(CSRF_TOKEN_SECRET, token);
}

export async function setToken(token: string) {
  const cookie = await cookies();
  cookie.set(CSRF_COOKIE_NAME, token, {
    httpOnly: true,
    secure: isProd,
    sameSite: "strict",
    path: "/",
  });
}

export function withCsrf(
  handler: (req: NextRequest, ctx: any) => Promise<NextResponse>,
) {
  return async (request: NextRequest, ctx: any) => {
    const cookieToken = request.cookies.get(CSRF_COOKIE_NAME)?.value;
    const headerToken = request.headers.get(CSRF_HEADER_NAME);

    if (
      !cookieToken ||
      !headerToken ||
      !verifyToken(headerToken) ||
      cookieToken !== headerToken
    ) {
      return NextResponse.json(
        { ok: false, message: "invalidCsrfToken" },
        { status: 403 },
      );
    }

    return handler(request, ctx);
  };
}

import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

const MAX_AGE = 1000 * 60 * 60 * 24 * 30; // 1 month
const MIN_AGE = 1000 * 60 * 5; // 10 minutes

async function postRequest(body: any) {
  const apiUrl: string = process.env.SERVER_URL + "/?json=true";
  const creds = {
    machineID: body.machineID,
    mail: body.mail,
    pass: body.pass,
  };

  const response = await fetch(apiUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
  });

  if (response.ok) return response.json();
}

export async function POST(request: NextRequest) {
  let body;

  try {
    body = await request.json();
  } catch (_) {
    return NextResponse.error();
  }

  if (!body) return NextResponse.error();

  try {
    const secretKey = process.env.SECRET_KEY as string;
    const data = await postRequest(body);
    const session = {
      auth_token: data.$user.auth_token,
      ke: data.$user.ke,
      uid: data.$user.uid,
    };

    const token = await new jose.SignJWT(session)
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime(body.rememberMe ? "30d" : "5m")
      .sign(new TextEncoder().encode(secretKey));

    const response = NextResponse.json({ ok: true });
    response.cookies.set({
      name: "session",
      value: JSON.stringify(token),
      maxAge: body.rememberMe ? MAX_AGE : MIN_AGE,
      httpOnly: true,
      path: "/",
    });

    response.cookies.set({
      name: "rememberMe",
      value: body.rememberMe,
      maxAge: body.rememberMe ? MAX_AGE : MIN_AGE,
      path: "/",
    });

    response.cookies.set({
      name: "timezone",
      value: body.timezone,
      maxAge: body.rememberMe ? MAX_AGE : MIN_AGE,
      path: "/",
    });

    return response;
  } catch (_) {
    return NextResponse.error();
  }
}

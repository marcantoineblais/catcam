import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/src/libs/jwt";
import { SERVER_URL } from "@/src/config";

async function requestLogin({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  const creds = {
    machineID: crypto.randomUUID(),
    mail: email,
    pass: password,
  };

  const response = await fetch(SERVER_URL + "/?json=true", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(creds),
  });

  if (response.ok) {
    return await response.json();
  } else {
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, rememberMe } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ ok: false }, { status: 400 });
    }

    const data = await requestLogin({ email, password });
    if (!data || !data.$user) {
      console.error("[Login] Invalid credentials", data);
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    await createToken({
      authToken: data.$user.auth_token,
      groupKey: data.$user.ke,
      email,
      rememberMe,
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[Login] Error during login:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

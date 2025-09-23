import { NextRequest, NextResponse } from "next/server";
import { createToken } from "@/src/utils/jwt";

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

  if (response.ok) return await response.json();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body) return NextResponse.error();

    const data = await postRequest(body);
    await createToken({
      authToken: data.$auth_token,
      groupKey: body.$ke,
      rememberMe: body.rememberMe,
    });
    return NextResponse.json({ ok: true });
  } catch (_) {
    return NextResponse.error();
  }
}

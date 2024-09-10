import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const jwt = body.jwt;
    const rememberMe = body.rememberMe;

    cookies().set({
        name: "session",
        value: JSON.stringify(jwt),
        maxAge: rememberMe ? 3600 * 24 * 30 : undefined,
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        path: "/"
    })

    redirect("/");
}
import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const session = body.session;
    const rememberMe = body.rememberMe;
    const secretKey = process.env.SECRET_KEY as string;

    try {
        const token = await new jose.SignJWT(session)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(rememberMe ? "30d" : "10m")
            .sign(new TextEncoder().encode(secretKey));

        const response = NextResponse.json({ ok: true })
        response.cookies.set({
            name: "session",
            value: JSON.stringify(token),
            maxAge: 3600 * 24 * 30,
            httpOnly: true,
            path: "/"
        })
    
        return response;
    } catch (_) {}

    return NextResponse.json({ ok: false, message: "Problem while encoding session token." })
}
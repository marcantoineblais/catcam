import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

async function postRequest(body: any) {
    const apiUrl: string = process.env.API_URL + "/?json=true";
    const creds = {
        machineID: body.machineID,
        mail: body.mail,
        pass: body.pass
    };

    const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(creds)
    });

    if (response.ok)
        return response.json();
}

export async function POST(request: NextRequest) {
    let body;

    try {
        body = await request.json();
    } catch (_) {
        return NextResponse.error();
    }

    if (!body)
        return NextResponse.error();

    try {
        const secretKey = process.env.SECRET_KEY as string;
        const data = await postRequest(body);
        const session = {
            auth_token: data.$user.auth_token,
            ke: data.$user.ke,
            uid: data.$user.uid
        };


        const token = await new jose.SignJWT(session)
            .setProtectedHeader({ alg: "HS256" })
            .setExpirationTime(body.rememberMe ? "30d" : "5m")
            .sign(new TextEncoder().encode(secretKey));

        const response = NextResponse.json({ ok: true });
        response.cookies.set({
            name: "session",
            value: JSON.stringify(token),
            maxAge: body.rememberMe ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 5, // 1 month || 10min
            httpOnly: true,
            path: "/"
        });

        response.cookies.set({
            name: "rememberMe",
            value: body.rememberMe,
            maxAge: body.rememberMe ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 5, // 1 month || 10min
            path: "/"
        });

        response.cookies.set({
            name: "timezone",
            value: body.timezone,
            maxAge: body.rememberMe ? 1000 * 60 * 60 * 24 * 30 : 1000 * 60 * 5, // 1 month || 10min
            path: "/"
        })

        return response;
    } catch (_) {
        return NextResponse.error();
    }
}
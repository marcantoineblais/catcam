import { NextRequest, NextResponse } from "next/server";
import * as jose from "jose";

export async function middleware(request: NextRequest) {
    if (!request.cookies.has("session")) {
        return NextResponse.redirect(new URL("/login", request.url));
    }

    const token = request.cookies.get("session")?.value as string   
    const secretKey = process.env.SECRET_KEY as string;
    const { payload: session } = await jose.jwtVerify(JSON.parse(token), new TextEncoder().encode(secretKey));
    const response = NextResponse.next()
    response.headers.set("session", JSON.stringify(session)); 

    return response;
}

export const config = {
    matcher: '/((?!public|login|logout|manifest.json|.*\\.css$|.*\\.js$|_next/static|404|500).*)'
};
import { NextRequest, NextResponse } from "next/server";

function redirect(request: NextRequest, path: string, maxAge: number, value?: string) {
    const response = NextResponse.redirect(new URL(path, request.url));
    setCookie(response, maxAge);

    return response;
}

function setCookie(response: NextResponse, maxAge: number, value?: string) {
    response.cookies.set({
        name: "lastSeen",
        value: value || "",
        maxAge: maxAge,
        httpOnly: true,
        path: "/",
        secure: true,
        sameSite: "strict"
    });

    return response;
}

export function middleware(request: NextRequest) {
    if (!request.cookies.has("session")) {
        return redirect(request, "/login", -1);
    }

    const lastSeen = request.cookies.get("lastSeen")?.value;

    const maxAge = 1000 * 60 * 60 * 24 * 365
    const date = new Date(Date.now());

    if (lastSeen) { // Goes back to home page when idle for 10 minutes
        const lastSeenDate = new Date(parseInt(lastSeen));

        if (date.valueOf() - lastSeenDate.valueOf() > 1000 * 60 * 10) {
            return redirect(request, "/", maxAge, date.valueOf().toString());
        }
    }

    const response = NextResponse.next();
    setCookie(response, maxAge, date.valueOf().toString());

    return response;
}

export const config = {
    matcher: '/((?!public|login|logout|manifest.json|.*\\.css$|.*\\.js$|_next/static).*)'
  };
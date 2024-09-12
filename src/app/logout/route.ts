import { NextRequest, NextResponse } from 'next/server';

export function GET(request: NextRequest) {
    const response = NextResponse.redirect(new URL("/login", request.url));
    
    response.cookies.set({
        name: "session",
        value: "",
        maxAge: -1,
        httpOnly: true,
        path: "/"
    });
    
    return response;
}
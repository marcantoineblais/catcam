import { NextResponse } from 'next/server';

export function GET() {
    const response = NextResponse.json({ ok: true })
    
    response.cookies.set({
        name: "session",
        value: "",
        maxAge: -1,
        httpOnly: true,
        path: "/"
    });
    
    return response;
}
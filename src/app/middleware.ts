import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { cookies } from 'next/headers';

export function middleware(request: NextRequest) {
    const isLoggedIn = cookies().has("session")

    if (!isLoggedIn)
        return NextResponse.redirect(new URL('/login', request.url));
    
    return NextResponse.next()
}

export const config = {
    matcher: ['/login/**', '/logout', '/'],
}
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const path = request.nextUrl.pathname.split("/").splice(2).join("/");
    const url = process.env.SERVER_URL + "/" + path;
    const response = await fetch(url, {
        headers: request.headers
    });
    
    return response;
}
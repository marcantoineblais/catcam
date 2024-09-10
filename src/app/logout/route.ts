import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function GET() {
    cookies().set({
        name: "session",
        value: "",
        maxAge: 0
    });

    redirect("/login");
}
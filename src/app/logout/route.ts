import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export function GET() {
    cookies().delete('session');
    return redirect('/login');
}
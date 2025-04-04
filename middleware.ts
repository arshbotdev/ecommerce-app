import {NextRequest, NextResponse} from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: NextRequest) {
    if (
        request.nextUrl.pathname.startsWith('/admin') &&
        !request.nextUrl.pathname.startsWith('/admin/login')
    ) {
        const adminAuth = request.cookies.get('admin_auth')?.value;

        if (!adminAuth || adminAuth !== 'authenticated') {
            return NextResponse.rewrite(new URL('/admin/login', request.url));
        }
    }
    const token = request.headers.get('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const user = jwt.verify(token, 'secret-key');
        return NextResponse.next().clone({ user });
    } catch (error) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 });
    }
}

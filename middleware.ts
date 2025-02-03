import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request: Request) {
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

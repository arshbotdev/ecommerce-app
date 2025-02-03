import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sequelize from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const [users]: any = await sequelize.query('SELECT * FROM users WHERE email = ?', {
            replacements: [email],
        });

        if (users.length === 0) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const user = users[0];
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, 'secret-key'); // No expiry


        return NextResponse.json({ token, user: { id: user.id, email: user.email, username: user.username } });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

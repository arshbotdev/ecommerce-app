import bcrypt from 'bcrypt';
import sequelize from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await sequelize.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            {
                replacements: [username, email, hashedPassword],
            }
        );
        return NextResponse.json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
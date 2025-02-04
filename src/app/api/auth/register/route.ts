// app/api/auth/register/route.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sequelize from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const { username, email, password } = await request.json();

    if (!username || !email || !password) {
        return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Insert the user
        await sequelize.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            {
                replacements: [username, email, hashedPassword],
            }
        );

        // Fetch the created user to get their ID
        const [users]: any = await sequelize.query(
            'SELECT * FROM users WHERE email = ?',
            {
                replacements: [email],
            }
        );

        const user = users[0];

        // Create token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            'secret-key' // Use the same secret key as in login
        );

        return NextResponse.json({
            message: 'User registered successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.name
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
    }
}
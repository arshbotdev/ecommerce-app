/* eslint-disable @typescript-eslint/no-explicit-any */
import sequelize from '@/lib/db';
import { NextResponse } from 'next/server';
import {verify} from "jsonwebtoken";

export async function POST(request: Request) {
    const { productId, quantity } = await request.json();

    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    interface DecodedToken {
        id: number;
        // add other properties if needed
    }

    const decoded = verify(token, 'secret-key') as DecodedToken;
    try {
        await sequelize.query(
            'INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE quantity = quantity + ?',
            { replacements: [decoded.id, productId, quantity || 1, quantity || 1] }
        );
        return NextResponse.json({ message: 'Product added to cart' });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}


export async function GET(request: Request) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        console.log(token)

        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        interface DecodedToken {
            id: number;
            // add other properties if needed
        }
        const decoded = verify(token, 'secret-key') as DecodedToken;

        const [items]: any = await sequelize.query(`
            SELECT c.id, c.product_id, c.quantity, p.name, p.price 
            FROM cart c
            JOIN products p ON c.product_id = p.id
            WHERE c.user_id = ?
        `, {
            replacements: [decoded.id]
        });

        return NextResponse.json(items);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded: any = verify(token, 'secret-key');
        const { productId, quantity } = await request.json();

        await sequelize.query(`
            UPDATE cart 
            SET quantity = ? 
            WHERE user_id = ? AND product_id = ?
        `, {
            replacements: [quantity, decoded.id, productId]
        });

        return NextResponse.json({ message: 'Cart updated successfully' });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

// File: app/api/cart/delete/route.ts
export async function DELETE(request: Request) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        const decoded: any = verify(token, 'secret-key');
        const { productId } = await request.json();

        await sequelize.query(`
            DELETE FROM cart 
            WHERE user_id = ? AND product_id = ?
        `, {
            replacements: [decoded.id, productId]
        });

        return NextResponse.json({ message: 'Item removed from cart' });
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

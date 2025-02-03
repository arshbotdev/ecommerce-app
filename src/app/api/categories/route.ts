import sequelize from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const [categories] = await sequelize.query('SELECT * FROM categories');
        return NextResponse.json(categories);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name } = body;

        const slug = name.toLowerCase().replace(/[\s+]/g, '-');

        if (!name) {
            return NextResponse.json(
                { error: 'Category name is required' },
                { status: 400 }
            );
        }

        await sequelize.query(
            'INSERT INTO categories (name, slug) VALUES (?, ?)',
            {
                replacements: [name, slug],
            }
        );

        return NextResponse.json({
            message: 'Category created successfully'
        });
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            { error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
import sequelize from '@/lib/db';
import { NextResponse } from 'next/server';
import { v2 as cloudinary } from 'cloudinary';


export async function GET() {
    try {
        const [products] = await sequelize.query(`
            SELECT products.*, categories.name AS category_name 
            FROM products 
            JOIN categories ON products.category_id = categories.id
        `);
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: error }, { status: 500 });
    }
}



cloudinary.config({
    cloud_name: "ecomm-app-react",
    api_key: "729179352823612",
    api_secret: "Z4IXT9a2kO0LxQlmm2jzTiC9JZo"
});


async function uploadToCloudinary(image: string) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, { folder: 'products' })
            .then(result => resolve(result.secure_url))
            .catch(error => reject(error));
    });
}


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, description, price, categoryId, images } = body;

        if (!name || !description || !price || !categoryId || !images || images.length === 0) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Upload images to Cloudinary
        const uploadedImages = await Promise.all(images.map(uploadToCloudinary));

        // Generate slug
        const slug = name.toLowerCase().replace(/[\s+]/g, '-');

        // Insert product into database
        const [result] = await sequelize.query(
            `INSERT INTO products (name, description, price, category_id, slug, image_urls) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            { replacements: [name, description, price, categoryId, slug, JSON.stringify(uploadedImages)] }
        );

        return NextResponse.json({ message: 'Product created successfully', result });
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}

'use client';
import { useState, useEffect } from 'react';

interface Category {
    id: number;
    name: string;
}

export default function AdminProductsPage() {
    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        categoryId: '',
        images: [] as Array<string | File>,
    });
    const [imageUrl, setImageUrl] = useState(''); // Store URL input
    const [message, setMessage] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (!response.ok) throw new Error('Failed to fetch categories');
                const data = await response.json();
                setCategories(data);
            } catch (err) {
                setError('Failed to load categories');
                console.log(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);
            if (productData.images.length + newFiles.length > 5) {
                setMessage('You can upload a maximum of 5 images.');
                return;
            }
            setProductData({ ...productData, images: [...productData.images, ...newFiles] });
        }
    };

    const handleUrlAdd = () => {
        if (!imageUrl) return;
        if (productData.images.length >= 5) {
            setMessage('You can add only 5 images.');
            return;
        }
        setProductData({ ...productData, images: [...productData.images, imageUrl] });
        setImageUrl('');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', productData.name);
        formData.append('description', productData.description);
        formData.append('price', productData.price);
        formData.append('categoryId', productData.categoryId);

        // Upload only File type images to Cloudinary
        const uploadedImages = await Promise.all(
            productData.images.map(async (image) => {
                if (typeof image === 'string') return image; // Keep manual URLs

                const imageData = new FormData();
                imageData.append('file', image);
                imageData.append('upload_preset', 'ml_default');

                const res = await fetch(`https://api.cloudinary.com/v1_1/ecomm-app-react/image/upload`, {
                    method: 'POST',
                    body: imageData,
                });

                const data = await res.json();
                return data.secure_url;
            })
        );

        // Send product data with final image URLs
        const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...productData, images: uploadedImages }),
        });

        const data = await res.json();
        setMessage(data.message || data.error);

        if (res.ok) {
            setProductData({
                name: '',
                description: '',
                price: '',
                categoryId: '',
                images: [],
            });
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Admin Panel - Products</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Product Name"
                    value={productData.name}
                    onChange={(e) => setProductData({ ...productData, name: e.target.value })}
                    className="border p-2 rounded w-full"
                    required
                />

                <textarea
                    placeholder="Description"
                    value={productData.description}
                    onChange={(e) => setProductData({ ...productData, description: e.target.value })}
                    className="border p-2 rounded w-full h-32"
                    required
                />

                <input
                    type="number"
                    placeholder="Price"
                    value={productData.price}
                    onChange={(e) => setProductData({ ...productData, price: e.target.value })}
                    className="border p-2 rounded w-full"
                    step="0.01"
                    min="0"
                    required
                />

                <select
                    value={productData.categoryId}
                    onChange={(e) => setProductData({ ...productData, categoryId: e.target.value })}
                    className="border p-2 rounded w-full"
                    required
                >
                    <option value="">Select Category</option>
                    {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                            {category.name}
                        </option>
                    ))}
                </select>

                {/* File Upload */}
                <input type="file" multiple accept="image/*" onChange={handleFileChange} className="border p-2 rounded w-full" />

                {/* URL Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Add Image URL"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="border p-2 rounded flex-grow"
                    />
                    <button type="button" onClick={handleUrlAdd} className="bg-green-500 text-white px-3 py-2 rounded">
                        Add
                    </button>
                </div>

                {/* Preview Selected Images */}
                <div className="flex flex-wrap gap-2">
                    {productData.images.map((img, idx) => (
                        <div key={idx} className="relative w-20 h-20 border rounded overflow-hidden">
                            {typeof img === 'string' ? (
                                <img src={img} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                                <img src={URL.createObjectURL(img)} alt="Preview" className="w-full h-full object-cover" />
                            )}
                        </div>
                    ))}
                </div>

                {isLoading && <p className="text-gray-500">Loading categories...</p>}
                {error && <p className="text-red-500">{error}</p>}
                {message && <p className={`mt-4 ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" disabled={isLoading}>
                    Add Product
                </button>
            </form>
        </div>
    );
}

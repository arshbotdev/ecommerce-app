'use client';
import { useState } from 'react';
import { Plus, AlertCircle } from 'lucide-react';

export default function AdminCategoriesPage() {
    const [categoryName, setCategoryName] = useState('');
    const [slug, setSlug] = useState('');
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('/api/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: categoryName, slug }),
            });

            const data = await res.json();
            setIsSuccess(res.ok);
            setMessage(data.message || data.error);

            if (res.ok) {
                setCategoryName('');
                setSlug('');
                setTimeout(() => setMessage(''), 3000);
            }
        } catch (error) {
            setIsSuccess(false);
            console.log(error)
            setMessage('An error occurred while adding the category');
        }
    };

    // Auto-generate slug from category name
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newName = e.target.value;
        setCategoryName(newName);
        setSlug(newName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header Section */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Admin Panel - Categories
                    </h1>
                    <p className="text-gray-600">
                        Add and manage product categories for your store
                    </p>
                </div>

                {/* Form Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                        Add New Category
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-1">
                                Category Name
                            </label>
                            <input
                                id="categoryName"
                                type="text"
                                placeholder="Enter category name"
                                value={categoryName}
                                onChange={handleNameChange}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="slug" className="block text-sm font-medium text-gray-700 mb-1">
                                Slug
                            </label>
                            <input
                                id="slug"
                                type="text"
                                placeholder="category-slug"
                                value={slug}
                                onChange={(e) => setSlug(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-colors"
                                required
                            />
                            <p className="mt-1 text-sm text-gray-500">
                                URL-friendly version of the category name
                            </p>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Category
                            </button>
                        </div>
                    </form>
                </div>

                {/* Message Display */}
                {message && (
                    <div className={`rounded-md p-4 ${
                        isSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                    }`}>
                        <div className="flex">
                            <AlertCircle className={`h-5 w-5 ${
                                isSuccess ? 'text-green-400' : 'text-red-400'
                            } mr-2`} />
                            <span className="text-sm font-medium">{message}</span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
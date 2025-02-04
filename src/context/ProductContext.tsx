"use client"
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    image_urls: string | string[];
    category_id: number;
    slug: string;
}

interface Category {
    id: number;
    name: string;
}

interface ProductContextType {
    products: Product[];
    categories: Category[];
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    filteredProducts: Product[];
    isLoading: boolean;
    error: string | null;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                setIsLoading(true);
                const [productsRes, categoriesRes] = await Promise.all([
                    fetch('/api/products'),
                    fetch('/api/categories')
                ]);

                if (!productsRes.ok || !categoriesRes.ok) {
                    throw new Error('Failed to fetch data');
                }

                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();

                setProducts(productsData);
                setCategories(categoriesData);
                setFilteredProducts(productsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    // Search functionality
    useEffect(() => {
        if (!searchQuery.trim()) {
            setFilteredProducts(products);
            return;
        }

        const query = searchQuery.toLowerCase();
        const filtered = products.filter(product =>
            product.name.toLowerCase().includes(query) ||
            product.description.toLowerCase().includes(query) ||
            categories.find(cat => cat.id === product.category_id)?.name.toLowerCase().includes(query)
        );
        setFilteredProducts(filtered);
    }, [searchQuery, products, categories]);

    return (
        <ProductContext.Provider
            value={{
                products,
                categories,
                searchQuery,
                setSearchQuery,
                filteredProducts,
                isLoading,
                error
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProducts must be used within a ProductProvider');
    }
    return context;
};
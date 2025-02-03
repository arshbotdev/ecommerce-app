"use client";
import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
    id: number;
    product_id: number;
    quantity: number;
    name: string;
    price: number;
};

type CartContextType = {
    cartItems: CartItem[];
    cartItemsCount: number;
    isLoading: boolean;
    error: string | null;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    updateCartItem: (productId: number, quantity: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    fetchCartItems: () => Promise<void>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getToken = () => localStorage.getItem('token');

    const fetchCartItems = async () => {
        const token = getToken();
        if (!token) {
            setCartItems([]);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/cart', {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to fetch cart items');
            }

            const data = await response.json();
            setCartItems(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error fetching cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const addToCart = async (productId: number, quantity: number = 1) => {
        const token = getToken();
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/cart', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            // Fetch updated cart data
            await fetchCartItems();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error adding to cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateCartItem = async (productId: number, quantity: number) => {
        const token = getToken();
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/cart', {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId, quantity }),
            });

            if (!response.ok) {
                throw new Error('Failed to update cart');
            }

            // Fetch updated cart data
            await fetchCartItems();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error updating cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const removeFromCart = async (productId: number) => {
        const token = getToken();
        if (!token) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/cart', {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }

            // Fetch updated cart data
            await fetchCartItems();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            console.error('Error removing from cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Calculate total items in cart
    const cartItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    // Initial fetch when component mounts or token changes
    useEffect(() => {
        fetchCartItems();
    }, []);

    // Listen for token changes in localStorage
    useEffect(() => {
        const handleStorageChange = (e: StorageEvent) => {
            if (e.key === 'token') {
                fetchCartItems();
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const value = {
        cartItems,
        cartItemsCount,
        isLoading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        fetchCartItems,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

// Custom hook to use cart context
export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
'use client';
import React from 'react';
import { useCart } from "@/context/CartContext";
import { useRouter } from 'next/navigation';

export default function CartPage() {
    const {
        cartItems,
        isLoading,
        error,
        updateCartItem,
        removeFromCart,
    } = useCart();

    const router = useRouter();
    const [orderPlacing, setOrderPlacing] = React.useState(false);
    const [orderConfirmation, setOrderConfirmation] = React.useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const handleUpdateQuantity = async (productId: number, change: number) => {
        const currentItem = cartItems.find(item => item.product_id === productId);
        if (!currentItem) return;

        const newQuantity = currentItem.quantity + change;
        if (newQuantity < 1) return;

        await updateCartItem(productId, newQuantity);
    };

    const handleRemoveItem = async (productId: number) => {
        await removeFromCart(productId);
    };

    const handleCheckout = async () => {
        try {
            setOrderPlacing(true);
            const token = localStorage.getItem('token');

            // Create the order in the database
            const response = await fetch('/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ items: cartItems }),
            });

            const data = await response.json();

            if (response.ok) {
                setOrderConfirmation(true);
                // Clear the cart after successful order placement
                // Redirect to orders page after 3 seconds
                setTimeout(() => {
                    router.push('/orders');
                }, 3000);
            } else {
                throw new Error(data.error || 'Failed to place order');
            }
        } catch (err) {
            console.error('Order placement error:', err);
            alert('Failed to place order. Please try again.');
        } finally {
            setOrderPlacing(false);
        }
    };

    const calculateTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-lg mx-auto mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
            </div>
        );
    }

    if (orderConfirmation) {
        return (
            <div className="max-w-lg mx-auto mt-8 bg-green-100 border border-green-400 text-green-700 px-4 py-8 rounded text-center">
                <h2 className="text-2xl font-bold mb-4">Order Confirmed!</h2>
                <p className="mb-4">Your order has been placed successfully.</p>
                <p>Redirecting to your orders page...</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

            {cartItems.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">Your cart is empty</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {cartItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-lg shadow p-6">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="font-semibold text-lg">{item.name}</h3>
                                    <p className="text-gray-500">{formatPrice(item.price)}</p>
                                </div>

                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product_id, -1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 focus:outline-none"
                                        >
                                            -
                                        </button>
                                        <span className="w-8 text-center">{item.quantity}</span>
                                        <button
                                            onClick={() => handleUpdateQuantity(item.product_id, 1)}
                                            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 focus:outline-none"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => handleRemoveItem(item.product_id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded-full focus:outline-none"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd"
                                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                                  clipRule="evenodd"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            <div className="mt-2 text-right text-gray-600">
                                Subtotal: {formatPrice(item.price * item.quantity)}
                            </div>
                        </div>
                    ))}

                    <div className="mt-6 bg-white rounded-lg shadow p-6">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold text-lg">Total</span>
                            <span className="font-bold text-xl">{formatPrice(calculateTotal())}</span>
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={handleCheckout}
                                disabled={orderPlacing}
                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {orderPlacing ? 'Processing...' : 'Place Order'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
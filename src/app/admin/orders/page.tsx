'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define more specific types for order items and status
interface OrderItem {
    id: number;
    name: string;
    price: string;
    quantity: number;
}

// Use a string literal union type for status
type OrderStatus = 'confirmed' | 'dispatched' | 'out for delivery' | 'delivered';

interface Order {
    id: number;
    order_date: string;
    user_name?: string;
    user_email?: string;
    items: string | OrderItem[];
    status: OrderStatus;
}

export default function AdminOrdersPage(): React.ReactElement {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updatingOrder, setUpdatingOrder] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchOrders = async (): Promise<void> => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    router.push('/login');
                    return;
                }

                const response = await fetch('/api/auth/orders', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch orders');
                }

                const data: Order[] = await response.json();
                setOrders(data);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError((err as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    const handleStatusChange = async (orderId: number, newStatus: OrderStatus): Promise<void> => {
        try {
            setUpdatingOrder(orderId);
            const token = localStorage.getItem('token');
            
            if (!token) {
                throw new Error('Authentication token not found');
            }

            const response = await fetch(`/api/orders/${orderId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (err) {
            console.error('Error updating order status:', err);
            alert('Failed to update order status');
        } finally {
            setUpdatingOrder(null);
        }
    };

    const formatPrice = (price: number | string): string => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(Number(price));
    };

    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const getStatusColor = (status: OrderStatus): string => {
        switch (status) {
            case 'confirmed':
                return 'bg-blue-100 text-blue-800';
            case 'dispatched':
                return 'bg-yellow-100 text-yellow-800';
            case 'out for delivery':
                return 'bg-purple-100 text-purple-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const parseOrderItems = (itemsData: string | OrderItem[]): OrderItem[] => {
        if (!itemsData) return [];

        try {
            return Array.isArray(itemsData) ? itemsData : JSON.parse(itemsData) as OrderItem[];
        } catch (err) {
            console.error('Error parsing order items:', err);
            return [];
        }
    };

    const calculateTotal = (items: OrderItem[]): number => {
        return items.reduce((sum, item) => {
            const price = parseFloat(item.price) || 0;
            const quantity = item.quantity || 1;
            return sum + price * quantity;
        }, 0);
    };

    if (loading) {
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

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Manage Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center p-8 bg-white rounded-lg shadow">
                    <p className="text-gray-500">No orders yet</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white rounded-lg shadow">
                        <thead>
                            <tr className="bg-gray-50 border-b">
                                <th className="py-3 px-4 text-left">Order #</th>
                                <th className="py-3 px-4 text-left">Date</th>
                                <th className="py-3 px-4 text-left">Customer</th>
                                <th className="py-3 px-4 text-left">Items</th>
                                <th className="py-3 px-4 text-left">Total</th>
                                <th className="py-3 px-4 text-left">Status</th>
                                <th className="py-3 px-4 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => {
                                const items = parseOrderItems(order.items);
                                const total = calculateTotal(items);
                                return (
                                    <tr key={order.id} className="border-b hover:bg-gray-50">
                                        <td className="py-3 px-4">{order.id}</td>
                                        <td className="py-3 px-4">{formatDate(order.order_date)}</td>
                                        <td className="py-3 px-4">{order.user_name || 'Unknown'}</td>
                                        <td className="py-3 px-4">{items.length} items</td>
                                        <td className="py-3 px-4 font-medium">{formatPrice(total)}</td>
                                        <td className="py-3 px-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <select
                                                className="border rounded px-2 py-1 text-sm"
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                                                disabled={updatingOrder === order.id}
                                            >
                                                <option value="confirmed">Confirmed</option>
                                                <option value="dispatched">Dispatched</option>
                                                <option value="out for delivery">Out for Delivery</option>
                                                <option value="delivered">Delivered</option>
                                            </select>
                                            {updatingOrder === order.id && (
                                                <span className="ml-2 inline-block w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full animate-spin"></span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
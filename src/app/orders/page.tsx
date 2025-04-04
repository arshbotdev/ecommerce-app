'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Define types for order items and orders
interface OrderItem {
  name: string;
  price: string | number;
  quantity: number;
  image_urls: string[];
  product_id?: number;
}

interface Order {
  id: number;
  order_date: string;
  status: 'confirmed' | 'dispatched' | 'out for delivery' | 'delivered' | string;
  items: OrderItem[];
}

export default function OrdersPage(): React.ReactElement {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchOrders = async (): Promise<void> => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          router.push('/login');
          return;
        }

        const response = await fetch('/api/orders', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        // Transform the data to ensure it has the expected structure
        const formattedOrders: Order[] = Array.isArray(data) ? data.map(order => ({
          ...order,
          items: Array.isArray(order.items) ? order.items : [
            {
              name: order.name || '',
              price: parseFloat(order.price) || 0,
              quantity: order.quantity || 1,
              image_urls: Array.isArray(order.image_urls) ? order.image_urls :
                order.image_urls ? [order.image_urls] : []
            }
          ]
        })) : [];

        setOrders(formattedOrders);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [router]);

  const formatPrice = (price: number | string): string => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(typeof price === 'string' ? parseFloat(price) : price);
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = (status: string): string => {
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

  // Safe calculation of total price
  const calculateTotal = (items: OrderItem[] | undefined): number => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return 0;
    }
    return items.reduce((sum, item) => {
      const price = typeof item.price === 'string' ? parseFloat(item.price) : item.price || 0;
      const quantity = item.quantity || 1;
      return sum + (price * quantity);
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
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Your Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center p-8 bg-white rounded-lg shadow">
          <p className="text-gray-500">You have no orders yet</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">Placed on {formatDate(order.order_date)}</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                </div>
              </div>

              <div>
                {order?.items && order.items.length > 0 ? (
                  order.items.map((item, index) => (
                    <div key={index} className="p-4 border-b flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        {item.image_urls && item.image_urls.length > 0 ? (
                          <div className="w-16 h-16 bg-gray-100 rounded">
                            <img
                              src={item.image_urls[0] || '/placeholder.png'}
                              alt={item.name}
                              className="w-full h-full object-cover rounded"
                            />
                          </div>
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                          </div>
                        )}

                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-gray-500">
                            {formatPrice(item.price)} x {item.quantity}
                          </p>
                        </div>
                      </div>
                      <div className="font-medium">
                        {formatPrice(
                          (typeof item.price === 'string' ? parseFloat(item.price) : item.price) * item.quantity
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-gray-500">No items found.</p>
                  </div>
                )}
              </div>

              <div className="p-4 bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Total</span>
                  <span className="font-bold">
                    {formatPrice(calculateTotal(order.items))}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
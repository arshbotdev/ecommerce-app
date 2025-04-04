
import sequelize from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

interface DecodedToken {
  id: number;
  role?: string;
  // add other properties if needed
}


interface OrderResult {
  id: number;
  order_date: string;
  status: string;
  user_name: string;
  user_email: string;
  product_id: number;
  product_name: string;
  price: string;
  quantity: number;
  image_urls: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const user = verify(token, 'secret-key') as DecodedToken;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rawOrders = await sequelize.query<OrderResult>(
      `
      SELECT 
          o.id, o.order_date, o.status, 
          u.name AS user_name, u.email AS user_email,
          oi.product_id, p.name AS product_name, oi.price, oi.quantity, p.image_urls
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      LEFT JOIN users u ON o.user_id = u.id
      ORDER BY o.order_date DESC
      `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    // Process raw orders to group items by order
    const ordersMap = new Map<number, any>();
    rawOrders.forEach(row => {
      if (!ordersMap.has(row.id)) {
        ordersMap.set(row.id, {
          id: row.id,
          order_date: row.order_date,
          status: row.status,
          user_name: row.user_name,
          user_email: row.user_email,
          items: [],
        });
      }
      
      // Add the item to the order's items array
      ordersMap.get(row.id).items.push({
        product_id: row.product_id,
        name: row.product_name,
        price: row.price,
        quantity: row.quantity,
        image_urls: row.image_urls,
      });
    });

    // Convert map to array
    const orders = Array.from(ordersMap.values());

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching admin orders:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
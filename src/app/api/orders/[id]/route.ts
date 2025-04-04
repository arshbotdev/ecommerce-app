// /app/api/orders/[id]/route.ts
import sequelize from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

interface DecodedToken {
  id: number;
  role?: string;
  // add other properties if needed
}

interface UpdateOrderRequest {
  status: string;
}

interface OrderParams {
  params: {
    id: string;
  };
}

type OrderStatus = 'confirmed' | 'dispatched' | 'out for delivery' | 'delivered';

export async function PUT(
  request: NextRequest, 
  { params }: OrderParams
): Promise<NextResponse> {
  try {
    const token = request.headers.get('Authorization')?.split(' ')[1];

    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    const user = verify(token, 'secret-key') as DecodedToken;
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = params;
    const { status } = await request.json() as UpdateOrderRequest;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Validate status
    const validStatuses: OrderStatus[] = ['confirmed', 'dispatched', 'out for delivery', 'delivered'];
    if (!validStatuses.includes(status as OrderStatus)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Check if the order belongs to the user or if user is admin
    const [orders] = await sequelize.query<{ id: number }[]>(
      `SELECT id FROM orders WHERE id = ? AND user_id = ?`,
      {
        replacements: [id, user.id],
        type: sequelize.QueryTypes.SELECT,
      }
    );

    if (orders.length === 0 && user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the order status
    await sequelize.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      {
        replacements: [status, id]
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Order status updated successfully'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
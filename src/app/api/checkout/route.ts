import { NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51NErIrSBXsZByhUPHEWySMUvp2BxUrGkHqFrPd71sNmvV6hwAAkV0QIuUnuYustSUvPkTGggCdKskc50SNUH1iQ600b77SwpyT', {
    apiVersion: '2025-01-27.acacia'
});

export async function POST(request: Request) {
    try {
        const token = request.headers.get('Authorization')?.split(' ')[1];
        if (!token) {
            return NextResponse.json({ error: 'No token provided' }, { status: 401 });
        }

        interface DecodedToken {
            id: string;
        }
        const decoded = verify(token, 'secret-key') as DecodedToken;
        const { items } = await request.json();

        interface Item {
            name: string;
            price: number;
            quantity: number;
        }

        const lineItems = items.map((item: Item) => ({
            price_data: {
                currency: 'inr',
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.round(item.price * 100),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `http://localhost:3000/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `http://localhost:3000/cart`,
            currency: 'inr',
            metadata: {
                userId: decoded.id
            },
            shipping_address_collection: {
                allowed_countries: ['IN'], // Add other country codes as needed
            },
            phone_number_collection: {
                enabled: true,
            },
            billing_address_collection: 'required',
            customer_email: undefined // This will prompt for email if not already known
        });

        return NextResponse.json({ sessionId: session.id });
    } catch (error) {
        console.error('Stripe error:', error);
        return NextResponse.json({ error: 'Payment session creation failed' }, { status: 500 });
    }
}
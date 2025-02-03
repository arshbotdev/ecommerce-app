import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import sequelize from '@/lib/db';

const stripe = new Stripe('sk_test_51NErIrSBXsZByhUPHEWySMUvp2BxUrGkHqFrPd71sNmvV6hwAAkV0QIuUnuYustSUvPkTGggCdKskc50SNUH1iQ600b77SwpyT', {
    apiVersion: '2025-01-27.acacia'
});

const endpointSecret = 'your_webhook_secret';

export async function POST(request: Request) {
    const signature = request.headers.get('stripe-signature') as string;
    const body = await request.text();

    try {
        const event = stripe.webhooks.constructEvent(body, signature, endpointSecret);

        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = session.metadata?.userId;

            // Clear the user's cart after successful payment
            if (userId) {
                await sequelize.query('DELETE FROM cart WHERE user_id = ?', {
                    replacements: [userId]
                });
            }
        }

        return NextResponse.json({ received: true });
    } catch (err) {
        console.error('Webhook error:', err);
        return NextResponse.json({ error: 'Webhook handler failed' }, { status: 400 });
    }
}
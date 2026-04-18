import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { planId } = await req.json(); // e.g., 'price_...PRO'
    
    await dbConnect();
    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    if (!stripe) {
      return NextResponse.json({ message: 'Stripe is not configured. Missing STRIPE_SECRET_KEY.' }, { status: 500 });
    }

    let line_items;
    
    if (planId === 'price_demo_pro_id') {
      line_items = [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'CVGenius AI Pro Plan',
              description: 'Unlimited AI resumes and premium templates',
            },
            unit_amount: 900, // $9.00
            recurring: {
              interval: 'month',
            },
          },
          quantity: 1,
        },
      ];
    } else {
      line_items = [
        {
          price: planId,
          quantity: 1,
        },
      ];
    }

    // Attempt to get the origin URL correctly for Vercel
    const origin = process.env.NEXT_PUBLIC_APP_URL || req.headers.get('origin') || 'http://localhost:3000';

    // Prepare Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items,
      success_url: `${origin}/dashboard?checkout=success`,
      cancel_url: `${origin}/pricing?checkout=canceled`,
      customer_email: user.email,
      client_reference_id: user._id.toString(),
    });

    return NextResponse.json({ url: stripeSession.url });

  } catch (error) {
    console.error('Stripe Checkout Error', error);
    return NextResponse.json({ message: `Stripe Error: ${error.message}` }, { status: 500 });
  }
}

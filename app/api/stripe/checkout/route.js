import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/react';
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
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    // Prepare Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: planId, // Replace with your actual Stripe Price ID
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?checkout=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?checkout=canceled`,
      customer_email: user.email,
      client_reference_id: user._id.toString(),
    });

    return NextResponse.json({ url: stripeSession.url });

  } catch (error) {
    console.error('Stripe Checkout Error', error);
    return NextResponse.json({ message: 'Error initiating checkout' }, { status: 500 });
  }
}

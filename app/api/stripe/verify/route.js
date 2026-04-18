import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json({ message: 'Session ID is required' }, { status: 400 });
    }

    if (!stripe) {
      return NextResponse.json({ message: 'Stripe is not configured' }, { status: 500 });
    }

    // Retrieve the checkout session from Stripe securely
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify payment status
    if (session.payment_status !== 'paid') {
      return NextResponse.json({ message: 'Payment not successful' }, { status: 400 });
    }

    await dbConnect();

    // The user's ID was passed via client_reference_id
    if (session.client_reference_id) {
      const user = await User.findById(session.client_reference_id);
      
      if (user) {
        // If the user is already updated by the webhook, just return success
        if (user.subscription !== 'PRO') {
          user.subscription = 'PRO';
          await user.save();

          await Subscription.findOneAndUpdate(
            { userId: user._id },
            {
              userId: user._id,
              plan: 'PRO',
              status: 'active',
              stripeCustomerId: session.customer,
              stripeSubscriptionId: session.subscription,
            },
            { upsert: true, new: true }
          );
        }
      }
    }

    return NextResponse.json({ success: true, status: 'paid' }, { status: 200 });

  } catch (error) {
    console.error('Stripe Verification Error', error);
    return NextResponse.json({ message: 'Error verifying checkout' }, { status: 500 });
  }
}

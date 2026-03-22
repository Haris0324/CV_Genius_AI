import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import Subscription from '@/models/Subscription';

export async function POST(req) {
  const body = await req.text();
  const sig = req.headers.get('stripe-signature');

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return NextResponse.json({ message: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    await dbConnect();

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Find User
        if (session.client_reference_id) {
          const user = await User.findById(session.client_reference_id);
          
          if (user) {
            user.subscription = 'PRO'; // Defaulting to PRO based on our tiers
            await user.save();

            // Create or update subscription record
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
        break;
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const subRecord = await Subscription.findOne({ stripeSubscriptionId: subscription.id });
        
        if (subRecord) {
          subRecord.status = 'canceled';
          subRecord.plan = 'FREE';
          await subRecord.save();
          
          const user = await User.findById(subRecord.userId);
          if (user) {
            user.subscription = 'FREE';
            await user.save();
          }
        }
        break;
      }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Webhook processing error:', err);
    return NextResponse.json({ message: 'Error processing webhook' }, { status: 500 });
  }
}

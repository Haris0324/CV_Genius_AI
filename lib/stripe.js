import Stripe from 'stripe';

export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16', // or latest
      appInfo: { name: 'CVGenius AI', version: '0.1.0' }
    })
  : null;

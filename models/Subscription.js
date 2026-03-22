import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One active subscription doc per user
    },
    plan: {
      type: String,
      enum: ['FREE', 'PRO', 'PREMIUM'],
      default: 'FREE',
    },
    status: {
      type: String,
      enum: ['active', 'canceled', 'past_due', 'unpaid', 'incomplete', 'incomplete_expired', 'trialing', 'none'],
      default: 'none',
    },
    stripeCustomerId: {
      type: String,
    },
    stripeSubscriptionId: {
      type: String,
    },
    currentPeriodEnd: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);

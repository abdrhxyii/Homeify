import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId; 
  plan: string;
  status: string;
  expiresAt: Date; // Added expiration date field
}

const subscriptionSchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    plan: { 
      type: String, 
      required: true 
    },
    status: { 
      type: String, 
      required: true, 
      enum: ['active', 'inactive', 'expired'],
      default: 'active',
    },
    expiresAt: {
      type: Date,
      required: true
    }
  },
  { timestamps: true }
);

// Add index for faster queries on the common lookup pattern
subscriptionSchema.index({ userId: 1, status: 1 });

const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', subscriptionSchema);
export default Subscription;
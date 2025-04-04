import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: mongoose.Types.ObjectId; 
  plan: string;
  status: string; 
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
  },
  { timestamps: true }
);

const Subscription = mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', subscriptionSchema);
export default Subscription;

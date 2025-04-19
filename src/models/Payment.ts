import mongoose, { Schema, Document } from 'mongoose';

export interface IPayment extends Document {
  userId: mongoose.Types.ObjectId; 
  paymentStatus: string; 
  paymentMethod: string;
  subscriptionId: string; 
  amount: number;
}

const paymentSchema: Schema = new Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    paymentStatus: { 
      type: String, 
      required: true, 
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    paymentMethod: { 
      type: String, 
      required: true 
    },
    subscriptionId: { 
      type: String, 
      ref: 'Subscription', 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true 
    },
  },
  { timestamps: true }
);

const Payment = mongoose.models.Payment || mongoose.model<IPayment>('Payment', paymentSchema);
export default Payment;

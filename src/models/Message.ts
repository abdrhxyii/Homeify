import mongoose, { Schema, Document } from 'mongoose';

export interface IMessage extends Document {
  receiverId: mongoose.Types.ObjectId; 
  senderId: mongoose.Types.ObjectId; 
  content: string;
  propertyId: mongoose.Types.ObjectId; 
}

const messageSchema: Schema = new Schema(
  {
    receiverId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    senderId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    content: { 
      type: String, 
      required: true 
    },
    propertyId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Property', 
      required: true 
    },
  },
  { timestamps: true }
);

const Message = mongoose.models.Message || mongoose.model<IMessage>('Message', messageSchema);
export default Message;

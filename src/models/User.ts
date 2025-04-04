import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  phoneNumber: string;
  role: string; 
}

const userSchema: Schema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: false,
      trim: true,
      default: null
    },
    phoneNumber: {
      type: String,
      required: false,
      trim: true,
      default: null
    },
    role: {
      type: String,
      required: true,
      enum: ['USER', 'ADMIN', 'SELLER'], 
      default: 'user',
    },
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
export default User;

import { Schema, model, Document } from "mongoose";

export interface IUser extends Document {
  email: string;
  password: string;
  role: "user" | "admin";
  razorpayCustomerId?: string;
  paymentMethods?: string[]; // List of Razorpay payment method IDs
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    razorpayCustomerId: { type: String },
    paymentMethods: [{ type: String }],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

export const User = model<IUser>("User", userSchema);

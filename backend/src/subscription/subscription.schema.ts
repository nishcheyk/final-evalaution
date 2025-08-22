import { Schema, model, Types } from "mongoose";

const subscriptionSchema = new Schema({
  userId: { type: Types.ObjectId, ref: "User", required: true },
  planId: { type: Types.ObjectId, ref: "Plan", required: true },
  dummySubscriptionId: { type: String, required: true }, // example: payment gateway subscription id
  startDate: { type: Date, default: Date.now },
  nextPaymentDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
});

export const Subscription = model("Subscription", subscriptionSchema);

import { Document, Schema, model, Types } from "mongoose";

export interface ISubscription extends Document {
  userId: Types.ObjectId;
  plan: {
    _id: Types.ObjectId;
    name: string;
    amount: number;
    interval: "month" | "quarter" | "half_year";
  };
  dummySubscriptionId: string;
  startDate: Date;
  nextPaymentDate: Date;
  status: "active" | "cancelled";
}

const planSubSchema = new Schema(
  {
    _id: { type: Schema.Types.ObjectId, ref: "Plan", required: true },
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    interval: {
      type: String,
      enum: ["month", "quarter", "half_year"],
      required: true,
    },
  },
  { _id: false }
);

const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: planSubSchema, required: true },
  dummySubscriptionId: { type: String, required: false },
  startDate: { type: Date, default: Date.now },
  nextPaymentDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
});

export const Subscription = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);

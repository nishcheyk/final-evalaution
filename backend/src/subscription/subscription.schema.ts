import { Document, Schema, model, Types } from "mongoose";

/**
 * Interface representing a Subscription document in MongoDB.
 * @interface ISubscription
 * @extends Document
 *
 * @property {Types.ObjectId} userId - Reference to the User who owns the subscription.
 * @property {Object} plan - The subscribed plan details.
 * @property {Types.ObjectId} plan._id - Plan ID.
 * @property {string} plan.name - Plan name.
 * @property {number} plan.amount - Payment amount for the plan.
 * @property {"month" | "quarter" | "half_year"} plan.interval - Plan interval type.
 * @property {string} dummySubscriptionId - A custom ID for the subscription (optional).
 * @property {Date} startDate - Subscription start date.
 * @property {Date} nextPaymentDate - Date for the next scheduled payment.
 * @property {"active" | "cancelled"} status - Current status of the subscription.
 */
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

/**
 * Sub-schema for the plan inside a subscription.
 */
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

/**
 * Mongoose Schema for Subscription documents.
 */
const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  plan: { type: planSubSchema, required: true },
  dummySubscriptionId: { type: String, required: false },
  startDate: { type: Date, default: Date.now },
  nextPaymentDate: { type: Date, required: true },
  status: { type: String, enum: ["active", "cancelled"], default: "active" },
});

/**
 * Subscription model.
 */
export const Subscription = model<ISubscription>(
  "Subscription",
  subscriptionSchema
);

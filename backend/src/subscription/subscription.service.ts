import { Subscription, ISubscription } from "./subscription.schema";
import { Types } from "mongoose";

function generateDummySubscriptionId(): string {
  return "sub_" + Math.random().toString(36).substring(2, 15);
}

export async function findActiveSubscription(
  userId: string | Types.ObjectId,
  planId: string | Types.ObjectId
): Promise<ISubscription | null> {
  return Subscription.findOne({
    userId,
    "plan._id": planId,
    status: "active",
  }).exec();
}

export async function createSubscription(data: any): Promise<ISubscription> {
  // Generate dummySubscriptionId if not provided
  const dummySubscriptionId =
    data.dummySubscriptionId || generateDummySubscriptionId();

  // Calculate nextPaymentDate: set 1 month ahead from now
  const nextPaymentDate = new Date();
  nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

  const subscription = new Subscription({
    userId: data.userId,
    plan: data.plan,
    dummySubscriptionId:
      data.dummySubscriptionId || generateDummySubscriptionId(),
    nextPaymentDate,
    status: "active",
  });
  await subscription.save();

  return subscription.save();
}

export async function getUserSubscriptions(
  userId: string | Types.ObjectId
): Promise<ISubscription[]> {
  return Subscription.find({ userId }).populate("plan").exec();
}

export async function cancelSubscription(
  subscriptionId: string | Types.ObjectId
): Promise<void> {
  await Subscription.findByIdAndUpdate(subscriptionId, {
    status: "cancelled",
  }).exec();
}

import { Subscription, ISubscription } from "./subscription.schema";
import { Types } from "mongoose";

/**
 * Generates a dummy subscription ID string.
 * @returns {string} Dummy subscription ID prefixed with 'sub_'.
 */
function generateDummySubscriptionId(): string {
  return "sub_" + Math.random().toString(36).substring(2, 15);
}

/**
 * Finds an active subscription by user ID and plan ID.
 *
 * @param {string | Types.ObjectId} userId - ID of the user.
 * @param {string | Types.ObjectId} planId - ID of the plan.
 * @returns {Promise<ISubscription | null>} The active subscription or null if none exists.
 */
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

/**
 * Creates a new subscription document.
 * Generates a dummySubscriptionId if not provided and sets nextPaymentDate to 1 month from now.
 *
 * @param {any} data - Subscription data including userId, plan, and optional dummySubscriptionId.
 * @returns {Promise<ISubscription>} The created subscription document.
 */
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
    dummySubscriptionId: dummySubscriptionId,
    nextPaymentDate,
    status: "active",
  });
  await subscription.save();

  return subscription;
}

/**
 * Retrieves all subscriptions for a given user.
 *
 * @param {string | Types.ObjectId} userId - ID of the user.
 * @returns {Promise<ISubscription[]>} Array of subscription documents.
 */
export async function getUserSubscriptions(
  userId: string | Types.ObjectId
): Promise<ISubscription[]> {
  return Subscription.find({ userId }).populate("plan").exec();
}

/**
 * Cancels a subscription by setting its status to "cancelled".
 *
 * @param {string | Types.ObjectId} subscriptionId - ID of the subscription to cancel.
 * @returns {Promise<void>} Resolves when cancellation is complete.
 */
export async function cancelSubscription(
  subscriptionId: string | Types.ObjectId
): Promise<void> {
  await Subscription.findByIdAndUpdate(subscriptionId, {
    status: "cancelled",
  }).exec();
}

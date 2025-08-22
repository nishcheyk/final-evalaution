import { Subscription } from "./subscription.schema";
import { Plan } from "../plan/plan.schema";
import notificationQueue from "../notification/notification.queue";
import {
  processDummyPayment,
  PaymentStatus,
} from "../dummypayment/dummyPayment.service";
import * as planService from "../plan/plan.service";

export async function createSubscription(data: {
  userId: string;
  planId: string;
  userName: string;
  customerEmail: string;
  paymentMethod: string;
}) {
  const plan = await Plan.findById(data.planId);
  if (!plan) throw new Error("Plan not found");

  // Process first payment immediately
  const status: PaymentStatus = await processDummyPayment(
    plan.amount,
    data.paymentMethod
  );
  if (status === "failure") {
    throw new Error("Payment failed in dummy gateway");
  }

  const now = new Date();
  const nextPaymentDate = new Date(now);
  switch (plan.interval) {
    case "month":
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
      break;
    case "quarter":
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 3);
      break;
    case "half_year":
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 6);
      break;
    default:
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
  }

  // Create and save subscription document
  const subscription = new Subscription({
    userId: data.userId,
    planId: data.planId,
    dummySubscriptionId: "dummy-subscription-id",
    nextPaymentDate,
    status: "active",
    createdAt: now,
  });
  await subscription.save();

  // Update the plan's current amount and possibly deactivate it
  await planService.updatePlanAmount(plan._id.toString(), plan.amount);

  // Schedule notification 1 day before next payment date
  const reminderDate = new Date(
    nextPaymentDate.getTime() - 24 * 60 * 60 * 1000
  );
  notificationQueue.add(
    "paymentReminder",
    {
      email: data.customerEmail,
      userName: data.userName,
      dueDate: nextPaymentDate.toDateString(),
      planName: plan.name,
      amount: plan.amount,
    },
    { delay: reminderDate.getTime() - Date.now() }
  );

  return subscription;
}

export async function getUserSubscriptions(userId: string) {
  return Subscription.find({ userId, status: "active" }).populate("planId");
}

export async function cancelSubscription(subscriptionId: string) {
  const subscription = await Subscription.findById(subscriptionId);
  if (!subscription) throw new Error("Subscription not found");

  subscription.status = "cancelled";
  await subscription.save();

  return subscription;
}

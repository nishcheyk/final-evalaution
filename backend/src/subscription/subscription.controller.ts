import { Request, Response } from "express";
import * as subscriptionService from "./subscription.service";
import notificationQueue from "../notification/notification.queue";

export async function createSubscription(req: Request, res: Response) {
  try {
    const { userId, plan, userName, customerEmail, paymentMethod } = req.body;
    const missingFields = [];
    if (!userId) missingFields.push("userId");
    if (!plan || !plan._id) missingFields.push("plan");
    if (!userName) missingFields.push("userName");
    if (!customerEmail) missingFields.push("customerEmail");
    if (!paymentMethod) missingFields.push("paymentMethod");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: "Missing required subscription fields",
        missingFields,
      });
    }

    const existingSub = await subscriptionService.findActiveSubscription(
      userId,
      plan._id
    );
    if (existingSub) {
      return res.status(400).json({
        message: "You already have an active subscription for this plan",
      });
    }

    // Create the subscription (dummySubscriptionId will be generated inside service)
    const subscription = await subscriptionService.createSubscription(req.body);

    // Immediately enqueue payment success notification
    await notificationQueue.add({
      type: "paymentSuccess",
      data: {
        email: customerEmail,
        userName,
        planName: subscription.plan.name || "Your Plan",
        amount: subscription.plan.amount || 0,
      },
    });

    // Schedule payment reminder 1 day before nextPaymentDate
    const now = new Date();
    const reminderDate = new Date(subscription.nextPaymentDate);
    reminderDate.setDate(reminderDate.getDate() - 1);
    const delayMs = reminderDate.getTime() - now.getTime();

    if (delayMs > 0) {
      await notificationQueue.add(
        {
          type: "paymentReminder",
          data: {
            email: customerEmail,
            userName,
            planName: subscription.plan.name || "Your Plan",
            amount: subscription.plan.amount || 0,
          },
        },
        { delay: delayMs, attempts: 3 }
      );
    }

    return res.status(201).json(subscription);
  } catch (error: any) {
    console.error("Create subscription error:", error);
    return res
      .status(400)
      .json({ message: error.message || "Subscription creation failed" });
  }
}

export async function getActiveSubscriptions(req: Request, res: Response) {
  const userId = req.params.userId;
  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }
  try {
    const subscriptions =
      await subscriptionService.getUserSubscriptions(userId);
    return res.json(subscriptions);
  } catch (error: any) {
    console.error("Get active subscriptions error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Unable to fetch subscriptions" });
  }
}

export async function cancelSubscription(req: Request, res: Response) {
  const subscriptionId = req.params.subscriptionId;
  if (!subscriptionId) {
    return res.status(400).json({ message: "Subscription ID is required" });
  }
  try {
    await subscriptionService.cancelSubscription(subscriptionId);
    return res
      .status(200)
      .json({ message: "Subscription cancelled successfully" });
  } catch (error: any) {
    console.error("Cancel subscription error:", error);
    return res
      .status(500)
      .json({ message: error.message || "Subscription cancellation failed" });
  }
}

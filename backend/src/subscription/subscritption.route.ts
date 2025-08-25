import { Router } from "express";
import {
  createSubscription,
  getActiveSubscriptions,
  cancelSubscription,
} from "./subscription.controller";

const router = Router();

/**
 * Route to create a new subscription.
 * @name POST /
 * @function
 * @param {import('express').Request} req - Express request object. Expects subscription data in body.
 * @param {import('express').Response} res - Express response object.
 */
router.post("/", createSubscription);

/**
 * Route to get active subscriptions for a user.
 * @name GET /:userId
 * @function
 * @param {import('express').Request} req - Request object with userId in params.
 * @param {import('express').Response} res - Response object with subscription data.
 */
router.get("/:userId", getActiveSubscriptions);

/**
 * Route to cancel a subscription by subscription ID.
 * @name PATCH /cancel/:subscriptionId
 * @function
 * @param {import('express').Request} req - Request object with subscriptionId in params.
 * @param {import('express').Response} res - Response object with cancellation confirmation.
 */
router.patch("/cancel/:subscriptionId", cancelSubscription);

export default router;

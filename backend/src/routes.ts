import { Router } from "express";
import userRoutes from "./users/user.route";
import planRoutes from "./plan/plan.route";
import subscriptionRoutes from "./subscription/subscritption.route";
import analyticsRoutes from "./analytics/analytics.route";

/**
 * Main application router which aggregates sub-routers for different resources.
 *
 * Mounts:
 *  - /users for user-related routes
 *  - /plans for plan-related routes
 *  - /subscriptions for subscription-related routes
 *  - /analytics for analytics-related routes
 */
const router = Router();

/**
 * User-related routes.
 * Handles user management endpoints.
 */
router.use("/users", userRoutes);

/**
 * Plan-related routes.
 * Handles plan creation, listing, and management.
 */
router.use("/plans", planRoutes);

/**
 * Subscription-related routes.
 * Handles subscription lifecycle management.
 */
router.use("/subscriptions", subscriptionRoutes);

/**
 * Analytics-related routes.
 * Handles dashboard and reporting endpoints.
 */
router.use("/analytics", analyticsRoutes);

export default router;

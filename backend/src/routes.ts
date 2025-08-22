import { Router } from "express";
import userRoutes from "./users/user.route";
import planRoutes from "./plan/plan.route";
import subscriptionRoutes from "./subscription/subscritption.route";
import analyticsRoutes from "./analytics/analytics.route";

const router = Router();

router.use("/users", userRoutes);
router.use("/plans", planRoutes);
router.use("/subscriptions", subscriptionRoutes);
router.use("/analytics", analyticsRoutes);

export default router;

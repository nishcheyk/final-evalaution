import { Router } from "express";
import {
  createSubscription,
  getActiveSubscriptions,
  cancelSubscription,
} from "./subscription.controller";

const router = Router();

router.post("/", createSubscription);
router.get("/:userId", getActiveSubscriptions);
router.patch("/cancel/:subscriptionId", cancelSubscription);

export default router;

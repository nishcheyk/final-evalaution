import { Router } from "express";
import {
  createPlan,
  getPlans,
  deactivatePlan,
  reactivatePlan,
  getAllPlans,
} from "./plan.controller";

const router = Router();

// Admin only
router.post("/", createPlan);
router.get("/", getPlans);
router.patch("/:id", deactivatePlan); // PATCH endpoint for deactivation
router.patch("/reactivate/:id", reactivatePlan);
router.get("/all", getAllPlans);

export default router;

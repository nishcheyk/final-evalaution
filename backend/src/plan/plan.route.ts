import { Router } from "express";
import { createPlan, getPlans } from "./plan.controller";

const router = Router();

// Admin only
router.post("/", createPlan);

router.get("/", getPlans);

export default router;

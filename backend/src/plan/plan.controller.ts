import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as planService from "./plan.service";
import { Plan } from "./plan.schema";

export const createPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await planService.createPlan(req.body);
  res.status(201).json(plan);
});

export const getPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = await planService.getActivePlans();
  res.json(plans);
});

/**
 * Deactivate (soft delete) a plan by ID
 */
export const deactivatePlan = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const plan = await planService.deactivatePlan(id);
    res.json(plan);
  }
);
export const reactivatePlan = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const plan = await planService.reactivatePlan(id);
    res.json(plan);
  }
);
// To get all plans regardless of isActive status
export const getAllPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = await Plan.find(); // No filter, returns all plans
  res.json(plans);
});

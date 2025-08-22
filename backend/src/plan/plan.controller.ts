import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as planService from "./plan.service";

export const createPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await planService.createPlan(req.body);
  res.status(201).json(plan);
});

export const getPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = await planService.getActivePlans();
  res.json(plans);
});

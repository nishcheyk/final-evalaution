import { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import * as planService from "./plan.service";
import { Plan } from "./plan.schema";

/**
 * Create a new plan.
 * @async
 * @param {Request} req - Express request object, expects plan data in body.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} JSON of created plan with 201 status.
 */
export const createPlan = asyncHandler(async (req: Request, res: Response) => {
  const plan = await planService.createPlan(req.body);
  res.status(201).json(plan);
});

/**
 * Fetch all active plans.
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} JSON array of active plans.
 */
export const getPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = await planService.getActivePlans();
  res.json(plans);
});

/**
 * Deactivate (soft delete) a plan by its ID.
 * @async
 * @param {Request} req - Express request object, expects plan ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} JSON of the deactivated plan.
 */
export const deactivatePlan = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const plan = await planService.deactivatePlan(id);
    res.json(plan);
  }
);

/**
 * Reactivate a plan by its ID.
 * @async
 * @param {Request} req - Express request object, expects plan ID in params.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} JSON of the reactivated plan.
 */
export const reactivatePlan = asyncHandler(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const plan = await planService.reactivatePlan(id);
    res.json(plan);
  }
);

/**
 * Fetch all plans regardless of active status.
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} JSON array of all plans.
 */
export const getAllPlans = asyncHandler(async (req: Request, res: Response) => {
  const plans = await Plan.find(); // No filter, returns all plans
  res.json(plans);
});

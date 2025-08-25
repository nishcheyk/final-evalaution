import { Request, Response } from "express";
import * as analyticsService from "./analytics.service";

/**
 * Get public dashboard analytics statistics.
 *
 * @async
 * @param {Request} req - Express request object.
 * @param {Response} res - Express response object.
 * @returns {Promise<void>} JSON response with analytics data or error message.
 */
export async function getDashboardStats(req: Request, res: Response) {
  try {
    const data = await analyticsService.getPublicAnalytics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
}

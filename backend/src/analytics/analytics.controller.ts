import { Request, Response } from "express";
import * as analyticsService from "./analytics.service";

export async function getDashboardStats(req: Request, res: Response) {
  try {
    const data = await analyticsService.getPublicAnalytics();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch analytics" });
  }
}

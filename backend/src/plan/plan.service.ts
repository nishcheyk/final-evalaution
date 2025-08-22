import { Plan } from "./plan.schema";

export async function createPlan(data: any) {
  const plan = new Plan(data);
  return plan.save();
}

export async function getActivePlans() {
  return Plan.find({ isActive: true });
}

/**
 * Updates the plan's current raised amount and deactivates plan if goal reached.
 */
export async function updatePlanAmount(planId: string, amount: number) {
  const plan = await Plan.findById(planId);
  if (!plan) throw new Error("Plan not found");

  plan.currentAmount += amount;

  if (plan.currentAmount >= plan.goalAmount) {
    plan.isActive = false;
  }

  return plan.save();
}

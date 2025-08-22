import { Subscription } from "../subscription/subscription.schema";
import { Plan } from "../plan/plan.schema";
import { User } from "../users/user.schema";

/**
 * Calculate total funds raised:
 * Sum actual amounts paid for active or cancelled subscriptions with payments made,
 * and group by plan for more granular detail.
 */
export async function getTotalFundsRaised() {
  const result = await Subscription.aggregate([
    // Include active and cancelled (paid) subscriptions
    { $match: { status: { $in: ["active", "cancelled"] } } },

    // Join with plan data
    {
      $lookup: {
        from: "plans",
        localField: "planId",
        foreignField: "_id",
        as: "plan",
      },
    },
    { $unwind: "$plan" },

    // Group by plan and sum amounts individually
    {
      $group: {
        _id: "$plan._id",
        planName: { $first: "$plan.name" },
        amountPerSubscription: { $first: "$plan.amount" },
        totalRaisedByPlan: { $sum: "$plan.amount" },
        goalAmount: { $first: "$plan.goalAmount" },
      },
    },
  ]);

  // Also compute total raised from all plans combined:
  const totalRaised = result.reduce(
    (sum, plan) => sum + plan.totalRaisedByPlan,
    0
  );

  return {
    totalRaised,
    byPlan: result,
  };
}

/**
 * Count of currently active funding plans.
 */
export async function getActiveFundingPlansCount() {
  return Plan.countDocuments({ isActive: true });
}

/**
 * Count distinct donors with subscriptions (active or cancelled).
 */
export async function getTotalDonorsCount() {
  return Subscription.distinct("userId", {
    status: { $in: ["active", "cancelled"] },
  }).then((users) => users.length);
}

/**
 * Aggregated analytics for public dashboard or admin.
 */
export async function getPublicAnalytics() {
  const [fundsData, activePlans, donors] = await Promise.all([
    getTotalFundsRaised(),
    getActiveFundingPlansCount(),
    getTotalDonorsCount(),
  ]);

  return {
    totalFundsRaised: fundsData.totalRaised,
    activeFundingPlans: activePlans,
    totalDonors: donors,
    fundsRaisedByPlan: fundsData.byPlan,
  };
}

/**
 * Bonus: Get list of top donors by total amount donated.
 */
export async function getTopDonors(limit = 5) {
  const donorAggregates = await Subscription.aggregate([
    { $match: { status: { $in: ["active", "cancelled"] } } },
    {
      $lookup: {
        from: "plans",
        localField: "planId",
        foreignField: "_id",
        as: "plan",
      },
    },
    { $unwind: "$plan" },
    {
      $group: {
        _id: "$userId",
        totalDonated: { $sum: "$plan.amount" },
      },
    },
    { $sort: { totalDonated: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        userId: "$_id",
        totalDonated: 1,
        email: "$user.email",
      },
    },
  ]);

  return donorAggregates;
}

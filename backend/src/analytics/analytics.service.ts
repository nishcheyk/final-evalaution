import { Subscription } from "../subscription/subscription.schema";
import { Plan } from "../plan/plan.schema";
import { User } from "../users/user.schema";

/**
 * Calculate total funds raised by summing the amounts of active or cancelled subscriptions.
 * Groups results by plan providing detailed breakdown per plan.
 *
 * @async
 * @returns {Promise<Object>} Aggregated analytics object with:
 *  - totalRaised: total amount raised across all plans (number)
 *  - byPlan: array of objects with planId, planName, amountPerSubscription, totalRaisedByPlan, goalAmount
 */
export async function getTotalFundsRaised() {
  const result = await Subscription.aggregate([
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
        _id: "$plan._id",
        planName: { $first: "$plan.name" },
        amountPerSubscription: { $first: "$plan.amount" },
        totalRaisedByPlan: { $sum: "$plan.amount" },
        goalAmount: { $first: "$plan.goalAmount" },
      },
    },
  ]);

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
 * Counts the number of active funding plans.
 *
 * @async
 * @returns {Promise<number>} Count of plans where `isActive` is true.
 */
export async function getActiveFundingPlansCount() {
  return Plan.countDocuments({ isActive: true });
}

/**
 * Counts the number of distinct donors who have active or cancelled subscriptions.
 *
 * @async
 * @returns {Promise<number>} Number of unique user IDs with relevant subscriptions.
 */
export async function getTotalDonorsCount() {
  return Subscription.distinct("userId", {
    status: { $in: ["active", "cancelled"] },
  }).then((users) => users.length);
}

/**
 * Fetches aggregated analytics data for dashboard display.
 * Combines totals for funds raised, active plans, and total donors.
 *
 * @async
 * @returns {Promise<Object>} Analytics summary containing:
 *  - totalFundsRaised {number}
 *  - activeFundingPlans {number}
 *  - totalDonors {number}
 *  - fundsRaisedByPlan {Array<Object>}
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
 * Gets the list of top donors sorted by total donated amount.
 *
 * @async
 * @param {number} [limit=5] - Maximum number of top donors to retrieve.
 * @returns {Promise<Array<Object>>} Array of objects containing:
 *  - userId {ObjectId} donor's user ID
 *  - totalDonated {number} total amount donated
 *  - email {string} donor's email address
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

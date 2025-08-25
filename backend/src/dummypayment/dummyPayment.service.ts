/**
 * Possible payment statuses.
 * @typedef {"success" | "failure"} PaymentStatus
 */

/**
 * Simulates processing a dummy payment.
 *
 * @async
 * @param {number} amount - The amount to be paid.
 * @param {string} method - The payment method.
 * @returns {Promise<PaymentStatus>} Resolves to "success" or "failure" randomly (80% success rate).
 */
export async function processDummyPayment(
  amount: number,
  method: string
): Promise<"success" | "failure"> {
  console.log(
    `Processing dummy payment of amount ${amount} using method ${method}`
  );

  // Simulate async payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const success = Math.random() > 0.2;

  return success ? "success" : "failure";
}

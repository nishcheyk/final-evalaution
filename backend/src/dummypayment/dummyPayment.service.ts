export type PaymentStatus = "success" | "failure";

export async function processDummyPayment(
  amount: number,
  method: string
): Promise<PaymentStatus> {
  console.log(
    `Processing dummy payment of amount ${amount} using method ${method}`
  );

  // Simulate async payment processing delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Randomly succeed or fail (80% success rate)
  const success = Math.random() > 0.2;

  return success ? "success" : "failure";
}

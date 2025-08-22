import React from "react";
import {
  useGetUserSubscriptionsQuery,
  useCancelSubscriptionMutation,
} from "../../services/apiSlice";
import styles from "../../style/SubscriptionListPage.module.css";

const SubscriptionListPage: React.FC<{ userId: string }> = ({ userId }) => {
  const {
    data: subscriptions,
    error,
    isLoading,
  } = useGetUserSubscriptionsQuery(userId);
  const [cancelSubscription, { isLoading: isCanceling }] =
    useCancelSubscriptionMutation();

  if (isLoading)
    return <p className={styles.message}>Loading subscriptions...</p>;
  if (error)
    return <p className={styles.error}>Error loading subscriptions.</p>;
  if (!subscriptions || subscriptions.length === 0)
    return <p className={styles.message}>No active subscriptions found.</p>;

  const handleCancel = async (id: string) => {
    if (window.confirm("Are you sure you want to cancel this subscription?")) {
      try {
        await cancelSubscription(id).unwrap();
        alert("Subscription cancelled successfully.");
      } catch {
        alert("Failed to cancel subscription.");
      }
    }
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Your Subscriptions</h2>
      <table className={styles.table} aria-label="User subscriptions table">
        <thead>
          <tr>
            <th>Plan</th>
            <th>Status</th>
            <th>Next Payment Date</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr key={sub._id} className={styles.row}>
              <td>{sub.plan?.name || "Unknown Plan"}</td>

              <td
                className={
                  sub.status === "active"
                    ? styles.activeStatus
                    : styles.cancelledStatus
                }
              >
                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
              </td>
              <td>{new Date(sub.nextPaymentDate).toLocaleDateString()}</td>
              <td>
                {sub.status === "active" && (
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancel(sub._id)}
                    disabled={isCanceling}
                  >
                    {isCanceling ? "Cancelling..." : "Cancel"}
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default SubscriptionListPage;

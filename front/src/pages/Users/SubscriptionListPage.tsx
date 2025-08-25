import React, { useState } from "react";
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
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  if (isLoading)
    return <p className={styles.message}>Loading subscriptions...</p>;
  if (error)
    return <p className={styles.error}>Error loading subscriptions.</p>;
  if (!subscriptions || subscriptions.length === 0)
    return <p className={styles.message}>No active subscriptions found.</p>;

  const handleCancel = async (id: string) => {
    if (!window.confirm("Are you sure you want to cancel this subscription?"))
      return;
    try {
      await cancelSubscription(id).unwrap();
      setFeedbackMessage("Subscription cancelled successfully.");
    } catch {
      setFeedbackMessage("Failed to cancel subscription.");
    }
    setTimeout(() => setFeedbackMessage(null), 4000);
  };

  return (
    <section className={styles.container}>
      <h2 className={styles.title}>Your Subscriptions</h2>
      {feedbackMessage && <p className={styles.message}>{feedbackMessage}</p>}
      <table
        className={styles.table}
        aria-label="User subscriptions table"
        role="grid"
      >
        <thead>
          <tr role="row">
            <th role="columnheader">Plan</th>
            <th role="columnheader">Status</th>
            <th role="columnheader">Next Payment Date</th>
            <th role="columnheader">Action</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map((sub) => (
            <tr
              key={sub._id}
              className={styles.row}
              onMouseEnter={() => setHoveredRow(sub._id)}
              onMouseLeave={() => setHoveredRow(null)}
              tabIndex={0}
              aria-selected={hoveredRow === sub._id}
              onKeyDown={(e) => {
                if (e.key === "Enter" && sub.status === "active") {
                  handleCancel(sub._id);
                }
              }}
            >
              <td role="gridcell">{sub.plan?.name || "Unknown Plan"}</td>
              <td
                role="gridcell"
                className={
                  sub.status === "active"
                    ? styles.activeStatus
                    : styles.cancelledStatus
                }
              >
                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
              </td>
              <td role="gridcell">
                {new Date(sub.nextPaymentDate).toLocaleDateString()}
              </td>
              <td role="gridcell">
                {sub.status === "active" && hoveredRow === sub._id && (
                  <button
                    className={styles.cancelButton}
                    onClick={() => handleCancel(sub._id)}
                    disabled={isCanceling}
                    aria-label="Cancel subscription"
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

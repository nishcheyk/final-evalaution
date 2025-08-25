import React from "react";
import { useGetUserSubscriptionsQuery } from "../services/apiSlice";
import LottieLoader from "./Lottie.loader";

const DonationHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const { data, error, isLoading } = useGetUserSubscriptionsQuery(userId);

  if (isLoading) return <LottieLoader />;
  if (error) return <p>Error loading donation history.</p>;

  if (!data || data.length === 0) {
    return <p>You have no active donations or subscriptions.</p>;
  }

  return (
    <section style={{ marginTop: 40 }}>
      <h2>Your Donation History</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid #ccc" }}>
            <th style={{ padding: 8, textAlign: "left" }}>Plan</th>
            <th style={{ padding: 8, textAlign: "left" }}>Status</th>
            <th style={{ padding: 8, textAlign: "left" }}>Next Payment Date</th>
          </tr>
        </thead>
        <tbody>
          {data.map((subscription) => (
            <tr
              key={subscription._id}
              style={{ borderBottom: "1px solid #eee" }}
            >
              <td style={{ padding: 8 }}>
                {subscription.plan?.name ?? "Unknown Plan"}
              </td>
              <td style={{ padding: 8 }}>{subscription.status}</td>
              <td style={{ padding: 8 }}>
                {new Date(subscription.nextPaymentDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

export default DonationHistory;

import React, { useState } from "react";
import {
  useGetDashboardStatsQuery,
  useGetPlansQuery,
  useGetUserSubscriptionsQuery,
} from "../../services/apiSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";

// FAQ component with simple expand/collapse behavior
const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How can I support a funding plan?",
      answer:
        "Click on 'Subscribe Now' for any active plan and follow the payment instructions.",
    },
    {
      question: "Can I create my own funding plan?",
      answer:
        "Yes, registered users can create new plans from their dashboard.",
    },
    {
      question: "Is my donation secure?",
      answer: "We use secure payment gateways to protect your transactions.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section style={{ marginTop: 40 }}>
      <h2>Frequently Asked Questions</h2>
      {faqs.map(({ question, answer }, idx) => (
        <div
          key={idx}
          style={{
            borderBottom: "1px solid #ddd",
            padding: "12px 0",
            cursor: "pointer",
          }}
          onClick={() => toggle(idx)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") toggle(idx);
          }}
        >
          <strong style={{ display: "block", fontSize: 18 }}>{question}</strong>
          {openIndex === idx && (
            <p style={{ marginTop: 8, fontSize: 16, color: "#555" }}>
              {answer}
            </p>
          )}
        </div>
      ))}
    </section>
  );
};

// DonationHistory component showing user's subscriptions
const DonationHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const { data, isLoading, error } = useGetUserSubscriptionsQuery(userId);

  if (isLoading) return <p>Loading your donation history...</p>;
  if (error) return <p>Error loading donation history.</p>;
  if (!data || data.length === 0)
    return <p>You do not have any active donations.</p>;

  return (
    <section style={{ marginTop: 40 }}>
      <h2>Your Donation History</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "2px solid #ccc" }}>
            <th style={{ textAlign: "left", padding: 8 }}>Plan</th>
            <th style={{ textAlign: "left", padding: 8 }}>Status</th>
            <th style={{ textAlign: "left", padding: 8 }}>Next Payment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sub) => (
            <tr key={sub._id} style={{ borderBottom: "1px solid #eee" }}>
              <td style={{ padding: 8 }}>
                {sub.planId?.name || "Unknown Plan"}
              </td>
              <td style={{ padding: 8 }}>{sub.status}</td>
              <td style={{ padding: 8 }}>
                {new Date(sub.nextPaymentDate).toLocaleDateString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
};

const Dashboard: React.FC = () => {
  const { data, error, isLoading } = useGetDashboardStatsQuery(undefined);
  const { data: plans } = useGetPlansQuery(undefined);
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const navigate = useNavigate();

  if (isLoading) return <p>Loading dashboard analytics...</p>;
  if (error) return <p>Error loading dashboard analytics.</p>;

  const featuredPlans = plans?.filter((p) => p.isActive).slice(0, 3) ?? [];

  return (
    <div
      style={{
        padding: 20,
        maxWidth: 900,
        margin: "0 auto",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      {/* Header and CTA */}
      <header style={{ marginBottom: 30, textAlign: "center" }}>
        <h1>Welcome to Our NGO Funding Platform</h1>
        <p
          style={{
            fontSize: 18,
            color: "#555",
            maxWidth: 600,
            margin: "10px auto",
          }}
        >
          Join hands with us to make a difference. Support a funding plan or
          start one yourself!
        </p>
        <button
          onClick={() => navigate("/user/plans")}
          style={{
            backgroundColor: "#0f62fe",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 16,
            marginTop: 15,
          }}
        >
          Subscribe to Funding Now
        </button>
      </header>

      {/* Summary Cards */}
      <section
        style={{
          display: "flex",
          gap: 20,
          marginBottom: 40,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <StatCard
          title="Total Funds Raised"
          value={`$${(data?.totalFundsRaised ?? 0).toLocaleString(undefined, {
            minimumFractionDigits: 2,
          })}`}
          color="#0f62fe"
        />
        <StatCard
          title="Active Funding Plans"
          value={data?.activeFundingPlans ?? 0}
          color="#198038"
        />
        <StatCard
          title="Total Donors"
          value={data?.totalDonors ?? 0}
          color="#fa4d56"
        />
      </section>

      {/* Featured Funding Plans */}
      <section style={{ marginBottom: 40 }}>
        <h2>Featured Funding Plans</h2>
        <div style={{ display: "flex", gap: 15, flexWrap: "wrap" }}>
          {featuredPlans.length > 0 ? (
            featuredPlans.map((plan) => (
              <div
                key={plan._id}
                style={{
                  flex: "1 1 280px",
                  border: "1px solid #ccc",
                  borderRadius: 8,
                  padding: 16,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
                }}
              >
                <h3>{plan.name}</h3>
                <p>
                  Amount: ${(plan.amount / 100).toFixed(2)} every{" "}
                  {plan.interval.replace("_", " ")}
                </p>
                <p>Goal: ${(plan.goalAmount / 100).toLocaleString()}</p>
                <button
                  onClick={() => navigate(`/user/subscribe/${plan._id}`)}
                  style={{
                    backgroundColor: "#0f62fe",
                    color: "white",
                    border: "none",
                    padding: "8px 16px",
                    borderRadius: 4,
                    cursor: "pointer",
                    marginTop: 10,
                  }}
                >
                  Subscribe Now
                </button>
              </div>
            ))
          ) : (
            <p>No active plans available currently.</p>
          )}
        </div>
      </section>

      {/* Donation history only if logged in */}
      {currentUser && <DonationHistory userId={currentUser._id} />}

      {/* FAQ always shown */}
      <FAQ />

      {/* Footer */}
      <footer style={{ textAlign: "center", color: "#888", marginTop: 40 }}>
        <p>More features and impact stories coming soon...</p>
      </footer>
    </div>
  );
};

const StatCard = ({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) => (
  <div
    style={{
      backgroundColor: color,
      color: "white",
      padding: 20,
      borderRadius: 12,
      flex: "1 1 160px",
      minWidth: 160,
      boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 24,
    }}
  >
    <div style={{ fontSize: 14, marginBottom: 6 }}>{title}</div>
    <div>{value}</div>
  </div>
);

export default Dashboard;

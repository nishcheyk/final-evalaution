import React from "react";
import { useGetPlansQuery } from "../../services/apiSlice";
import { Link } from "react-router-dom";

const PlansList = () => {
  const { data: plans = [], isLoading, error } = useGetPlansQuery();

  if (isLoading) return <p>Loading plans...</p>;
  if (error) return <p>Error loading plans.</p>;

  return (
    <div style={{ maxWidth: 700, margin: "auto", padding: 20 }}>
      <h2>Available Funding Plans</h2>
      {plans.length === 0 && <p>No active plans at the moment.</p>}
      {plans.map(
        (plan) =>
          plan.isActive && (
            <div
              key={plan.id}
              style={{
                border: "1px solid #ccc",
                padding: 15,
                marginBottom: 10,
              }}
            >
              <h3>{plan.name}</h3>
              <p>
                Recurring Amount: ${(plan.amount / 100).toFixed(2)} per{" "}
                {plan.interval}
              </p>
              <p>Goal: ${(plan.goalAmount / 100).toFixed(2)}</p>
              <Link to={`/user/subscribe/${plan._id}`}>Subscribe</Link>
            </div>
          )
      )}
    </div>
  );
};

export default PlansList;

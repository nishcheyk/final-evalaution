// ManagePlans.tsx
import React from "react";
import {
  useGetAllPlansQuery, // changed here to fetch all plans including inactive
  useUpdatePlanStatusMutation,
} from "../../services/apiSlice";
import styles from "../../style/ManagePlans.module.css";

const ManagePlans = () => {
  const { data: plans = [], isLoading, isError } = useGetAllPlansQuery();
  const [updatePlanStatus, { isLoading: isUpdating }] =
    useUpdatePlanStatusMutation();

  if (isLoading) return <p>Loading plans...</p>;
  if (isError) return <p>Error loading plans.</p>;

  const handleDeactivate = async (id: string) => {
    if (window.confirm("Are you sure you want to deactivate this plan?")) {
      await updatePlanStatus({ id, isActive: false });
    }
  };

  const handleReactivate = async (id: string) => {
    if (window.confirm("Do you want to reactivate this plan?")) {
      await updatePlanStatus({ id, isActive: true });
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Manage Funding Plans</h2>
      {plans.length === 0 ? (
        <p>No plans found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Amount</th>
              <th>Interval</th>
              <th>Goal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((plan) => (
              <tr key={plan._id}>
                <td>{plan.name}</td>
                <td>${(plan.amount / 100).toFixed(2)}</td>
                <td>{plan.interval}</td>
                <td>${(plan.goalAmount / 100).toFixed(2)}</td>
                <td>{plan.isActive ? "Active" : "Inactive"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManagePlans;

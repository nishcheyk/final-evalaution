import React from "react";
import { useGetPlansQuery } from "../../services/apiSlice";
import { Link } from "react-router-dom";
import styles from "../../style/PlansList.module.css"; // Create this CSS module
import LottieLoader from "../../components/Lottie.loader";

const PlansList = () => {
  const { data: plans = [], isLoading, error } = useGetPlansQuery();

  if (isLoading) return <LottieLoader />;
  if (error) return <p>Error loading plans.</p>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Available Funding Plans</h2>
      {plans.length === 0 && (
        <p className={styles.noPlans}>No active plans at the moment.</p>
      )}
      <div className={styles.plansGrid}>
        {plans
          .filter((plan) => plan.isActive)
          .map((plan) => (
            <div key={plan._id} className={styles.planCard}>
              <h3 className={styles.planName}>{plan.name}</h3>
              <p className={styles.planDetail}>
                Recurring Amount: ${(plan.amount / 100).toFixed(2)} per{" "}
                {plan.interval}
              </p>
              <p className={styles.planDetail}>
                Goal: ${(plan.goalAmount / 100).toFixed(2)}
              </p>
              <Link
                to={`/user/subscribe/${plan._id}`}
                className={styles.subscribeLink}
              >
                Subscribe
              </Link>
            </div>
          ))}
      </div>
    </div>
  );
};

export default PlansList;

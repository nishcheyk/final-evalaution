import React from "react";
import {
  useGetDashboardStatsQuery,
  useGetPlansQuery,
  useGetUserSubscriptionsQuery,
} from "../../services/apiSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../store/store";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

import styles from "../../style/Dashboard.module.css";
import LottieLoader from "../../components/Lottie.loader";

const StatCard = ({
  title,
  value,
  colorClass,
  isCurrency = true,
}: {
  title: string;
  value: number;
  colorClass: string;
  isCurrency?: boolean;
}) => {
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    const duration = 2000;
    const increment = end / (duration / 30);
    const counter = setInterval(() => {
      start += increment;
      if (start >= end) {
        start = end;
        clearInterval(counter);
      }
      setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(counter);
  }, [value]);

  // Format value conditionally
  const formattedValue = isCurrency
    ? `$${count.toLocaleString()}`
    : count.toLocaleString();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`${styles.statCard} ${styles[colorClass]}`}
    >
      <div className={styles.statCardTitle}>{title}</div>
      <div>{formattedValue}</div>
    </motion.div>
  );
};

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

  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className={styles.faqSection}>
      <h2 className={styles.faqTitle}>Frequently Asked Questions</h2>
      {faqs.map(({ question, answer }, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className={styles.faqItem}
          onClick={() => toggle(idx)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => {
            if (e.key === "Enter" || e.key === " ") toggle(idx);
          }}
        >
          <strong className={styles.faqQuestion}>{question}</strong>
          {openIndex === idx && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className={styles.faqAnswer}
            >
              {answer}
            </motion.p>
          )}
        </motion.div>
      ))}
    </section>
  );
};

const DonationHistory: React.FC<{ userId: string }> = ({ userId }) => {
  const { data, isLoading, error } = useGetUserSubscriptionsQuery(userId);

  if (isLoading) {
    return <LottieLoader />;
  }

  if (error) return <p>Error loading donation history.</p>;
  if (!data || data.length === 0)
    return <p>You do not have any active donations.</p>;

  return (
    <section className={styles.donationHistorySection}>
      <h2 className={styles.donationHistoryTitle}>Your Donation History</h2>
      <table className={styles.donationTable}>
        <thead>
          <tr>
            <th>Plan</th>
            <th>Status</th>
            <th>Next Payment</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sub) => (
            <tr key={sub._id}>
              <td>{sub.plan?.name || "Unknown Plan"}</td>
              <td>{sub.status}</td>
              <td>{new Date(sub.nextPaymentDate).toLocaleDateString()}</td>
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

  if (isLoading) {
    return (
      <div className={styles.background}>
        <div className={styles.container}>
          {/* Skeleton stats */}
          <section className={styles.statsSection}>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`${styles.skeleton} ${styles.skeletonStatCard}`}
              ></div>
            ))}
          </section>

          {/* Skeleton chart title */}
          <div className={styles.chartSection}>
            <div
              className={`${styles.skeleton} ${styles.skeletonText}`}
              style={{ width: 180, height: 30, marginBottom: 20 }}
            ></div>
            <div
              className={`${styles.skeleton}`}
              style={{ width: "100%", height: 300, borderRadius: 12 }}
            ></div>
          </div>

          {/* Skeleton featured plans */}
          <section className={styles.featuredPlansSection}>
            <div
              className={`${styles.skeleton} ${styles.skeletonText}`}
              style={{ width: 210, height: 30, marginBottom: 20 }}
            ></div>
            <div>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`${styles.skeleton} ${styles.skeletonPlanCard}`}
                ></div>
              ))}
            </div>
          </section>

          {/* Skeleton donation history */}
          <section
            className={styles.donationHistorySection}
            aria-busy="true"
            aria-label="Loading donation history"
          >
            <div
              className={`${styles.skeleton} ${styles.skeletonText}`}
              style={{ width: 220, height: 30, marginBottom: 20 }}
            ></div>
            {[...Array(3)].map((_, i) => (
              <div key={i} className={styles.skeletonTableRow}></div>
            ))}
          </section>

          {/* Skeleton FAQ */}
          <section className={styles.faqSection}>
            <div
              className={`${styles.skeleton} ${styles.skeletonText}`}
              style={{ width: 250, height: 30, marginBottom: 20 }}
            ></div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className={`${styles.skeleton} ${styles.skeletonText}`}
                style={{ height: 60, marginBottom: 15 }}
              ></div>
            ))}
          </section>
        </div>
      </div>
    );
  }

  if (error) {
    return <p>Error loading dashboard analytics.</p>;
  }

  const featuredPlans = plans?.filter((p) => p.isActive).slice(0, 3) ?? [];

  // Prepare data for BarChart
  const chartData = featuredPlans.map((plan) => ({
    name: plan.name,
    Raised: plan.currentAmount / 100,
    Goal: plan.goalAmount / 100,
  }));

  return (
    <div className={styles.background}>
      <motion.div
        className={styles.container}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header and CTA */}
        <header className={styles.header}>
          <h1 className={styles.headerTitle}>
            Welcome to Our NGO Funding Platform
          </h1>
          <p className={styles.headerSubtitle}>
            Join hands with us to make a difference. Support a funding plan or
            start one yourself!
          </p>
          <button
            onClick={() => navigate("/user/plans")}
            className={styles.ctaButton}
          >
            Subscribe to Funding Now
          </button>
        </header>

        {/* Summary Cards */}
        <section className={styles.statsSection}>
          <StatCard
            title="Total Funds Raised"
            value={data?.totalFundsRaised ?? 0}
            colorClass="statCard"
            isCurrency={true} // money
          />
          <StatCard
            title="Active Funding Plans"
            value={data?.activeFundingPlans ?? 0}
            colorClass="green"
            isCurrency={false} // count
          />
          <StatCard
            title="Total Donors"
            value={data?.totalDonors ?? 0}
            colorClass="red"
            isCurrency={false} // count, no dollar sign
          />
        </section>

        {/* Animated Bar Chart */}
        <section className={styles.chartSection}>
          <h2 className={styles.chartTitle}>
            Funding Progress (Featured Plans)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 0, left: -20, bottom: 30 }}
            >
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
              <Legend />
              <Bar dataKey="Raised" fill="#0f62fe" animationDuration={1500} />
              <Bar dataKey="Goal" fill="#198038" animationDuration={1500} />
            </BarChart>
          </ResponsiveContainer>
        </section>

        {/* Featured Plans */}
        <section className={styles.featuredPlansSection}>
          <h2 className={styles.featuredPlansTitle}>Featured Funding Plans</h2>
          <div className={styles.plansList}>
            {featuredPlans.length > 0 ? (
              featuredPlans.map((plan) => (
                <motion.div
                  key={plan._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className={styles.planCard}
                >
                  <h3 className={styles.planTitle}>{plan.name}</h3>
                  <p className={styles.planDetail}>
                    Amount: ${(plan.amount / 100).toFixed(2)} every{" "}
                    {plan.interval.replace("_", " ")}
                  </p>
                  <p className={styles.planDetail}>
                    Goal: ${(plan.goalAmount / 100).toLocaleString()}
                  </p>
                  <button
                    onClick={() => navigate(`/user/subscribe/${plan._id}`)}
                    className={styles.subscribeButton}
                  >
                    Subscribe Now
                  </button>
                </motion.div>
              ))
            ) : (
              <p>No active plans available currently.</p>
            )}
          </div>
        </section>

        {/* Donation history (if logged in) */}
        {currentUser && <DonationHistory userId={currentUser._id} />}

        {/* FAQ section */}
        <FAQ />
      </motion.div>
    </div>
  );
};

export default Dashboard;

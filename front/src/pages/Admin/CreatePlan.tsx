import React, { useState, useEffect } from "react";
import { useCreatePlanMutation } from "../../services/apiSlice";
import styles from "../../style/CreatePlan.module.css";

const CreatePlan = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [interval, setInterval] = useState<"month" | "quarter" | "half_year">(
    "month"
  );
  const [goalAmount, setGoalAmount] = useState<number | "">("");

  const [createPlan, { isLoading, error }] = useCreatePlanMutation();

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) newErrors.name = "Plan name is required.";
    if (!amount || amount <= 0)
      newErrors.amount = "Recurring amount must be greater than 0.";
    if (!goalAmount || goalAmount <= 0)
      newErrors.goalAmount = "Goal amount must be greater than 0.";
    if (
      typeof amount === "number" &&
      typeof goalAmount === "number" &&
      amount > goalAmount
    ) {
      newErrors.amount = "Recurring amount should not exceed goal amount.";
    }

    setErrors(newErrors);
  }, [name, amount, goalAmount]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (Object.keys(errors).length > 0) return;

    try {
      await createPlan({
        name: name.trim(),
        amount: Math.round((amount as number) * 100), // convert dollars to cents
        interval,
        goalAmount: Math.round((goalAmount as number) * 100), // convert dollars to cents
      }).unwrap();

      alert("Plan created successfully!");
      setName("");
      setAmount("");
      setInterval("month");
      setGoalAmount("");
    } catch {
      alert("Failed to create plan. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Create Funding Plan</h2>

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <div className={styles.field}>
          <label htmlFor="planName" className={styles.label}>
            Plan Name
          </label>
          <input
            id="planName"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter plan name"
            className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
            aria-invalid={!!errors.name}
            aria-describedby="planNameError"
          />
          {errors.name && (
            <p id="planNameError" className={styles.error}>
              {errors.name}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="amount" className={styles.label}>
            Recurring Amount (in $)
          </label>
          <input
            id="amount"
            type="number"
            value={amount}
            min={1}
            onChange={(e) =>
              setAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="e.g. 1"
            className={`${styles.input} ${errors.amount ? styles.inputError : ""}`}
            aria-invalid={!!errors.amount}
            aria-describedby="amountError"
          />
          {errors.amount && (
            <p id="amountError" className={styles.error}>
              {errors.amount}
            </p>
          )}
        </div>

        <div className={styles.field}>
          <label htmlFor="interval" className={styles.label}>
            Billing Interval
          </label>
          <select
            id="interval"
            value={interval}
            onChange={(e) => setInterval(e.target.value as any)}
            className={styles.select}
          >
            <option value="month">Monthly ($ per month)</option>
            <option value="quarter">Quarterly ($ per quarter)</option>
            <option value="half_year">Half Yearly ($ per half year)</option>
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="goalAmount" className={styles.label}>
            Goal Amount (in $)
          </label>
          <input
            id="goalAmount"
            type="number"
            value={goalAmount}
            min={1}
            onChange={(e) =>
              setGoalAmount(e.target.value === "" ? "" : Number(e.target.value))
            }
            placeholder="e.g. 100"
            className={`${styles.input} ${errors.goalAmount ? styles.inputError : ""}`}
            aria-invalid={!!errors.goalAmount}
            aria-describedby="goalAmountError"
          />
          {errors.goalAmount && (
            <p id="goalAmountError" className={styles.error}>
              {errors.goalAmount}
            </p>
          )}
        </div>

        <button
          type="submit"
          className={styles.button}
          disabled={isLoading || Object.keys(errors).length > 0}
          aria-busy={isLoading}
        >
          {isLoading ? "Creating..." : "Create Plan"}
        </button>

        {error && (
          <p className={styles.error} role="alert">
            Failed to create plan. Please try again.
          </p>
        )}
      </form>
    </div>
  );
};

export default CreatePlan;

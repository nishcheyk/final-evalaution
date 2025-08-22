import React, { useState } from "react";
import { useCreatePlanMutation } from "../../services/apiSlice";

const CreatePlan = () => {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState(0); // Monthly/Quarterly/halfYear amount
  const [interval, setInterval] = useState<"month" | "quarter" | "half_year">(
    "month"
  );
  const [goalAmount, setGoalAmount] = useState(0); // Total funding goal

  const [createPlan, { isLoading, error }] = useCreatePlanMutation();

  const handleSubmit = async () => {
    try {
      await createPlan({
        name,
        amount,
        interval,
        goalAmount,
      }).unwrap();
      alert("Plan created");
      setName("");
      setAmount(0);
      setInterval("month");
      setGoalAmount(0);
    } catch {}
  };

  return (
    <div>
      <h2>Create Funding Plan</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Plan Name"
        required
      />
      <input
        type="number"
        value={amount}
        min={1}
        onChange={(e) => setAmount(Number(e.target.value))}
        placeholder="Recurring Amount (e.g. 1 for $1)"
        required
      />
      <select
        value={interval}
        onChange={(e) => setInterval(e.target.value as any)}
        required
      >
        <option value="month">$1 / month</option>
        <option value="quarter">$5 / quarter</option>
        <option value="half_year">$10 / half year</option>
      </select>
      <input
        type="number"
        value={goalAmount}
        min={1}
        onChange={(e) => setGoalAmount(Number(e.target.value))}
        placeholder="Goal Amount (e.g. 100 for $100)"
        required
      />
      <button onClick={handleSubmit} disabled={isLoading}>
        {isLoading ? "Creating..." : "Create"}
      </button>
      {error && <div style={{ color: "red" }}>Failed to create plan</div>}
    </div>
  );
};

export default CreatePlan;

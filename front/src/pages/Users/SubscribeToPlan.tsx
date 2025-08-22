import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetPlansQuery,
  useCreateSubscriptionMutation,
} from "../../services/apiSlice";
import type { RootState } from "../../store/store";

const SubscribeToPlan: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const { data: plans, isLoading, isError } = useGetPlansQuery(void 0);

  if (!planId) return <p>Invalid plan selected.</p>;
  if (isLoading) return <p>Loading plan details...</p>;
  if (isError) return <p>Error loading plans.</p>;

  const plan = plans?.find((p) => p._id === planId);

  if (!plan) return <p>Plan not found. Please check the URL.</p>;

  const currentUser = useSelector((state: RootState) => state.auth.user);

  const [createSubscription, { isLoading: isSubscribing }] =
    useCreateSubscriptionMutation();

  const [cardNumber, setCardNumber] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  const handleSubscribe = async () => {
    if (!cardNumber && !bankAccount) {
      alert("Please enter card or bank account information.");
      return;
    }

    if (!currentUser) {
      alert("Please login to subscribe.");
      navigate("/login");
      return;
    }

    try {
      await createSubscription({
        userId: currentUser._id,
        planId: plan._id,
        userName: currentUser.email,
        customerEmail: currentUser.email,
        paymentMethod: "card",
      }).unwrap();

      alert("Subscribed successfully!");
      navigate("/user/dashboard");
    } catch (error: any) {
      alert(error?.data?.message || "Subscription failed.");
    }
  };
  console.log("currentUser for subscription:", currentUser);

  return (
    <div style={{ maxWidth: 400, margin: "auto", padding: 20 }}>
      <h2>Subscribe to Plan: {plan.name}</h2>
      <p>
        Recurring Amount: ${(plan.amount / 100).toFixed(2)} per {plan.interval}
      </p>
      <p>Goal: ${(plan.goalAmount / 100).toFixed(2)}</p>

      <div style={{ marginBottom: 15 }}>
        <input
          type="text"
          placeholder="Card Number"
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          disabled={isSubscribing}
          style={{ width: "100%", padding: 8, marginBottom: 8 }}
        />
        <input
          type="text"
          placeholder="Bank Account (optional)"
          value={bankAccount}
          onChange={(e) => setBankAccount(e.target.value)}
          disabled={isSubscribing}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <button
        onClick={handleSubscribe}
        disabled={isSubscribing}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: "#0f62fe",
          color: "white",
          fontWeight: "bold",
          border: "none",
          borderRadius: 4,
          cursor: isSubscribing ? "not-allowed" : "pointer",
        }}
      >
        {isSubscribing ? "Subscribing..." : "Subscribe"}
      </button>
    </div>
  );
};

export default SubscribeToPlan;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  useGetPlansQuery,
  useCreateSubscriptionMutation,
} from "../../services/apiSlice";
import type { RootState } from "../../store/store";
import { motion } from "framer-motion";

import styles from "../../style/SubscribePage.module.css";

const SubscribePage: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => state.auth.user);

  const { data: plans, isLoading } = useGetPlansQuery();
  const plan = plans?.find((p) => p._id === planId);

  const [createSubscription, { isLoading: isSubscribing }] =
    useCreateSubscriptionMutation();

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("card");

  // Mock payment info state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [bankAccount, setBankAccount] = useState("");

  if (!planId || !plan) return <p>Plan not found.</p>;

  if (!currentUser) {
    navigate("/login");
    return <p>Please login to subscribe.</p>;
  }

  const handleSubscribe = async () => {
    // Basic validation for mock payment info
    if (paymentMethod === "card") {
      if (!(cardNumber && cardName && expiry && cvv)) {
        alert("Please fill all card details.");
        return;
      }
    } else {
      if (!bankAccount) {
        alert("Please enter bank account number.");
        return;
      }
    }

    try {
      await createSubscription({
        userId: currentUser._id,
        plan,
        userName: currentUser.email,
        customerEmail: currentUser.email,
        paymentMethod,
      }).unwrap();

      alert("Subscription successful!");
      navigate("/subscriptions");
    } catch {
      alert("Subscription failed.");
    }
  };

  return (
    <motion.section
      className={styles.container}
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={styles.title}>Subscribe to Plan: {plan.name}</h2>
      <p className={styles.amount}>
        Amount: ${(plan.amount / 100).toFixed(2)} / {plan.interval}
      </p>

      <div className={styles.selectWrapper}>
        <label className={styles.paymentMethodLabel} htmlFor="paymentMethod">
          Payment method:
        </label>
        <select
          id="paymentMethod"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className={styles.selectInput}
        >
          <option value="card">Card</option>
          <option value="bank">Bank Account</option>
        </select>
      </div>

      {paymentMethod === "card" ? (
        <div className={styles.cardForm}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="cardNumber">
              Card Number
            </label>
            <input
              id="cardNumber"
              type="text"
              placeholder="1234 5678 9012 3456"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className={styles.inputField}
              maxLength={19}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel} htmlFor="cardName">
              Cardholder Name
            </label>
            <input
              id="cardName"
              type="text"
              placeholder="John Doe"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className={styles.inputField}
              maxLength={30}
            />
          </div>

          <div
            className={styles.inputGroup}
            style={{ display: "flex", gap: 10 }}
          >
            <div style={{ flex: 1 }}>
              <label className={styles.inputLabel} htmlFor="expiry">
                Expiry Date
              </label>
              <input
                id="expiry"
                type="text"
                placeholder="MM/YY"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className={styles.inputField}
                maxLength={5}
              />
            </div>

            <div style={{ flex: 1 }}>
              <label className={styles.inputLabel} htmlFor="cvv">
                CVV
              </label>
              <input
                id="cvv"
                type="password"
                placeholder="123"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className={styles.inputField}
                maxLength={4}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className={styles.inputGroup}>
          <label className={styles.inputLabel} htmlFor="bankAccount">
            Bank Account Number
          </label>
          <input
            id="bankAccount"
            type="text"
            placeholder="12345678"
            value={bankAccount}
            onChange={(e) => setBankAccount(e.target.value)}
            className={styles.inputField}
            maxLength={20}
          />
        </div>
      )}

      <button
        onClick={handleSubscribe}
        disabled={isSubscribing}
        className={styles.subscribeButton}
      >
        {isSubscribing ? "Subscribing..." : "Subscribe"}
      </button>
    </motion.section>
  );
};

export default SubscribePage;

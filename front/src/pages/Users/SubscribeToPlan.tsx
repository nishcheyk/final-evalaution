// SubscribeToPlan.tsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  useGetPlansQuery,
  useCreateSubscriptionMutation,
} from "../../services/apiSlice";
import type { RootState } from "../../store/store";

import styles from "../../style/SubscribeToPlan.module.css";

const formatCardNumber = (num: string) => {
  return num
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
};

const SubscribeToPlan: React.FC = () => {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();

  const { data: plans, isLoading, isError } = useGetPlansQuery();
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [createSubscription, { isLoading: isSubscribing }] =
    useCreateSubscriptionMutation();

  const [paymentMethod, setPaymentMethod] = useState("card");

  // Card payment fields
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Bank payment field
  const [bankAccount, setBankAccount] = useState("");

  const [subscription, setSubscription] = useState<any | null>(null);

  if (!planId) return <p>Invalid plan selected.</p>;
  if (isLoading) return <p>Loading plan details...</p>;
  if (isError) return <p>Error loading plans.</p>;

  const plan = plans?.find((p) => p._id === planId);
  if (!plan) return <p>Plan not found. Please check the URL.</p>;

  if (!currentUser) {
    navigate("/login");
    return <p>Please login to subscribe.</p>;
  }

  const handleSubscribe = async () => {
    if (paymentMethod === "card") {
      if (!(cardNumber && cardName && expiry && cvv)) {
        alert("Please complete all card details.");
        return;
      }
    } else {
      if (!bankAccount) {
        alert("Please enter your bank account number.");
        return;
      }
    }
    try {
      const subscriptionResponse = await createSubscription({
        userId: currentUser._id,
        plan: {
          _id: plan._id,
          name: plan.name,
          amount: plan.amount,
          interval: plan.interval,
        },
        userName: currentUser.email,
        customerEmail: currentUser.email,
        paymentMethod,
      }).unwrap();
      setSubscription(subscriptionResponse);
      alert("Subscribed successfully!");
      navigate("/user/dashboard");
    } catch (error: any) {
      alert(error?.data?.message || "Subscription failed.");
    }
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h2 className={styles.title}>Subscribe to Plan: {plan.name}</h2>

      <div className={styles.planDetails}>
        Current Raised: ${(plan.currentAmount / 100).toFixed(2)} / Goal: $
        {(plan.goalAmount / 100).toFixed(2)}
      </div>

      {subscription ? (
        <motion.p
          className={styles.successMessage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          You have subscribed successfully. Subscription ID: {subscription._id}
        </motion.p>
      ) : (
        <div className={styles.contentWrapper}>
          {/* Left side: form */}
          <div className={styles.formWrapper}>
            <div className={styles.selectWrapper}>
              <label
                htmlFor="paymentMethod"
                className={styles.paymentMethodLabel}
              >
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
              <>
                <div className={styles.cardForm}>
                  <div className={styles.inputGroup}>
                    <label htmlFor="cardNumber" className={styles.inputLabel}>
                      Card Number
                    </label>
                    <input
                      id="cardNumber"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardNumber}
                      onChange={(e) =>
                        setCardNumber(formatCardNumber(e.target.value))
                      }
                      className={styles.inputField}
                      maxLength={19}
                    />
                  </div>

                  <div className={styles.inputGroup}>
                    <label htmlFor="cardName" className={styles.inputLabel}>
                      Name on Card
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

                  <div className={styles.formRow}>
                    <div className={styles.inputGroup}>
                      <label htmlFor="expiry" className={styles.inputLabel}>
                        Expiry Date (MM/YY)
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

                    <div className={styles.inputGroup}>
                      <label htmlFor="cvv" className={styles.inputLabel}>
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
              </>
            ) : (
              <div className={styles.inputGroup}>
                <label htmlFor="bankAccount" className={styles.inputLabel}>
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

            <motion.button
              onClick={handleSubscribe}
              disabled={isSubscribing}
              className={styles.button}
              whileHover={{ scale: isSubscribing ? 1 : 1.05 }}
              whileTap={{ scale: isSubscribing ? 1 : 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {isSubscribing ? "Subscribing..." : "Subscribe"}
            </motion.button>

            {/* Right side: Dummy card preview */}
            {paymentMethod === "card" && (
              <motion.div
                className={styles.cardPreview}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                {/* Chip icon */}
                <div className={styles.chipIcon}></div>

                {/* Wireless signal icon */}
                <div className={styles.signalIcon}></div>

                {/* Card Number */}
                <div className={styles.cardNumber}>
                  {cardNumber || "•••• •••• •••• ••••"}
                </div>
                {/* Cardholder and Expiry */}
                <div className={styles.cardDetailsRow}>
                  <div className={styles.cardDetailGroup}>
                    <div className={styles.cardLabel}>Cardholder</div>
                    <div className={styles.cardValue}>
                      {cardName.toUpperCase() || "FULL NAME"}
                    </div>
                  </div>

                  <div className={styles.cardDetailGroup}>
                    <div className={styles.cardLabel}>Expires</div>
                    <div className={styles.cardValue}>{expiry || "MM/YY"}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default SubscribeToPlan;

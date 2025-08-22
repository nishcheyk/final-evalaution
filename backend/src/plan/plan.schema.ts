import { Schema, model } from "mongoose";

const planSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true }, // amount in cents
  interval: {
    type: String,
    enum: ["month", "quarter", "half_year"],
    required: true,
  },
  goalAmount: { type: Number, required: true }, // funding goal in cents
  currentAmount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
});

export const Plan = model("Plan", planSchema);

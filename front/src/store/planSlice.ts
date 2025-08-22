import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Plan {
  id: string;
  name: string;
  amount: number;
  interval: "month" | "quarter" | "halfYear";
  limitReached: boolean;
}

interface PlanState {
  plans: Plan[];
}

const initialState: PlanState = {
  plans: [],
};

const planSlice = createSlice({
  name: "plans",
  initialState,
  reducers: {
    setPlans(state, action: PayloadAction<Plan[]>) {
      state.plans = action.payload;
    },
    updatePlanStatus(
      state,
      action: PayloadAction<{ id: string; limitReached: boolean }>
    ) {
      const plan = state.plans.find((p) => p.id === action.payload.id);
      if (plan) {
        plan.limitReached = action.payload.limitReached;
      }
    },
  },
});

export const { setPlans, updatePlanStatus } = planSlice.actions;
export default planSlice.reducer;

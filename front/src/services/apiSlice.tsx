// src/services/apiSlice.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface User {
  _id: string;
  email: string;
  role: "admin" | "user";
  userName?: string;
  customerEmail?: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

interface Plan {
  _id: string;
  name: string;
  amount: number;
  interval: "month" | "quarter" | "half_year";
  goalAmount: number;
  currentAmount: number;
  isActive: boolean;
}

interface PlanDetails {
  _id: string;
  name: string;
  amount: number;
  interval: "month" | "quarter" | "half_year";
}

interface Subscription {
  _id: string;
  userId: string;
  plan: PlanDetails;
  status: string;
  nextPaymentDate: string;
}

interface CreateSubscriptionRequest {
  userId: string;
  plan: PlanDetails;
  userName: string;
  customerEmail: string;
  paymentMethod: string;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  tagTypes: ["Plan", "Subscription", "User", "Analytics"],
  endpoints: (builder) => ({
    // User Auth
    registerUser: builder.mutation<
      AuthResponse,
      { email: string; password: string }
    >({
      query: (user) => ({
        url: "/users/register",
        method: "POST",
        body: user,
      }),
    }),
    loginUser: builder.mutation<
      AuthResponse,
      { email: string; password: string }
    >({
      query: (credentials) => ({
        url: "/users/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Plans
    getPlans: builder.query<Plan[], void>({
      query: () => "/plans",
      providesTags: ["Plan"],
    }),
    // This endpoint fetches all plans including inactive to display in admin
    getAllPlans: builder.query<Plan[], void>({
      query: () => "/plans/all",
      providesTags: ["Plan"],
    }),
    createPlan: builder.mutation<Plan, Partial<Plan>>({
      query: (plan) => ({
        url: "/plans",
        method: "POST",
        body: plan,
      }),
      invalidatesTags: ["Plan"],
    }),

    updatePlanStatus: builder.mutation<Plan, { id: string; isActive: boolean }>(
      {
        query: ({ id, isActive }) => ({
          url: `/plans/${id}`,
          method: "PATCH",
          body: { isActive },
        }),
        invalidatesTags: ["Plan"],
      }
    ),

    // Subscriptions
    createSubscription: builder.mutation<
      Subscription,
      CreateSubscriptionRequest
    >({
      query: (subscription) => ({
        url: "/subscriptions",
        method: "POST",
        body: subscription,
      }),
      invalidatesTags: ["Subscription", "Plan"],
    }),
    getUserSubscriptions: builder.query<Subscription[], string>({
      query: (userId: string) => `/subscriptions/${userId}`,
      providesTags: ["Subscription"],
    }),
    cancelSubscription: builder.mutation<Subscription, string>({
      query: (subscriptionId: string) => ({
        url: `/subscriptions/cancel/${subscriptionId}`,
        method: "PATCH",
      }),
      invalidatesTags: ["Subscription", "Plan"],
    }),

    // Analytics
    getDashboardStats: builder.query({
      query: () => "/analytics/dashboard-stats",
      providesTags: ["Analytics"],
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useGetPlansQuery,
  useCreatePlanMutation,
  useUpdatePlanStatusMutation, // Added export hook for updatePlanStatus mutation
  useCreateSubscriptionMutation,
  useGetUserSubscriptionsQuery,
  useCancelSubscriptionMutation,
  useGetDashboardStatsQuery,
  useGetAllPlansQuery,
} = apiSlice;

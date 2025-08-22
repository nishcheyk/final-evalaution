import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

interface User {
  _id: string;
  email: string;
  role: "admin" | "user";
  token: string;
}

interface Plan {
  _id: string;
  name: string;
  amount: number; // stored in cents
  interval: "month" | "quarter" | "half_year";
  goalAmount: number; // in cents
  currentAmount: number; // in cents
  isActive: boolean;
}

interface Subscription {
  _id: string;
  userId: string;
  planId: string;
  status: string;
  nextPaymentDate: string;
  // add other fields as needed for subscription entity
}

interface CreateSubscriptionRequest {
  userId: string;
  planId: string;
  userName: string;
  customerEmail: string;
  paymentMethod: string; // e.g., "card", "bank" or token string
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  tagTypes: ["Plan", "Subscription", "User", "Analytics"],
  endpoints: (builder) => ({
    // User Auth
    registerUser: builder.mutation<User, { email: string; password: string }>({
      query: (user) => ({
        url: "/users/register",
        method: "POST",
        body: user,
      }),
    }),
    loginUser: builder.mutation<User, { email: string; password: string }>({
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
    createPlan: builder.mutation<Plan, Partial<Plan>>({
      query: (plan) => ({
        url: "/plans",
        method: "POST",
        body: plan,
      }),
      invalidatesTags: ["Plan"],
    }),

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
  useCreateSubscriptionMutation,
  useGetUserSubscriptionsQuery,
  useCancelSubscriptionMutation,
  useGetDashboardStatsQuery,
} = apiSlice;

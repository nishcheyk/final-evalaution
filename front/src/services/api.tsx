import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:5000/api" }),
  tagTypes: ["Plans", "Donations", "Users"],
  endpoints: (builder) => ({
    getPlans: builder.query({
      query: () => "/plans",
      providesTags: ["Plans"],
    }),
    createPlan: builder.mutation({
      query: (plan) => ({
        url: "/plans",
        method: "POST",
        body: plan,
      }),
      invalidatesTags: ["Plans"],
    }),
    donate: builder.mutation({
      query: (donation) => ({
        url: "/donations",
        method: "POST",
        body: donation,
      }),
      invalidatesTags: ["Donations", "Plans"],
    }),
    getLeaderboard: builder.query({
      query: () => "/leaderboard",
      providesTags: ["Users"],
    }),
    // Add more endpoints as needed
  }),
});

export const {
  useGetPlansQuery,
  useCreatePlanMutation,
  useDonateMutation,
  useGetLeaderboardQuery,
} = apiSlice;

import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLayout from "./layout/AdminLayout";
import CreatePlan from "./pages/Admin/CreatePlan";
import ManagePlans from "./pages/Admin/ManagePlan";

import UserLayout from "./layout/UserLayout";
import Dashboard from "./pages/Users/Dashboard";

import LeaderboardView from "./pages/Users/Leaderboard";

import PlansList from "./pages/Users/PlanList";
import SubscribeToPlan from "./pages/Users/SubscribeToPlan";

const App = () => (
  <BrowserRouter>
    <Routes>
      {/* Public home page */}
      <Route path="/" element={<Dashboard />} />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin area */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="create-plan" replace />} />
        <Route path="create-plan" element={<CreatePlan />} />
        <Route path="manage-plans" element={<ManagePlans />} />
      </Route>

      {/* User area */}
      <Route path="/user" element={<UserLayout />}>
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="leaderboard" element={<LeaderboardView />} />
        <Route path="plans" element={<PlansList />} />
        <Route path="subscribe/:planId" element={<SubscribeToPlan />} />
      </Route>

      {/* Redirect all unknown routes to home */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  </BrowserRouter>
);

export default App;

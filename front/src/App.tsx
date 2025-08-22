import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "./store/store";
import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminLayout from "./layout/AdminLayout";
import CreatePlan from "./pages/Admin/CreatePlan";
import ManagePlans from "./pages/Admin/ManagePlan";

import UserLayout from "./layout/UserLayout";
import Dashboard from "./pages/Users/Dashboard";

import PlansList from "./pages/Users/PlanList";
import SubscribeToPlan from "./pages/Users/SubscribeToPlan";

import SubscriptionListPage from "./pages/Users/SubscriptionListPage";
import SubscribePage from "./pages/Users/SubscribePage";

import { RequireAuth, RequireAdmin } from "./layout/AuthGuards";
import GuestLayout from "./layout/GuestLayout";

const App = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public guest layout */}
        <Route element={<GuestLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin routes: protected */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminLayout />
            </RequireAdmin>
          }
        >
          <Route index element={<Navigate to="create-plan" replace />} />
          <Route path="create-plan" element={<CreatePlan />} />
          <Route path="manage-plans" element={<ManagePlans />} />
        </Route>

        {/* User routes: protected */}
        <Route
          path="/user"
          element={
            <RequireAuth>
              <UserLayout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="plans" element={<PlansList />} />

          {/* Subscription pages */}
          <Route path="subscribe/:planId" element={<SubscribeToPlan />} />
          <Route path="subscribe-plan/:planId" element={<SubscribePage />} />

          {/* Pass currentUser._id as userId prop */}
          <Route
            path="subscriptions"
            element={
              currentUser ? (
                <SubscriptionListPage userId={currentUser._id} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
        </Route>

        {/* Catch all unknowns */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;

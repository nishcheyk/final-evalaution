import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "./store/store";
import { setCredentials } from "./store/authSlice";

import { RequireAuth, RequireAdmin } from "./layout/AuthGuards";
import GuestLayout from "./layout/GuestLayout";
import AdminLayout from "./layout/AdminLayout";
import UserLayout from "./layout/UserLayout";
import LottieLoader from "./components/Lottie.loader";

// Lazy-loaded pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const CreatePlan = lazy(() => import("./pages/Admin/CreatePlan"));
const ManagePlans = lazy(() => import("./pages/Admin/ManagePlan"));
const Dashboard = lazy(() => import("./pages/Users/Dashboard"));
const PlansList = lazy(() => import("./pages/Users/PlanList"));
const SubscribeToPlan = lazy(() => import("./pages/Users/SubscribeToPlan"));
const SubscriptionListPage = lazy(
  () => import("./pages/Users/SubscriptionListPage")
);
const SubscribePage = lazy(() => import("./pages/Users/SubscribePage"));

const App = () => {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        dispatch(setCredentials(parsedUser));
        if (parsedUser.role === "admin") navigate("/admin/create-plan");
        else navigate("/user/dashboard");
      }
    }
  }, [dispatch, currentUser, navigate]);

  return (
    <Suspense fallback={<LottieLoader />}>
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
    </Suspense>
  );
};

export default App;

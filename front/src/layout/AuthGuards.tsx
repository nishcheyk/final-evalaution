// src/components/AuthGuards.tsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

export const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  if (!user) {
    // Redirect guests to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export const RequireAdmin = ({ children }: { children: JSX.Element }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  const location = useLocation();

  if (!user) {
    // Redirect guests to login page
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user.role !== "admin") {
    // Redirect non-admin users to user dashboard
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
};

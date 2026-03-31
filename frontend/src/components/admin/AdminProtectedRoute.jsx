import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  const location = useLocation();

  const adminToken = sessionStorage.getItem("adminToken");
  const superAdminToken = sessionStorage.getItem("superadminToken");

  // Allow access if ANY admin token exists
  if (!adminToken && !superAdminToken) {
    return <Navigate to="/admin/login" replace />;
  }

  // 🔒 Prevent admin accessing super-admin routes
  if (
    location.pathname.startsWith("/super-admin") &&
    !superAdminToken
  ) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default AdminProtectedRoute;

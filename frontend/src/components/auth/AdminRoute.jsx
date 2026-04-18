import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function AdminRoute({ children }) {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();

  if (!user || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = user?.role || "";
  const isAdmin = Array.isArray(userRole) 
    ? userRole.includes("admin") 
    : userRole === "admin";

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

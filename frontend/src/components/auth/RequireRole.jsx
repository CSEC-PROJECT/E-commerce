import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function RequireRole({ roles, children }) {
  const { user } = useAuthStore();
  const location = useLocation();

  const userRoles = user?.role || [];
  const hasRole = Array.isArray(userRoles)
    ? roles.some((r) => userRoles.includes(r))
    : roles.includes(userRoles);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!hasRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}


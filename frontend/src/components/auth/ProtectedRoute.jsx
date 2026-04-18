import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function ProtectedRoute({ children }) {
  const { user, accessToken } = useAuthStore();
  const location = useLocation();

  if (!user || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

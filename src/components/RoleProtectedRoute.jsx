import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { isTokenExpired } from "../utils/authUtils";

const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const token = localStorage.getItem("access_token");
  const user_type = localStorage.getItem("user_type");
  const location = useLocation();

  if (!token || isTokenExpired()) {
    // Clear local storage on session expiry before navigating
    localStorage.clear();
    toast.error("Session expired! Please login again.", { autoClose: 3000 });
    // Pass the current location to redirect back after login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!user_type || !allowedRoles.includes(user_type)) {
    toast.error("Access denied!", { autoClose: 3000 });
    // Redirect to a more appropriate page, like home or a specific dashboard
    // Or, if you want to log them out, do that explicitly.
    // For now, let's redirect to a safe default page.
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default RoleProtectedRoute;

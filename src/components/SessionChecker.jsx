// components/SessionChecker.jsx
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isTokenExpired, logoutUser } from "../utils/authUtils";

const SessionChecker = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const noAuthRoutes = [
    "/login",
    "/signup",
    "/",
    "/index",
    "/about",
    "/contact",
    "/forgot-password",
    "/reset-password", // ✅ main reset path
  ]; // public routes

  useEffect(() => {
    // ✅ Allow dynamic reset-password routes like /reset-password/:id/:token
    const isResetPasswordRoute = location.pathname.startsWith("/reset-password");

    if (!noAuthRoutes.includes(location.pathname) && !isResetPasswordRoute) {
      if (isTokenExpired()) {
        toast.error("Session expired! Please login again.", { autoClose: 3000 });
        logoutUser(navigate);
      }
    }
  }, [location.pathname, navigate]);

  return <>{children}</>;
};

export default SessionChecker;

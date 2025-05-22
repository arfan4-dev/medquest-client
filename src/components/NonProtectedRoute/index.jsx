import React from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

const NonProtectedRoute = ({ children }) => {
  const isUserLoggedIn = localStorage.getItem("isLoggedIn");
  const isLoggedIn = useSelector((state) => state?.user?.isLoggedIn);
  const location = useLocation();

  if (isUserLoggedIn || isLoggedIn) {
    
    return <Navigate to={location.state?.from || "/home"} replace />;
  }

  return children;
};

export default NonProtectedRoute;


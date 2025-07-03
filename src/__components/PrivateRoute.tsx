import React from "react"; // ✅ Add this
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type { RootState } from "@/store";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  return isLoggedIn ? <>{children}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;

import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { RouteLoader } from "@/components/auth/RouteLoader";

type AdminRouteProps = {
  children: ReactElement;
};

export const AdminRoute = ({ children }: AdminRouteProps) => {
  const { loading, isAuthenticated, isAdmin } = useAuth();

  // Check for admin password session in localStorage
  const adminSession = localStorage.getItem("adminSession");
  const isAdminPasswordAuthenticated = adminSession
    ? JSON.parse(adminSession).authenticated === true
    : false;

  if (loading) {
    return <RouteLoader />;
  }

  // Allow access if either admin password is correct OR Firebase admin auth is valid
  if (!isAdminPasswordAuthenticated && (!isAuthenticated || !isAdmin)) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";

export function AdminRoute() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  if (!isAdmin) return <Navigate to="/contacts" replace />;
  return <Outlet />;
}

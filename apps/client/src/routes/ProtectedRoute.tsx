import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext";
import { Spinner } from "../components/ui/Spinner";

export function ProtectedRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) return <Spinner />;
  if (!user) return <Navigate to="/signin" replace />;

  return <Outlet />;
}

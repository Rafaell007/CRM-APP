import { Navigate } from "react-router";
import { useAuth } from "../context/authContext";
import type { ReactNode } from "react";
import type { UserRole } from "../types/models";

interface ProtectedRouteProps {
  role?: UserRole;
  children: ReactNode;
}

const ProtectedRoute = ({ role, children }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;

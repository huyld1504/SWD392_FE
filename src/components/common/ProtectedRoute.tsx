import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isLoggedIn, user } = useAuthStore();

  if (!isLoggedIn || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

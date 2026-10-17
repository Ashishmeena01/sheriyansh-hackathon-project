import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { authService } from '../services/authService';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRole?: 'teacher' | 'student';
}

/**
 * ProtectedRoute component.
 * Allows transparent passthrough for hackathon demo.
 * Teammate can plug in JWT/Auth token verification here.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRole }) => {
  const location = useLocation();
  const user = authService.getCurrentUser();
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;


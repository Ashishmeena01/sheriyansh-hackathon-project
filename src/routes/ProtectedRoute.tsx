import React from 'react';
import { Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  children?: React.ReactNode;
  allowedRole?: 'teacher' | 'student';
}

/**
 * ProtectedRoute component.
 * Allows transparent passthrough for hackathon demo.
 * Teammate can plug in JWT/Auth token verification here.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;

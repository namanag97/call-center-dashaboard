import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store';

interface ProtectedRouteProps {
  children?: React.ReactNode;
}

/**
 * Component that protects routes by checking authentication status
 * Redirects to login page if user is not authenticated
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, checkSession, isLoading } = useAuthStore();
  const location = useLocation();

  // Check authentication status on mount
  useEffect(() => {
    if (!isAuthenticated) {
      checkSession();
    }
  }, [checkSession, isAuthenticated]);

  // Show loading state while checking session
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Render children or outlet
  return <>{children || <Outlet />}</>;
};

export default ProtectedRoute; 
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import LoginForm from '../components/auth/LoginForm';

/**
 * Login page component
 */
const LoginPage: React.FC = () => {
  const { login, isAuthenticated, error, isLoading, clearError } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to dashboard
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';
  
  // Redirect to previous page or dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);
  
  // Clear any previous errors when component mounts
  useEffect(() => {
    clearError();
  }, [clearError]);
  
  // Handle login form submission
  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    await login({ email, password, rememberMe });
  };
  
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>
        
        <LoginForm 
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />
      </div>
    </div>
  );
};

export default LoginPage; 
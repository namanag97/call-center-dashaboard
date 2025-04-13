import React, { Suspense, lazy, useEffect } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { useAuthStore } from './store';
import { Spinner } from './components/ui';
import ErrorBoundary from './components/error/ErrorBoundary';

// Lazy-loaded components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CallListPage = lazy(() => import('./pages/CallListPage'));
const CallDetailPage = lazy(() => import('./pages/CallDetailPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));

// Layout components
const AppLayoutWithRouter = lazy(() => import('./components/layout/AppLayoutWithRouter'));

/**
 * Error Boundary wrapper for route errors
 */
const RouteErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner size="xl" /></div>}>
      <ErrorBoundary 
        fallback={
          <div className="flex h-screen flex-col items-center justify-center p-4 text-center">
            <h2 className="mb-2 text-xl font-bold text-red-600">Something went wrong!</h2>
            <p className="mb-4 text-gray-600">The page failed to load properly.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
            >
              Return to Dashboard
            </button>
          </div>
        }
      >
        {children}
      </ErrorBoundary>
    </Suspense>
  );
};

/**
 * Protected route wrapper component
 */
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuthStore();

  // Show loading state if auth check is in progress
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Spinner size="xl" />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return <RouteErrorBoundary>{children}</RouteErrorBoundary>;
};

/**
 * Router configuration
 */
const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner size="xl" /></div>}>
        <LoginPage />
      </Suspense>
    ),
    errorElement: <Navigate to="/login" replace />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<div className="flex h-screen items-center justify-center"><Spinner size="xl" /></div>}>
          <AppLayoutWithRouter />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <Navigate to="/" replace />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size="xl" /></div>}>
            <DashboardPage />
          </Suspense>
        ),
      },
      {
        path: 'calls',
        element: (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size="xl" /></div>}>
            <CallListPage />
          </Suspense>
        ),
      },
      {
        path: 'calls/:id',
        element: (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size="xl" /></div>}>
            <CallDetailPage />
          </Suspense>
        ),
      },
      {
        path: 'upload',
        element: (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size="xl" /></div>}>
            <UploadPage />
          </Suspense>
        ),
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<div className="flex h-full items-center justify-center"><Spinner size="xl" /></div>}>
            <SettingsPage />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);

/**
 * Main App component
 */
const App: React.FC = () => {
  const { checkSession } = useAuthStore();
  
  // Check authentication status when the app loads
  useEffect(() => {
    checkSession();
  }, [checkSession]);

  return <RouterProvider router={router} />;
};

export default App;

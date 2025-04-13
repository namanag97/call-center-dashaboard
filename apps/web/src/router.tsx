import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Lazy-loaded page components
const LoginPage = lazy(() => import('./pages/LoginPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const CallListPage = lazy(() => import('./pages/CallListPage'));
const CallDetailPage = lazy(() => import('./pages/CallDetailPage'));
const UploadPage = lazy(() => import('./pages/UploadPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));

// Loading spinner component for Suspense fallback
const LoadingSpinner = () => (
  <div className="flex h-screen w-full items-center justify-center">
    <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
  </div>
);

// App layout component (for shared layout across protected routes)
const AppLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header, navigation, etc. would go here */}
      <Suspense fallback={<LoadingSpinner />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

// Create the router configuration
const router = createBrowserRouter([
  // Public routes
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage />
      </Suspense>
    ),
  },
  
  // Protected routes
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'calls',
        element: <CallListPage />,
      },
      {
        path: 'calls/:id',
        element: <CallDetailPage />,
      },
      {
        path: 'upload',
        element: <UploadPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

// Router component to use in the app
const Router: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default Router; 
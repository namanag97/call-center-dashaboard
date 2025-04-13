import React, { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  /**
   * A fallback UI to render when an error occurs
   */
  fallback?: ReactNode;
  /**
   * Children components to render
   */
  children: ReactNode;
}

interface ErrorBoundaryState {
  /**
   * Whether an error has been caught
   */
  hasError: boolean;
  /**
   * The error object that was caught
   */
  error: Error | null;
}

/**
 * ErrorBoundary component to catch JavaScript errors in child component trees
 * and display a fallback UI instead of crashing the whole app
 */
class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // You can log the error to an error reporting service here
    console.error('Error caught by ErrorBoundary:', error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Render fallback UI if provided, otherwise render a default error message
      if (this.props.fallback) {
        return this.props.fallback;
      }
      
      return (
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
      );
    }

    // When there's no error, render children normally
    return this.props.children;
  }
}

export default ErrorBoundary; 
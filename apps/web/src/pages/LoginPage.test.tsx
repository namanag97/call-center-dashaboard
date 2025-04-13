import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import LoginPage from './LoginPage';
import { useAuthStore } from '../store';

// Mock the auth store
vi.mock('../store', () => ({
  useAuthStore: vi.fn()
}));

describe('LoginPage', () => {
  // Set up basic mocks for all tests
  const mockLogin = vi.fn();
  const mockClearError = vi.fn();
  
  beforeEach(() => {
    // Default mock implementation
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      isLoading: false,
      isAuthenticated: false,
      clearError: mockClearError
    });
  });
  
  afterEach(() => {
    vi.clearAllMocks();
  });
  
  it('renders the login form', () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });
  
  it('calls login with credentials when form is submitted', async () => {
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Fill in the form
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    // Verify login was called with correct credentials
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
        rememberMe: expect.any(Boolean)
      });
    });
  });
  
  it('displays error message when login fails', () => {
    const errorMessage = 'Invalid credentials';
    
    // Mock store with error
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: errorMessage,
      isLoading: false,
      isAuthenticated: false,
      clearError: mockClearError
    });
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });
  
  it('shows loading state when login is in progress', () => {
    // Mock store with loading state
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: null,
      isLoading: true,
      isAuthenticated: false,
      clearError: mockClearError
    });
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    const button = screen.getByRole('button', { name: /sign in/i });
    expect(button).toBeDisabled();
    // Expected to find a loading indicator or spinner
    expect(button.querySelector('.loading-spinner, .spinner')).toBeTruthy();
  });
  
  it('clears error when form is modified', () => {
    // Mock store with error
    (useAuthStore as jest.Mock).mockReturnValue({
      login: mockLogin,
      error: 'Previous error',
      isLoading: false,
      isAuthenticated: false,
      clearError: mockClearError
    });
    
    render(
      <BrowserRouter>
        <LoginPage />
      </BrowserRouter>
    );
    
    // Change an input
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'new@example.com' }
    });
    
    // Verify error was cleared
    expect(mockClearError).toHaveBeenCalled();
  });
}); 
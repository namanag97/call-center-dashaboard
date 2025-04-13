import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { devtools } from 'zustand/middleware';
import { User, LoginCredentials, AuthResponse, AuthError } from '@conista/shared-types';

// API endpoint
const API_URL = '/api/auth';

// Define auth store state
interface AuthState {
  // State 
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  checkSession: () => Promise<void>;
  clearError: () => void;
}

// Create the auth store with persistence
export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set, get) => ({
        // Initial state
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
        
        // Actions
        login: async (credentials: LoginCredentials) => {
          set({ isLoading: true, error: null });
          
          try {
            const response = await fetch(`${API_URL}/login`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(credentials),
            });
            
            if (!response.ok) {
              const errorData = await response.json();
              throw new Error(errorData?.error?.message || 'Login failed');
            }
            
            const data: AuthResponse = await response.json();
            
            // Store token in localStorage (handled by the persist middleware)
            // The token will be added to all API requests in a real app
            
            set({
              isAuthenticated: true,
              user: data.user,
              isLoading: false,
            });
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Login failed';
            set({ error: errorMessage, isLoading: false });
          }
        },
        
        logout: () => {
          // In a real app, you might want to call an API to invalidate the token
          set({
            isAuthenticated: false,
            user: null,
            error: null,
          });
        },
        
        checkSession: async () => {
          // Skip if already authenticated
          if (get().isAuthenticated && get().user) {
            return;
          }
          
          set({ isLoading: true, error: null });
          
          try {
            const response = await fetch(`${API_URL}/session`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                // Include auth token in headers (not shown here)
              },
            });
            
            if (!response.ok) {
              // Session is invalid, clear auth state
              set({ 
                isAuthenticated: false,
                user: null,
                isLoading: false
              });
              return;
            }
            
            const data: AuthResponse = await response.json();
            
            set({
              isAuthenticated: true,
              user: data.user,
              isLoading: false,
            });
          } catch (error) {
            set({ 
              isAuthenticated: false,
              user: null,
              isLoading: false
            });
          }
        },
        
        clearError: () => set({ error: null }),
      }),
      {
        name: 'auth-storage', // Storage key
        storage: createJSONStorage(() => localStorage),
        // Only persist certain fields
        partialize: (state) => ({
          isAuthenticated: state.isAuthenticated,
          user: state.user,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);

export default useAuthStore; 
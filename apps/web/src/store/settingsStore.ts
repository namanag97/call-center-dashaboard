import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Provider, Category, SystemSettings } from '@conista/shared-types';

// API endpoints
const API_URL = '/api/settings';
const PROVIDERS_URL = `${API_URL}/providers`;
const CATEGORIES_URL = `${API_URL}/categories`;
const SYSTEM_SETTINGS_URL = `${API_URL}/system`;

// Define settings store state
interface SettingsState {
  // State
  providers: Provider[];
  categories: Category[];
  systemSettings: SystemSettings | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchProviders: () => Promise<void>;
  addProvider: (data: Omit<Provider, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => Promise<void>;
  updateProvider: (id: string, data: Partial<Provider>) => Promise<void>;
  deleteProvider: (id: string) => Promise<void>;
  
  fetchCategories: () => Promise<void>;
  updateCategories: (categories: Category[]) => Promise<void>;
  
  fetchSystemSettings: () => Promise<void>;
  updateSystemSettings: (data: Partial<SystemSettings>) => Promise<void>;
  
  clearError: () => void;
}

// Create the settings store
export const useSettingsStore = create<SettingsState>()(
  devtools(
    (set, get) => ({
      // Initial state
      providers: [],
      categories: [],
      systemSettings: null,
      isLoading: false,
      error: null,

      // Provider actions
      fetchProviders: async () => {
        set(state => ({ ...state, isLoading: true, error: null }));

        try {
          const response = await fetch(PROVIDERS_URL);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to fetch providers');
          }

          const data = await response.json();

          set(state => ({
            ...state,
            providers: data.data,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch providers';
          set(state => ({ ...state, error: errorMessage, isLoading: false }));
        }
      },

      addProvider: async (data) => {
        set(state => ({ ...state, isLoading: true, error: null }));

        try {
          const response = await fetch(PROVIDERS_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to add provider');
          }

          const responseData = await response.json();
          const newProvider = responseData.data;

          set(state => ({
            ...state,
            providers: [...state.providers, newProvider],
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to add provider';
          set(state => ({ ...state, error: errorMessage, isLoading: false }));
        }
      },

      updateProvider: async (id, data) => {
        set(state => ({ ...state, isLoading: true, error: null }));

        try {
          const response = await fetch(`${PROVIDERS_URL}/${id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to update provider');
          }

          const responseData = await response.json();
          const updatedProvider = responseData.data;

          set(state => ({
            ...state,
            providers: state.providers.map(provider => 
              provider.id === id ? updatedProvider : provider
            ),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update provider';
          set(state => ({ ...state, error: errorMessage, isLoading: false }));
        }
      },

      deleteProvider: async (id) => {
        set(state => ({ ...state, isLoading: true, error: null }));

        try {
          const response = await fetch(`${PROVIDERS_URL}/${id}`, {
            method: 'DELETE',
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to delete provider');
          }

          set(state => ({
            ...state,
            providers: state.providers.filter(provider => provider.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to delete provider';
          set(state => ({ ...state, error: errorMessage, isLoading: false }));
        }
      },

      // Category actions
      fetchCategories: async () => {
        set(state => ({ ...state, isLoading: true, error: null }));

        try {
          const response = await fetch(CATEGORIES_URL);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to fetch categories');
          }

          const data = await response.json();

          set(state => ({
            ...state,
            categories: data.data,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch categories';
          set(state => ({ ...state, error: errorMessage, isLoading: false }));
        }
      },

      updateCategories: async (categories) => {
        set(state => ({ ...state, isLoading: true, error: null }));

        try {
          const response = await fetch(CATEGORIES_URL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categories }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to update categories');
          }

          const data = await response.json();

          set(state => ({
            ...state,
            categories: data.data,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update categories';
          set(state => ({ ...state, error: errorMessage, isLoading: false }));
        }
      },

      // System settings actions
      fetchSystemSettings: async () => {
        set(state => ({ ...state, isLoading: true, error: null }));

        try {
          const response = await fetch(SYSTEM_SETTINGS_URL);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to fetch system settings');
          }

          const data = await response.json();

          set(state => ({
            ...state,
            systemSettings: data.data,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch system settings';
          set(state => ({ ...state, error: errorMessage, isLoading: false }));
        }
      },

      updateSystemSettings: async (data) => {
        set(state => ({ ...state, isLoading: true, error: null }));

        try {
          const response = await fetch(SYSTEM_SETTINGS_URL, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to update system settings');
          }

          const responseData = await response.json();

          set(state => ({
            ...state,
            systemSettings: responseData.data,
            isLoading: false,
          }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to update system settings';
          set(state => ({ ...state, error: errorMessage, isLoading: false }));
        }
      },

      // Utility actions
      clearError: () => set(state => ({ ...state, error: null })),
    }),
    {
      name: 'settings-store',
    }
  )
);

export default useSettingsStore; 
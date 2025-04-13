import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  CallRecord, 
  PaginationState, 
  SortOptions, 
  FilterOptions, 
  CallListParams 
} from '@conista/shared-types';

// API endpoint
const API_URL = '/api/calls';

// Define pagination defaults
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_SORT: SortOptions = { field: 'date', direction: 'desc' };

// Define call list store state
interface CallListState {
  // State
  calls: CallRecord[];
  isLoading: boolean;
  error: string | null;
  pagination: PaginationState;
  filters: FilterOptions;
  sort: SortOptions;

  // Actions
  fetchCalls: () => Promise<void>;
  setFilters: (filters: FilterOptions) => void;
  setSort: (sort: SortOptions) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
}

// Create the call list store
export const useCallListStore = create<CallListState>()(
  devtools(
    (set, get) => ({
      // Initial state
      calls: [],
      isLoading: false,
      error: null,
      pagination: {
        page: 1,
        pageSize: DEFAULT_PAGE_SIZE,
        totalItems: 0,
        totalPages: 0,
      },
      filters: {},
      sort: DEFAULT_SORT,

      // Actions
      fetchCalls: async () => {
        set({ isLoading: true, error: null });

        try {
          const { pagination, filters, sort } = get();
          
          // Build API query parameters
          const params = new URLSearchParams();
          params.append('page', pagination.page.toString());
          params.append('pageSize', pagination.pageSize.toString());
          params.append('sortField', sort.field);
          params.append('sortDirection', sort.direction);
          
          // Add filters to query params if they exist
          if (filters.search) {
            params.append('search', filters.search);
          }
          
          if (filters.status && filters.status.length > 0) {
            filters.status.forEach(status => {
              params.append('status', status);
            });
          }
          
          if (filters.dateRange?.start) {
            params.append('dateStart', filters.dateRange.start);
          }
          
          if (filters.dateRange?.end) {
            params.append('dateEnd', filters.dateRange.end);
          }
          
          if (filters.agentIds && filters.agentIds.length > 0) {
            filters.agentIds.forEach(agentId => {
              params.append('agentId', agentId);
            });
          }
          
          if (filters.categories && filters.categories.length > 0) {
            filters.categories.forEach(category => {
              params.append('category', category);
            });
          }
          
          if (filters.tags && filters.tags.length > 0) {
            filters.tags.forEach(tag => {
              params.append('tag', tag);
            });
          }
          
          if (filters.sentiment && filters.sentiment.length > 0) {
            filters.sentiment.forEach(sentiment => {
              params.append('sentiment', sentiment);
            });
          }
          
          if (filters.duration?.min !== undefined) {
            params.append('durationMin', filters.duration.min.toString());
          }
          
          if (filters.duration?.max !== undefined) {
            params.append('durationMax', filters.duration.max.toString());
          }
          
          if (filters.score?.min !== undefined) {
            params.append('scoreMin', filters.score.min.toString());
          }
          
          if (filters.score?.max !== undefined) {
            params.append('scoreMax', filters.score.max.toString());
          }
          
          if (filters.complianceIssues !== undefined) {
            params.append('complianceIssues', filters.complianceIssues.toString());
          }

          const response = await fetch(`${API_URL}?${params.toString()}`);

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData?.error?.message || 'Failed to fetch calls');
          }

          const data = await response.json();

          set({
            calls: data.data,
            pagination: data.pagination,
            isLoading: false,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Failed to fetch calls';
          set({ error: errorMessage, isLoading: false });
        }
      },

      setFilters: (filters: FilterOptions) => {
        set({ 
          filters: { ...get().filters, ...filters },
          pagination: { ...get().pagination, page: 1 }, // Reset to first page on filter change
        });
        get().fetchCalls();
      },

      setSort: (sort: SortOptions) => {
        set({ sort });
        get().fetchCalls();
      },

      setPage: (page: number) => {
        set(state => ({
          pagination: { ...state.pagination, page },
        }));
        get().fetchCalls();
      },

      setPageSize: (pageSize: number) => {
        set(state => ({
          pagination: { ...state.pagination, pageSize, page: 1 }, // Reset to first page on page size change
        }));
        get().fetchCalls();
      },

      resetFilters: () => {
        set({
          filters: {},
          sort: DEFAULT_SORT,
          pagination: {
            ...get().pagination,
            page: 1, // Reset to first page
          },
        });
        get().fetchCalls();
      },
    }),
    {
      name: 'call-list-store',
    }
  )
);

export default useCallListStore; 
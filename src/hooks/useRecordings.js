// src/hooks/useRecordings.js
import { useState, useEffect, useCallback, useReducer } from 'react';
import { getRecordings, getRecording } from '../api/recordingsService';

// Reducer for managing complex state
function recordingsReducer(state, action) {
  switch (action.type) {
    case 'FETCH_INIT':
      return { 
        ...state, 
        loading: true, 
        error: null 
      };
    case 'FETCH_SUCCESS':
      return {
        ...state,
        loading: false,
        error: null,
        data: action.payload.data,
        meta: action.payload.meta
      };
    case 'FETCH_FAILURE':
      return {
        ...state,
        loading: false,
        error: action.payload
      };
    case 'SET_FILTER':
      return {
        ...state,
        params: {
          ...state.params,
          page: 1, // Reset to first page when filters change
          filters: {
            ...state.params.filters,
            [action.payload.key]: action.payload.value
          }
        }
      };
    case 'SET_SEARCH':
      return {
        ...state,
        params: {
          ...state.params,
          page: 1, // Reset to first page when search changes
          search: action.payload
        }
      };
    case 'SET_PAGE':
      return {
        ...state,
        params: {
          ...state.params,
          page: action.payload
        }
      };
    case 'SET_PAGE_SIZE':
      return {
        ...state,
        params: {
          ...state.params,
          page: 1, // Reset to first page when page size changes
          pageSize: action.payload
        }
      };
    case 'SET_SORT':
      return {
        ...state,
        params: {
          ...state.params,
          sortField: action.payload.field,
          sortDirection: action.payload.direction
        }
      };
    case 'RESET_FILTERS':
      return {
        ...state,
        params: {
          ...state.params,
          page: 1,
          filters: {},
          search: ''
        }
      };
    default:
      throw new Error(`Unsupported action type: ${action.type}`);
  }
}

export function useRecordings(initialParams = {}, initialLoad = true) {
  // Initialize with default parameters merged with provided ones
  const defaultParams = {
    page: 1,
    pageSize: 10,
    sortField: 'ingestion_timestamp',
    sortDirection: 'desc',
    filters: {},
    search: ''
  };
  
  const [state, dispatch] = useReducer(recordingsReducer, {
    data: [],
    meta: {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0
    },
    loading: false,
    error: null,
    params: { ...defaultParams, ...initialParams }
  });
  
  // Function to fetch recordings based on current params
  const fetchRecordings = useCallback(async () => {
    dispatch({ type: 'FETCH_INIT' });
    
    try {
      const response = await getRecordings(state.params);
      dispatch({ 
        type: 'FETCH_SUCCESS', 
        payload: response 
      });
    } catch (error) {
      dispatch({ 
        type: 'FETCH_FAILURE', 
        payload: error.message || 'Failed to fetch recordings' 
      });
    }
  }, [state.params]);
  
  // Fetch on mount or when dependencies change
  useEffect(() => {
    if (initialLoad) {
      fetchRecordings();
    }
  }, [fetchRecordings, initialLoad]);
  
  // Action creators (to be used by components)
  const setFilter = useCallback((key, value) => {
    dispatch({ 
      type: 'SET_FILTER', 
      payload: { key, value } 
    });
  }, []);
  
  const setSearch = useCallback((value) => {
    dispatch({ 
      type: 'SET_SEARCH', 
      payload: value 
    });
  }, []);
  
  const setPage = useCallback((page) => {
    dispatch({ 
      type: 'SET_PAGE', 
      payload: page 
    });
  }, []);
  
  const setPageSize = useCallback((size) => {
    dispatch({ 
      type: 'SET_PAGE_SIZE', 
      payload: size 
    });
  }, []);
  
  const setSort = useCallback((field, direction = 'asc') => {
    dispatch({ 
      type: 'SET_SORT', 
      payload: { field, direction } 
    });
  }, []);
  
  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS' });
  }, []);
  
  // Single item fetching
  const [selectedRecording, setSelectedRecording] = useState(null);
  const [selectedLoading, setSelectedLoading] = useState(false);
  const [selectedError, setSelectedError] = useState(null);
  
  const fetchRecording = useCallback(async (id) => {
    if (!id) return;
    
    setSelectedLoading(true);
    setSelectedError(null);
    
    try {
      const response = await getRecording(id);
      setSelectedRecording(response);
      return response;
    } catch (error) {
      setSelectedError(error.message || 'Failed to fetch recording details');
      throw error;
    } finally {
      setSelectedLoading(false);
    }
  }, []);
  
  return {
    // Data and metadata
    recordings: state.data,
    meta: state.meta,
    loading: state.loading,
    error: state.error,
    params: state.params,
    
    // Data fetching
    fetchRecordings,
    
    // Filtering and sorting
    setFilter,
    setSearch,
    setPage,
    setPageSize,
    setSort,
    resetFilters,
    
    // Single item
    selectedRecording,
    selectedLoading,
    selectedError,
    fetchRecording
  };
}
// src/api/apiClient.js
import axios from 'axios';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: '/api', // Future real API endpoint
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Common response processor
export const processApiResponse = (response) => {
  return {
    data: response.data || [],
    meta: response.meta || {
      total: response.totalCount || (response.data ? response.data.length : 0),
      page: 1,
      pageSize: 10,
      totalPages: Math.ceil((response.totalCount || (response.data ? response.data.length : 0)) / 10)
    }
  };
};

// Common query params creator
export const createQueryParams = (params = {}) => {
  const {
    page = 1,
    pageSize = 10,
    sortField,
    sortDirection = 'desc',
    filters = {},
    search,
    ...rest
  } = params;
  
  const queryParams = new URLSearchParams();
  
  // Add pagination
  queryParams.append('page', page);
  queryParams.append('pageSize', pageSize);
  
  // Add sorting
  if (sortField) {
    queryParams.append('sortField', sortField);
    queryParams.append('sortDirection', sortDirection);
  }
  
  // Add search
  if (search) {
    queryParams.append('search', search);
  }
  
  // Add filters
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      // Handle arrays
      if (Array.isArray(value)) {
        value.forEach(v => queryParams.append(`${key}[]`, v));
      } else {
        queryParams.append(key, value);
      }
    }
  });
  
  // Add any other parameters
  Object.entries(rest).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });
  
  return queryParams;
};

export default apiClient;
// src/api/recordingsService.js
import apiClient, { processApiResponse, createQueryParams } from './apiClient';
import { mockRecordings } from './mockData';

// Get all recordings with pagination, filtering, sorting
export const getRecordings = async (params = {}) => {
  try {
    // MOCK IMPLEMENTATION - will be replaced with real API call
    const {
      page = 1,
      pageSize = 10,
      sortField = 'ingestion_timestamp',
      sortDirection = 'desc',
      filters = {},
      search = ''
    } = params;
    
    // Filter recordings
    let filteredData = [...mockRecordings];
    
    // Apply search
    if (search) {
      const searchLower = search.toLowerCase();
      filteredData = filteredData.filter(rec => 
        rec.original_file_name.toLowerCase().includes(searchLower) ||
        rec.id.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply filters
    if (filters.status) {
      filteredData = filteredData.filter(rec => rec.processing_status === filters.status);
    }
    
    if (filters.dateFrom) {
      const fromDate = new Date(filters.dateFrom);
      filteredData = filteredData.filter(rec => new Date(rec.ingestion_timestamp) >= fromDate);
    }
    
    if (filters.dateTo) {
      const toDate = new Date(filters.dateTo);
      filteredData = filteredData.filter(rec => new Date(rec.ingestion_timestamp) <= toDate);
    }
    
    // Apply sorting
    filteredData.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      // Handle string comparison
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }
      
      // Handle date comparison
      if (sortField === 'ingestion_timestamp') {
        return sortDirection === 'asc'
          ? new Date(aValue) - new Date(bValue)
          : new Date(bValue) - new Date(aValue);
      }
      
      // Handle numeric comparison
      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
    
    // Apply pagination
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);
    
    // Construct response
    return {
      data: paginatedData,
      meta: {
        total: filteredData.length,
        page,
        pageSize,
        totalPages: Math.ceil(filteredData.length / pageSize),
        filters,
        sort: { field: sortField, direction: sortDirection }
      }
    };
    
    // REAL IMPLEMENTATION:
    // const queryParams = createQueryParams(params);
    // const response = await apiClient.get(`/recordings?${queryParams}`);
    // return processApiResponse(response.data);
  } catch (error) {
    console.error('Error fetching recordings:', error);
    throw error;
  }
};

// Get recording by ID
export const getRecording = async (id) => {
  try {
    // MOCK IMPLEMENTATION
    const recording = mockRecordings.find(rec => rec.id === id);
    if (!recording) {
      throw new Error('Recording not found');
    }
    return recording;
    
    // REAL IMPLEMENTATION:
    // const response = await apiClient.get(`/recordings/${id}`);
    // return response.data;
  } catch (error) {
    console.error(`Error fetching recording ${id}:`, error);
    throw error;
  }
};

// Additional methods for upload, etc.
export const getUploadUrl = async (fileName, contentType) => {
  // Implementation...
};

export const commitUpload = async (filePath, fileSize, durationSeconds, defaultAnalysisProfileId = null) => {
  // Implementation...
};

export const requestAnalysis = async (recordingId, analysisProfileId) => {
  // Implementation...
};
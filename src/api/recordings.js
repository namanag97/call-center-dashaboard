// src/api/recordings.js
import apiClient from './index';
import { mockRecordings } from './mockData';

// Get pre-signed upload URL
export const getUploadUrl = async (fileName, contentType) => {
  // In a real implementation, this would call the API
  // For now, we'll mock the response
  return {
    uploadUrl: 'https://mock-s3-upload-url.com',
    filePath: `temp-upload-${Date.now()}/${fileName}`,
    recordingId: `temp-${Date.now()}`
  };
};

// Commit uploaded file
export const commitUpload = async (filePath, fileSize, durationSeconds, defaultAnalysisProfileId = null) => {
  // Mock creating a new recording record
  const newRecording = {
    id: `rec-${Date.now()}`,
    original_file_name: filePath.split('/').pop(),
    processed_file_path: `s3://your-bucket-recordings-processed/${filePath}`,
    file_content_hash: `hash-${Date.now()}`,
    file_size_bytes: fileSize,
    duration_seconds: durationSeconds,
    mime_type: 'audio/aac',
    ingestion_source: 'upload',
    ingestion_timestamp: new Date().toISOString(),
    processing_status: 'pending_transcription',
    transcription_status: 'pending',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // In a real implementation, this would post to the API
  // For now, we'll just return the mock data
  return { recordingId: newRecording.id, message: 'Recording accepted for processing.' };
};

// Get all recordings with optional filters
export const getRecordings = async (filters = {}) => {
  // In a real implementation, this would call the API with filters
  // For now, we'll just return the mock data
  return { data: mockRecordings, totalCount: mockRecordings.length };
};

// Get specific recording by ID
export const getRecording = async (id) => {
  // In a real implementation, this would call the API
  // For now, we'll find the recording in our mock data
  const recording = mockRecordings.find(rec => rec.id === id);
  if (!recording) {
    throw new Error('Recording not found');
  }
  
  return recording;
};

// Request analysis
export const requestAnalysis = async (recordingId, analysisProfileId) => {
  // In a real implementation, this would post to the API
  // For now, we'll just return a success message
  return { message: 'Analysis dispatch request queued.' };
};
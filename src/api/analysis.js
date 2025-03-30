// src/api/analysis.js
import { mockAnalysis } from './mockData';

// Get analysis for a recording
export const getAnalysis = async (recordingId) => {
  // In a real implementation, this would call the API
  // For now, we'll return the mock data
  const analysis = mockAnalysis[recordingId];
  if (!analysis) {
    throw new Error('Analysis not found');
  }
  
  return analysis;
};
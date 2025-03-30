// src/api/transcripts.js
import { mockTranscripts } from './mockData';

// Get transcript for a recording
export const getTranscript = async (recordingId) => {
  // In a real implementation, this would call the API
  // For now, we'll return the mock data
  const transcript = mockTranscripts[recordingId];
  if (!transcript) {
    throw new Error('Transcript not found');
  }
  
  return transcript;
};
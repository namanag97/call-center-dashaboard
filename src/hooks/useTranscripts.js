// src/hooks/useTranscripts.js
import { useState, useCallback } from 'react';
import { getTranscript } from '../api/transcripts';

export function useTranscripts() {
  const [transcript, setTranscript] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchTranscript = useCallback(async (recordingId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getTranscript(recordingId);
      setTranscript(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch transcript');
      setTranscript(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    transcript,
    loading,
    error,
    fetchTranscript
  };
}
// src/hooks/useAnalysis.js
import { useState, useCallback } from 'react';
import { getAnalysis } from '../api/analysis';

export function useAnalysis() {
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchAnalysis = useCallback(async (recordingId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getAnalysis(recordingId);
      setAnalysis(response);
      return response;
    } catch (err) {
      setError(err.message || 'Failed to fetch analysis');
      setAnalysis(null);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);
  
  return {
    analysis,
    loading,
    error,
    fetchAnalysis
  };
}
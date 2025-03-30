// src/hooks/useRecordingDetails.js
import { useState, useEffect, useCallback } from 'react';
import { getRecording } from '../api/recordings';
import { getTranscript } from '../api/transcriptions';
import { getAnalysis } from '../api/analysis';

export function useRecordingDetails(recordingId) {
  const [recording, setRecording] = useState(null);
  const [transcript, setTranscript] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const fetchAll = useCallback(async () => {
    if (!recordingId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Fetch recording details
      const recordingData = await getRecording(recordingId);
      setRecording(recordingData);
      
      // If we have a transcript path, fetch the transcript
      if (recordingData.transcript_file_path) {
        try {
          const transcriptData = await getTranscript(recordingId);
          setTranscript(transcriptData);
        } catch (err) {
          console.error('Error fetching transcript:', err);
          // Don't set error state here, as we want to continue trying to fetch analysis
        }
      }
      
      // Try to fetch analysis
      try {
        const analysisData = await getAnalysis(recordingId);
        setAnalysis(analysisData);
      } catch (err) {
        console.error('Error fetching analysis:', err);
        // Don't set error state here either
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch recording details');
    } finally {
      setLoading(false);
    }
  }, [recordingId]);
  
  useEffect(() => {
    if (recordingId) {
      fetchAll();
    }
  }, [recordingId, fetchAll]);
  
  return {
    recording,
    transcript,
    analysis,
    loading,
    error,
    refresh: fetchAll
  };
}
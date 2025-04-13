import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

// Temporary type definitions until import issues are fixed
interface TranscriptEntry {
  id: string;
  text: string;
  speakerId: string;
  speakerName: string;
  speakerRole: string;
  words?: Array<{
    text: string;
    startTime: number;
    endTime: number;
    confidence?: number;
  }>;
}

interface AnalysisResult {
  callId: string;
  // other properties would be defined here
}

interface QAData {
  callId: string;
  // other properties would be defined here
}

interface CallDetail {
  id: string;
  title: string;
  date: string;
  duration: number;
  transcript?: TranscriptEntry[];
  // other properties would be defined here
}

interface CallDetailContextType {
  // Call data
  callDetail: CallDetail | null;
  analysisResult: AnalysisResult | null;
  qaData: QAData | null;
  
  // Playback state
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  
  // Active elements
  activeTranscriptEntryId: string | null;
  
  // Actions
  setIsPlaying: (isPlaying: boolean) => void;
  setCurrentTime: (time: number) => void;
  setDuration: (duration: number) => void;
  jumpToTranscriptEntry: (entryId: string) => void;
  addQANote: (note: { text: string; transcriptEntryId: string; category: string }) => void;
  updateCriterionScore: (criterionId: string, score: number, comment?: string) => void;
  submitFeedback: (feedback: string) => void;
  completeQA: () => void;
}

const CallDetailContext = createContext<CallDetailContextType | null>(null);

interface CallDetailProviderProps {
  children: ReactNode;
  callDetail: CallDetail | null;
  analysisResult: AnalysisResult | null;
  qaData: QAData | null;
  onAddNote?: (note: { text: string; transcriptEntryId: string; category: string }) => void;
  onUpdateCriterion?: (criterionId: string, score: number, comment?: string) => void;
  onSubmitFeedback?: (feedback: string) => void;
  onCompleteQA?: () => void;
}

export const CallDetailProvider: React.FC<CallDetailProviderProps> = ({
  children,
  callDetail,
  analysisResult,
  qaData,
  onAddNote,
  onUpdateCriterion,
  onSubmitFeedback,
  onCompleteQA,
}) => {
  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  // Active elements
  const [activeTranscriptEntryId, setActiveTranscriptEntryId] = useState<string | null>(null);
  
  // Find transcript entry by time
  const findTranscriptEntryByTime = useCallback((time: number): string | null => {
    if (!callDetail?.transcript || callDetail.transcript.length === 0) {
      return null;
    }
    
    // Find entry containing the current time
    for (const entry of callDetail.transcript) {
      if (!entry.words || entry.words.length === 0) continue;
      
      const firstWord = entry.words[0];
      const lastWord = entry.words[entry.words.length - 1];
      
      if (time >= firstWord.startTime && time <= lastWord.endTime) {
        return entry.id;
      }
    }
    
    // If no exact match, find the closest
    let closestEntry = null;
    let smallestDiff = Infinity;
    
    for (const entry of callDetail.transcript) {
      if (!entry.words || entry.words.length === 0) continue;
      
      const entryMidpoint = (entry.words[0].startTime + entry.words[entry.words.length - 1].endTime) / 2;
      const diff = Math.abs(entryMidpoint - time);
      
      if (diff < smallestDiff) {
        smallestDiff = diff;
        closestEntry = entry.id;
      }
    }
    
    return closestEntry;
  }, [callDetail]);
  
  // Find time by transcript entry
  const findTimeByTranscriptEntry = useCallback((entryId: string): number | null => {
    if (!callDetail?.transcript) return null;
    
    const entry = callDetail.transcript.find(e => e.id === entryId);
    if (!entry || !entry.words || entry.words.length === 0) return null;
    
    return entry.words[0].startTime;
  }, [callDetail]);
  
  // Update active transcript entry when current time changes
  React.useEffect(() => {
    const entryId = findTranscriptEntryByTime(currentTime);
    setActiveTranscriptEntryId(entryId);
  }, [currentTime, findTranscriptEntryByTime]);
  
  // Jump to transcript entry
  const jumpToTranscriptEntry = useCallback((entryId: string) => {
    const time = findTimeByTranscriptEntry(entryId);
    if (time !== null) {
      setCurrentTime(time);
      setActiveTranscriptEntryId(entryId);
    }
  }, [findTimeByTranscriptEntry]);
  
  // Add QA note
  const addQANote = useCallback((note: { text: string; transcriptEntryId: string; category: string }) => {
    if (onAddNote) {
      onAddNote(note);
    }
  }, [onAddNote]);
  
  // Update criterion score
  const updateCriterionScore = useCallback((criterionId: string, score: number, comment?: string) => {
    if (onUpdateCriterion) {
      onUpdateCriterion(criterionId, score, comment);
    }
  }, [onUpdateCriterion]);
  
  // Submit feedback
  const submitFeedback = useCallback((feedback: string) => {
    if (onSubmitFeedback) {
      onSubmitFeedback(feedback);
    }
  }, [onSubmitFeedback]);
  
  // Complete QA
  const completeQA = useCallback(() => {
    if (onCompleteQA) {
      onCompleteQA();
    }
  }, [onCompleteQA]);
  
  const contextValue: CallDetailContextType = {
    callDetail,
    analysisResult,
    qaData,
    isPlaying,
    currentTime,
    duration,
    activeTranscriptEntryId,
    setIsPlaying,
    setCurrentTime,
    setDuration,
    jumpToTranscriptEntry,
    addQANote,
    updateCriterionScore,
    submitFeedback,
    completeQA,
  };
  
  return (
    <CallDetailContext.Provider value={contextValue}>
      {children}
    </CallDetailContext.Provider>
  );
};

// Custom hook for using the context
export const useCallDetail = () => {
  const context = useContext(CallDetailContext);
  if (!context) {
    throw new Error('useCallDetail must be used within a CallDetailProvider');
  }
  return context;
};

export default CallDetailContext; 
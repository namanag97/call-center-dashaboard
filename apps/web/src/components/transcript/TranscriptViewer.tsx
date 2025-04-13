import React, { useState, useEffect, useRef, useCallback } from 'react';
import { TranscriptEntry, SpeakerRole } from '@conista/shared-types';

export interface TranscriptViewerProps {
  /**
   * Array of transcript entries to display
   */
  transcript: TranscriptEntry[];
  
  /**
   * Current playback time in seconds
   */
  currentTime?: number;
  
  /**
   * Callback when a transcript entry is clicked
   */
  onEntryClick?: (entry: TranscriptEntry) => void;
  
  /**
   * CSS class to apply to the container
   */
  className?: string;
  
  /**
   * Whether to auto-scroll to the current entry
   */
  autoScroll?: boolean;
}

/**
 * Finds the currently active transcript entry based on the current playback time
 */
const findActiveEntry = (transcript: TranscriptEntry[], currentTime: number): string | null => {
  if (!transcript?.length || currentTime === undefined) {
    return null;
  }
  
  // Loop through each entry to find the active one based on word timing
  for (const entry of transcript) {
    if (!entry.words?.length) {
      continue;
    }
    
    const firstWord = entry.words[0];
    const lastWord = entry.words[entry.words.length - 1];
    
    // Check if current time is within this entry's start and end time
    if (currentTime >= firstWord.startTime && currentTime <= lastWord.endTime) {
      return entry.id;
    }
  }
  
  // If no exact match, find the entry that's closest to the current time
  let closestEntry = null;
  let smallestDiff = Infinity;
  
  for (const entry of transcript) {
    if (!entry.words?.length) {
      continue;
    }
    
    const entryMidpoint = (entry.words[0].startTime + entry.words[entry.words.length - 1].endTime) / 2;
    const diff = Math.abs(entryMidpoint - currentTime);
    
    if (diff < smallestDiff) {
      smallestDiff = diff;
      closestEntry = entry.id;
    }
  }
  
  return closestEntry;
};

/**
 * TranscriptViewer component that displays transcript entries and highlights the current segment being played
 */
const TranscriptViewer: React.FC<TranscriptViewerProps> = ({
  transcript,
  currentTime = 0,
  onEntryClick,
  className = '',
  autoScroll = true,
}) => {
  const [activeEntryId, setActiveEntryId] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const entryRefs = useRef<Record<string, HTMLDivElement | null>>({});
  
  // Update active entry when currentTime changes
  useEffect(() => {
    const newActiveEntryId = findActiveEntry(transcript, currentTime);
    setActiveEntryId(newActiveEntryId);
    
    // Auto-scroll to active entry if enabled
    if (autoScroll && newActiveEntryId && entryRefs.current[newActiveEntryId] && containerRef.current) {
      entryRefs.current[newActiveEntryId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [currentTime, transcript, autoScroll]);
  
  // Handle click on a transcript entry
  const handleEntryClick = useCallback((entry: TranscriptEntry) => {
    if (onEntryClick) {
      onEntryClick(entry);
    }
  }, [onEntryClick]);
  
  // Set ref for an entry
  const setEntryRef = useCallback((el: HTMLDivElement | null, id: string) => {
    entryRefs.current[id] = el;
  }, []);
  
  // Returns the appropriate style for speaker role
  const getSpeakerStyles = (role: SpeakerRole): { bgColor: string; textColor: string } => {
    switch (role) {
      case SpeakerRole.Agent:
        return { bgColor: 'bg-blue-100', textColor: 'text-blue-800' };
      case SpeakerRole.Customer:
        return { bgColor: 'bg-green-100', textColor: 'text-green-800' };
      default:
        return { bgColor: 'bg-gray-100', textColor: 'text-gray-800' };
    }
  };
  
  if (!transcript || transcript.length === 0) {
    return (
      <div className={`rounded-lg border border-neutral-200 p-4 bg-white ${className}`}>
        <p className="text-neutral-500 italic">No transcript available</p>
      </div>
    );
  }
  
  return (
    <div 
      ref={containerRef}
      className={`overflow-y-auto rounded-lg border border-neutral-200 bg-white ${className}`}
      style={{ maxHeight: '600px' }}
      aria-label="Call transcript"
    >
      <div className="divide-y divide-neutral-100">
        {transcript.map((entry) => {
          const { bgColor, textColor } = getSpeakerStyles(entry.speakerRole);
          const isActive = entry.id === activeEntryId;
          
          return (
            <div 
              key={entry.id}
              ref={(el) => setEntryRef(el, entry.id)}
              className={`p-4 transition-colors duration-200 hover:bg-neutral-50 cursor-pointer ${isActive ? 'bg-yellow-50' : ''}`}
              onClick={() => handleEntryClick(entry)}
              tabIndex={0}
              role="button"
              aria-pressed={isActive}
            >
              <div className="flex items-start mb-2">
                <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${bgColor} ${textColor}`}>
                  {entry.speakerName} ({entry.speakerRole})
                </span>
                {entry.words && entry.words.length > 0 && (
                  <span className="ml-2 text-xs text-neutral-500">
                    {Math.floor(entry.words[0].startTime / 60)}:
                    {Math.floor(entry.words[0].startTime % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
              <div className={`text-sm ${isActive ? 'font-medium' : ''}`}>
                {entry.text}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TranscriptViewer; 
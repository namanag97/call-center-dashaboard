import React, { useState, useRef, useEffect, useCallback } from 'react';

export interface AudioPlayerProps {
  /**
   * URL to the audio file
   */
  audioUrl: string;
  
  /**
   * Callback that returns the current playback time in seconds
   */
  onTimeUpdate?: (currentTime: number) => void;
  
  /**
   * Initial volume level (0-1)
   */
  initialVolume?: number;
  
  /**
   * Whether to autoplay when loaded
   */
  autoPlay?: boolean;
  
  /**
   * CSS class to apply to the container
   */
  className?: string;
  
  /**
   * Callback when audio has loaded metadata
   */
  onLoadedMetadata?: (duration: number) => void;
  
  /**
   * Callback when audio playback ends
   */
  onEnded?: () => void;
  
  /**
   * Callback when an error occurs
   */
  onError?: (error: Error) => void;
}

/**
 * Audio player component with playback controls
 */
const AudioPlayer: React.FC<AudioPlayerProps> = ({
  audioUrl,
  onTimeUpdate,
  initialVolume = 0.7,
  autoPlay = false,
  className = '',
  onLoadedMetadata,
  onEnded,
  onError
}) => {
  // State for player
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(initialVolume);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  // References
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // Handle play/pause toggle
  const togglePlayPause = useCallback(() => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(err => {
        setError(new Error('Failed to play audio: ' + err.message));
        if (onError) onError(err);
      });
    }
    
    setIsPlaying(!isPlaying);
  }, [isPlaying, onError]);
  
  // Handle seek change
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
    
    if (onTimeUpdate) {
      onTimeUpdate(newTime);
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current) return;
    
    const newVolume = parseFloat(e.target.value);
    audioRef.current.volume = newVolume;
    setVolume(newVolume);
    
    if (newVolume === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };
  
  // Toggle mute
  const toggleMute = useCallback(() => {
    if (!audioRef.current) return;
    
    const newMuteState = !isMuted;
    audioRef.current.muted = newMuteState;
    setIsMuted(newMuteState);
  }, [isMuted]);
  
  // Format time in MM:SS
  const formatTime = (timeInSeconds: number): string => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Set up event listeners
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;
    
    const handleLoadedMetadata = () => {
      setDuration(audioElement.duration);
      setIsLoading(false);
      if (onLoadedMetadata) {
        onLoadedMetadata(audioElement.duration);
      }
    };
    
    const handleTimeUpdate = () => {
      setCurrentTime(audioElement.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(audioElement.currentTime);
      }
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (onEnded) {
        onEnded();
      }
    };
    
    const handleError = (e: Event) => {
      setIsLoading(false);
      setError(new Error('Error loading audio file'));
      if (onError) {
        onError(new Error('Error loading audio file'));
      }
    };
    
    // Attach event listeners
    audioElement.addEventListener('loadedmetadata', handleLoadedMetadata);
    audioElement.addEventListener('timeupdate', handleTimeUpdate);
    audioElement.addEventListener('ended', handleEnded);
    audioElement.addEventListener('error', handleError);
    
    // Set initial volume
    audioElement.volume = initialVolume;
    
    // Clean up
    return () => {
      audioElement.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audioElement.removeEventListener('timeupdate', handleTimeUpdate);
      audioElement.removeEventListener('ended', handleEnded);
      audioElement.removeEventListener('error', handleError);
    };
  }, [initialVolume, onTimeUpdate, onLoadedMetadata, onEnded, onError]);
  
  // Keyboard event handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle events when this component is focused
      const activeElement = document.activeElement;
      const audioPlayerElement = document.getElementById('audio-player-container');
      
      if (!audioPlayerElement?.contains(activeElement) && activeElement !== document.body) {
        return;
      }
      
      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowRight':
          if (audioRef.current) {
            const newTime = Math.min(audioRef.current.currentTime + 5, duration);
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
          }
          break;
        case 'ArrowLeft':
          if (audioRef.current) {
            const newTime = Math.max(audioRef.current.currentTime - 5, 0);
            audioRef.current.currentTime = newTime;
            setCurrentTime(newTime);
          }
          break;
        case 'ArrowUp':
          if (audioRef.current) {
            const newVolume = Math.min(volume + 0.1, 1);
            audioRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(false);
          }
          break;
        case 'ArrowDown':
          if (audioRef.current) {
            const newVolume = Math.max(volume - 0.1, 0);
            audioRef.current.volume = newVolume;
            setVolume(newVolume);
            setIsMuted(newVolume === 0);
          }
          break;
        case 'm':
          toggleMute();
          break;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [togglePlayPause, toggleMute, volume, duration]);
  
  // Rendering
  return (
    <div 
      id="audio-player-container"
      className={`flex flex-col p-4 rounded-lg border border-neutral-200 bg-white ${className}`}
      tabIndex={0}
      aria-label="Audio player controls"
    >
      <audio
        ref={audioRef}
        src={audioUrl}
        preload="metadata"
        autoPlay={autoPlay}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      {/* Loading/Error states */}
      {isLoading && (
        <div className="flex justify-center items-center py-4">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading audio...</span>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md my-2">
          <p>Failed to load audio: {error.message}</p>
        </div>
      )}
      
      {/* Playback controls */}
      <div className="flex items-center space-x-2 my-2">
        <button
          onClick={togglePlayPause}
          disabled={isLoading || !!error}
          className="p-2 rounded-full bg-primary-600 text-white disabled:bg-neutral-300 disabled:text-neutral-500"
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>
        
        <span className="text-sm text-neutral-600 w-16">{formatTime(currentTime)}</span>
        
        <input
          type="range"
          min="0"
          max={duration || 100}
          value={currentTime}
          onChange={handleSeek}
          className="flex-grow h-2 rounded-lg appearance-none bg-neutral-200 accent-primary-600"
          disabled={isLoading || !!error || duration === 0}
          aria-label="Seek time in audio"
        />
        
        <span className="text-sm text-neutral-600 w-16">{formatTime(duration)}</span>
        
        <button
          onClick={toggleMute}
          disabled={isLoading || !!error}
          className="p-2 text-neutral-700 disabled:text-neutral-400"
          aria-label={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
        
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className="w-20 h-2 rounded-lg appearance-none bg-neutral-200 accent-primary-600"
          disabled={isLoading || !!error}
          aria-label="Volume control"
        />
      </div>
      
      {/* Playback speed (optional) */}
      <div className="flex justify-end mt-2">
        <select
          onChange={(e) => {
            if (audioRef.current) {
              audioRef.current.playbackRate = parseFloat(e.target.value);
            }
          }}
          className="text-xs border border-neutral-300 rounded px-2 py-1"
          aria-label="Playback speed"
        >
          <option value="0.5">0.5x</option>
          <option value="0.75">0.75x</option>
          <option value="1" selected>1x</option>
          <option value="1.25">1.25x</option>
          <option value="1.5">1.5x</option>
          <option value="2">2x</option>
        </select>
      </div>
      
      {/* Accessibility notes */}
      <div className="mt-4 text-xs text-neutral-500">
        <p>Keyboard shortcuts: Space (play/pause), Left/Right arrows (seek), Up/Down arrows (volume), M (mute)</p>
      </div>
    </div>
  );
};

export default AudioPlayer; 
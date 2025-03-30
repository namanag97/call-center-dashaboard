// src/components/AudioPlayer.jsx
import { useState, useRef, useEffect } from 'react';
import { Box, Group, Button, Text, Slider } from '@mantine/core';
import { IconPlayerPlay, IconPlayerPause, IconVolume } from '@tabler/icons-react';

function AudioPlayer({ recording, currentTime, setCurrentTime }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(recording?.duration_seconds || 0);
  const [volume, setVolume] = useState(100);
  const audioRef = useRef(null);
  
  // Update audio element's current time when currentTime prop changes
  useEffect(() => {
    if (audioRef.current && Math.abs(audioRef.current.currentTime - currentTime) > 0.5) {
      audioRef.current.currentTime = currentTime;
    }
  }, [currentTime]);
  
  // Set up event listeners for the audio element
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };
    
    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
    };
    
    const handlePlay = () => {
      setIsPlaying(true);
    };
    
    const handlePause = () => {
      setIsPlaying(false);
    };
    
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);
    
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, [setCurrentTime]);
  
  // Toggle play/pause
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
  };
  
  // Handle seek
  const handleSeek = (value) => {
    setCurrentTime(value);
    if (audioRef.current) {
      audioRef.current.currentTime = value;
    }
  };
  
  // Handle volume change
  const handleVolumeChange = (value) => {
    setVolume(value);
    if (audioRef.current) {
      audioRef.current.volume = value / 100;
    }
  };
  
  // Format time for display
  const formatTime = (seconds) => {
    if (!seconds && seconds !== 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainingSecs = Math.floor(seconds % 60);
    return `${minutes}:${remainingSecs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Box p="md" style={{ 
      background: 'var(--color-paper-secondary, var(--mantine-color-gray-0))', 
      borderBottom: '1px solid var(--color-border, var(--mantine-color-gray-3))'
    }}>
      {/* Hidden audio element */}
      <audio 
        ref={audioRef} 
        src={recording?.audio_url} 
        preload="metadata"
        onEnded={() => setIsPlaying(false)}
      />
      
      <Group align="center" spacing="md">
        <Button 
          variant="default" 
          style={{ 
            width: 36, 
            height: 36, 
            padding: 0, 
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onClick={togglePlayPause}
        >
          {isPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
        </Button>
        
        <Box style={{ flex: 1 }}>
          <Slider
            value={currentTime}
            onChange={handleSeek}
            min={0}
            max={duration}
            step={0.1}
            label={formatTime}
            size="xs"
            style={{ marginBottom: '8px' }}
          />
          
          <Group position="apart">
            <Text size="xs" c="dimmed">
              {formatTime(currentTime)} / {formatTime(duration)}
            </Text>
            
            <Group spacing={8} align="center">
              <IconVolume size={14} style={{ color: 'var(--color-text-secondary, var(--mantine-color-gray-5))' }} />
              <Slider
                value={volume}
                onChange={handleVolumeChange}
                min={0}
                max={100}
                size="xs"
                style={{ width: '80px' }}
              />
            </Group>
          </Group>
        </Box>
      </Group>
    </Box>
  );
}

export default AudioPlayer;
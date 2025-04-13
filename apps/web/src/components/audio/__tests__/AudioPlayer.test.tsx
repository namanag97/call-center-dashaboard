import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, test, expect, beforeEach } from 'vitest';
import AudioPlayer from '../AudioPlayer';

// Mock HTML media element
window.HTMLMediaElement.prototype.load = vi.fn();
window.HTMLMediaElement.prototype.play = vi.fn().mockReturnValue(Promise.resolve());
window.HTMLMediaElement.prototype.pause = vi.fn();

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

describe('AudioPlayer Component', () => {
  const mockAudioUrl = 'https://example.com/sample-audio.mp3';
  const mockTimeUpdate = vi.fn();
  const mockLoadedMetadata = vi.fn();
  const mockEnded = vi.fn();
  const mockError = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders correctly with default props', () => {
    render(<AudioPlayer audioUrl={mockAudioUrl} />);
    
    // Check if audio element is rendered
    expect(screen.getByLabelText('Audio player controls')).toBeInTheDocument();
    
    // Check if play button is rendered
    expect(screen.getByLabelText('Play')).toBeInTheDocument();
  });

  test('toggles play/pause when button is clicked', () => {
    render(<AudioPlayer audioUrl={mockAudioUrl} />);
    
    // Initially in paused state
    const playButton = screen.getByLabelText('Play');
    fireEvent.click(playButton);
    
    // Should now be playing
    expect(window.HTMLMediaElement.prototype.play).toHaveBeenCalledTimes(1);
    
    // Simulate play state (we can't directly modify the DOM state easily in tests)
    fireEvent.play(screen.getByLabelText(/audio player controls/i).querySelector('audio')!);

    // Now click to pause
    const pauseButton = screen.getByLabelText('Pause');
    fireEvent.click(pauseButton);
    
    expect(window.HTMLMediaElement.prototype.pause).toHaveBeenCalledTimes(1);
  });

  test('calls onTimeUpdate when time changes', async () => {
    render(
      <AudioPlayer 
        audioUrl={mockAudioUrl} 
        onTimeUpdate={mockTimeUpdate}
      />
    );
    
    const audioElement = screen.getByLabelText(/audio player controls/i).querySelector('audio')!;
    
    // Simulate timeupdate event
    fireEvent.timeUpdate(audioElement, { target: { currentTime: 10 } });
    
    // Need to wait for the effect to run
    await waitFor(() => {
      expect(mockTimeUpdate).toHaveBeenCalledWith(10);
    });
  });

  test('adjusts volume when volume control is changed', () => {
    render(<AudioPlayer audioUrl={mockAudioUrl} />);
    
    const volumeControl = screen.getByLabelText('Volume control');
    
    // Change volume to 0.5
    fireEvent.change(volumeControl, { target: { value: 0.5 } });
    
    // Check that the volume was updated
    const audioElement = screen.getByLabelText(/audio player controls/i).querySelector('audio')!;
    expect(audioElement.volume).toBe(0.5);
  });

  test('toggles mute when mute button is clicked', () => {
    render(<AudioPlayer audioUrl={mockAudioUrl} />);
    
    const muteButton = screen.getByLabelText('Mute');
    fireEvent.click(muteButton);
    
    // Check that audio is muted
    const audioElement = screen.getByLabelText(/audio player controls/i).querySelector('audio')!;
    expect(audioElement.muted).toBe(true);
    
    // Unmute
    const unmuteButton = screen.getByLabelText('Unmute');
    fireEvent.click(unmuteButton);
    
    expect(audioElement.muted).toBe(false);
  });

  test('changes playback time when seek bar is changed', () => {
    render(<AudioPlayer audioUrl={mockAudioUrl} />);
    
    // First set a duration (this is normally set when metadata loads)
    const audioElement = screen.getByLabelText(/audio player controls/i).querySelector('audio')!;
    Object.defineProperty(audioElement, 'duration', { value: 100 });
    
    // Simulate loadedmetadata to update the component state
    fireEvent.loadedMetadata(audioElement);
    
    // Now change the seek position
    const seekBar = screen.getByLabelText('Seek time in audio');
    fireEvent.change(seekBar, { target: { value: 30 } });
    
    // Check that currentTime was updated
    expect(audioElement.currentTime).toBe(30);
  });
}); 
import React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse, delay } from 'msw';
import AudioPlayer from './AudioPlayer';

const meta: Meta<typeof AudioPlayer> = {
  title: 'Components/Audio/AudioPlayer',
  component: AudioPlayer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    audioUrl: {
      control: 'text',
      description: 'URL to the audio file',
    },
    onTimeUpdate: { action: 'timeUpdate' },
    onLoadedMetadata: { action: 'loadedMetadata' },
    onEnded: { action: 'ended' },
    onError: { action: 'error' },
    initialVolume: {
      control: { type: 'range', min: 0, max: 1, step: 0.1 },
      description: 'Initial volume level (0-1)',
    },
    autoPlay: {
      control: 'boolean',
      description: 'Whether to autoplay when loaded',
    },
    className: {
      control: 'text',
      description: 'CSS class to apply to the container',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AudioPlayer>;

// Sample audio URL (replace with a valid audio file URL for actual testing)
const sampleAudioUrl = 'https://example.com/sample-audio.mp3';

// Basic player
export const Default: Story = {
  args: {
    audioUrl: sampleAudioUrl,
    initialVolume: 0.7,
    autoPlay: false,
  },
  parameters: {
    msw: {
      handlers: [
        // Mock the audio file request
        http.get('https://example.com/sample-audio.mp3', () => {
          // Return a mock audio file
          return HttpResponse.arrayBuffer(
            new ArrayBuffer(1024), // Mock audio data
            { 
              status: 200,
              headers: {
                'Content-Type': 'audio/mpeg'
              }
            }
          );
        }),
      ],
    },
  },
};

// Loading state simulation
export const Loading: Story = {
  args: {
    ...Default.args,
  },
  parameters: {
    msw: {
      handlers: [
        // Simulate a slow-loading audio file
        http.get('https://example.com/sample-audio.mp3', async () => {
          await delay(10000); // Long delay to keep it in loading state
          return HttpResponse.arrayBuffer(
            new ArrayBuffer(1024), // Mock audio data
            { 
              status: 200,
              headers: {
                'Content-Type': 'audio/mpeg'
              }
            }
          );
        }),
      ],
    },
  },
};

// Error state
export const Error: Story = {
  args: {
    ...Default.args,
    audioUrl: 'https://example.com/nonexistent-file.mp3',
  },
  parameters: {
    msw: {
      handlers: [
        // Simulate a 404 error
        http.get('https://example.com/nonexistent-file.mp3', () => {
          return HttpResponse.json(
            { error: 'Audio file not found' },
            { status: 404 }
          );
        }),
      ],
    },
  },
};

// With autoplay
export const AutoPlay: Story = {
  args: {
    ...Default.args,
    autoPlay: true,
  },
};

// With custom styling
export const CustomStyling: Story = {
  args: {
    ...Default.args,
    className: 'bg-blue-50 border-blue-200 rounded-xl shadow-lg',
  },
};

// Audio player with controls visible
export const WithVisibleControls: Story = {
  render: (args) => (
    <div className="w-[600px]">
      <AudioPlayer {...args} />
    </div>
  ),
  args: {
    ...Default.args,
  },
}; 
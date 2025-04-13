import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GeneralSettingsContainer } from './GeneralSettingsContainer';
import { http, HttpResponse, delay } from 'msw';

const meta: Meta<typeof GeneralSettingsContainer> = {
  title: 'Components/Settings/GeneralSettingsContainer',
  component: GeneralSettingsContainer,
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof GeneralSettingsContainer>;

// Define a type for settings
interface SystemSettings {
  maxUploadSize: number;
  maxFilesPerBatch: number;
  allowedFileTypes: string[];
  retentionPeriodDays: number;
  autoTranscribe: boolean;
  autoAnalyze: boolean;
  defaultTranscriptionProviderId?: string;
  defaultAnalysisProviderId?: string;
  defaultStorageProviderId?: string;
  version: number;
}

// Mock settings data
const mockSettings: SystemSettings = {
  maxUploadSize: 52428800, // 50 MB
  maxFilesPerBatch: 10,
  allowedFileTypes: ['.mp3', '.wav', '.m4a', '.flac'],
  retentionPeriodDays: 90,
  autoTranscribe: true,
  autoAnalyze: false,
  defaultTranscriptionProviderId: 'provider1',
  defaultAnalysisProviderId: 'provider2',
  defaultStorageProviderId: 'provider3',
  version: 1,
};

// Mock providers
const mockProviders = [
  {
    id: 'provider1',
    name: 'DeepGram',
    type: 'transcription',
    enabled: true,
    apiKey: 'abcd1234',
    config: {},
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z',
    version: 1,
  },
  {
    id: 'provider2',
    name: 'OpenAI',
    type: 'analysis',
    enabled: true,
    apiKey: 'efgh5678',
    config: {},
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z',
    version: 1,
  },
  {
    id: 'provider3',
    name: 'AWS S3',
    type: 'storage',
    enabled: true,
    apiKey: 'ijkl9012',
    config: {},
    createdAt: '2023-06-01T00:00:00Z',
    updatedAt: '2023-06-01T00:00:00Z',
    version: 1,
  },
  {
    id: 'provider4',
    name: 'Assembly AI',
    type: 'transcription',
    enabled: false,
    apiKey: 'mnop3456',
    config: {},
    createdAt: '2023-06-02T00:00:00Z',
    updatedAt: '2023-06-02T00:00:00Z',
    version: 1,
  },
];

// Success case
export const SuccessfulLoad: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/settings', async () => {
          await delay(1000); // Simulate network delay
          return HttpResponse.json({ data: mockSettings });
        }),
        http.get('/api/providers', async () => {
          await delay(800); // Simulate network delay
          return HttpResponse.json({ data: mockProviders });
        }),
        http.put('/api/settings', async ({ request }) => {
          await delay(1500); // Simulate network delay
          const data = await request.json() as Record<string, unknown>;
          const updatedSettings = {
            ...mockSettings,
            ...(data as Partial<SystemSettings>),
            version: mockSettings.version + 1
          };
          return HttpResponse.json({ data: updatedSettings });
        }),
      ],
    },
  },
};

// Error loading settings
export const ErrorLoadingSettings: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/settings', async () => {
          await delay(1000);
          return HttpResponse.error();
        }),
        http.get('/api/providers', async () => {
          await delay(800);
          return HttpResponse.json({ data: mockProviders });
        }),
      ],
    },
  },
};

// Error saving settings
export const ErrorSavingSettings: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/settings', async () => {
          await delay(1000);
          return HttpResponse.json({ data: mockSettings });
        }),
        http.get('/api/providers', async () => {
          await delay(800);
          return HttpResponse.json({ data: mockProviders });
        }),
        http.put('/api/settings', async () => {
          await delay(1000);
          return HttpResponse.error();
        }),
      ],
    },
  },
};

// Empty providers
export const NoProviders: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/settings', async () => {
          await delay(1000);
          return HttpResponse.json({ data: mockSettings });
        }),
        http.get('/api/providers', async () => {
          await delay(800);
          return HttpResponse.json({ data: [] });
        }),
      ],
    },
  },
}; 
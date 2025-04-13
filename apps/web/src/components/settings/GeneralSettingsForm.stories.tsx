import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { GeneralSettingsForm } from './GeneralSettingsForm';
import { http, HttpResponse, delay } from 'msw';

// Define Provider type locally since import isn't working
const ProviderType = {
  Transcription: 'transcription',
  Analysis: 'analysis',
  Storage: 'storage'
} as const;

// Define types that match the components expected props
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
  version?: number;
}

const meta: Meta<typeof GeneralSettingsForm> = {
  title: 'Components/Settings/GeneralSettingsForm',
  component: GeneralSettingsForm,
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof GeneralSettingsForm>;

// Mock settings
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
};

// Mock providers
const mockProviders = [
  {
    id: 'provider1',
    name: 'DeepGram',
    type: ProviderType.Transcription,
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
    type: ProviderType.Analysis,
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
    type: ProviderType.Storage,
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
    type: ProviderType.Transcription,
    enabled: false,
    apiKey: 'mnop3456',
    config: {},
    createdAt: '2023-06-02T00:00:00Z',
    updatedAt: '2023-06-02T00:00:00Z',
    version: 1,
  },
];

// Reusable async submission handler
const handleSubmit = async (data: SystemSettings) => {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      console.log('Submitted data:', data);
      resolve();
    }, 1000);
  });
};

// Default story with mock data
export const Default: Story = {
  args: {
    settings: mockSettings,
    providers: mockProviders,
    onSubmit: handleSubmit,
    isLoading: false,
  },
};

// Story with no providers
export const WithNoProviders: Story = {
  args: {
    settings: mockSettings,
    providers: [],
    onSubmit: handleSubmit,
    isLoading: false,
  },
};

// Loading state story
export const Loading: Story = {
  args: {
    settings: mockSettings,
    providers: mockProviders,
    onSubmit: handleSubmit,
    isLoading: true,
  },
};

// Story with API mocks
export const WithAPIMocks: Story = {
  parameters: {
    msw: {
      handlers: [
        http.get('/api/settings', () => {
          return HttpResponse.json({ data: mockSettings });
        }),
        http.get('/api/providers', () => {
          return HttpResponse.json({ data: mockProviders });
        }),
        http.put('/api/settings', async ({ request }) => {
          const requestData = await request.json() as Partial<SystemSettings>;
          await delay(1000);
          return HttpResponse.json({ 
            data: { 
              ...mockSettings,
              ...requestData
            }, 
            version: 2 
          });
        }),
      ],
    },
  },
  render: () => {
    const [isLoading, setIsLoading] = React.useState(false);
    const [settings, setSettings] = React.useState<SystemSettings | null>(null);
    const [providers, setProviders] = React.useState<typeof mockProviders>([]);
    
    React.useEffect(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          // Fetch settings
          const settingsResponse = await fetch('/api/settings');
          const settingsData = await settingsResponse.json();

          // Fetch providers
          const providersResponse = await fetch('/api/providers');
          const providersData = await providersResponse.json();
          
          setSettings(settingsData.data);
          setProviders(providersData.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchData();
    }, []);
    
    const handleFormSubmit = async (data: SystemSettings) => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/settings', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        const result = await response.json();
        setSettings(result.data);
      } catch (error) {
        console.error('Error updating settings:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (!settings) {
      return <div>Loading settings...</div>;
    }
    
    return (
      <GeneralSettingsForm 
        settings={settings} 
        providers={providers} 
        onSubmit={handleFormSubmit} 
        isLoading={isLoading} 
      />
    );
  },
}; 
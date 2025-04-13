import type { Meta, StoryObj } from '@storybook/react';
import { CallUploader } from './CallUploader';
import { UploadStatus } from 'shared-types';
import { http, HttpResponse, delay } from 'msw';

const meta: Meta<typeof CallUploader> = {
  component: CallUploader,
  title: 'Upload/CallUploader',
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        http.get('/api/uploads/constraints', async () => {
          await delay(300);
          return HttpResponse.json({
            data: {
              maxFileSize: 50 * 1024 * 1024, // 50 MB
              allowedFileTypes: ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg'],
              maxFilesPerBatch: 10
            }
          });
        })
      ]
    }
  },
  tags: ['autodocs'],
  argTypes: {
    onFilesSelected: { action: 'filesSelected' },
    onRemoveFile: { action: 'removeFile' },
    onRetryFile: { action: 'retryFile' }
  },
  decorators: [
    (Story) => (
      <div style={{ width: '700px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof CallUploader>;

// Sample recordings
const sampleRecordings = [
  {
    id: 'file-1',
    fileName: 'customer-call-20230615.mp3',
    fileSize: 3 * 1024 * 1024, // 3 MB
    fileType: 'audio/mp3',
    status: UploadStatus.Queued,
    progress: 0,
    addedAt: new Date().toISOString(),
  },
  {
    id: 'file-2',
    fileName: 'support-issue-20230614.wav',
    fileSize: 5.2 * 1024 * 1024, // 5.2 MB
    fileType: 'audio/wav',
    status: UploadStatus.Uploading,
    progress: 45,
    addedAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 minutes ago
  },
  {
    id: 'file-3',
    fileName: 'sales-call-20230613.mp3',
    fileSize: 2.8 * 1024 * 1024, // 2.8 MB
    fileType: 'audio/mp3',
    status: UploadStatus.Completed,
    progress: 100,
    addedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 minutes ago
    completedAt: new Date(Date.now() - 3 * 60 * 1000).toISOString(), // 3 minutes ago
  },
  {
    id: 'file-4',
    fileName: 'meeting-20230612.ogg',
    fileSize: 8.7 * 1024 * 1024, // 8.7 MB
    fileType: 'audio/ogg',
    status: UploadStatus.Failed,
    progress: 68,
    errorMessage: 'Network error: Connection reset by peer',
    addedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15 minutes ago
  },
];

export const Default: Story = {
  args: {}
};

export const WithRecordings: Story = {
  args: {
    recordings: sampleRecordings,
  }
};

export const WithQueuedRecordings: Story = {
  args: {
    recordings: sampleRecordings.filter(r => r.status === UploadStatus.Queued),
  }
};

export const WithUploadingRecordings: Story = {
  args: {
    recordings: sampleRecordings.filter(r => r.status === UploadStatus.Uploading),
  }
};

export const WithCompletedRecordings: Story = {
  args: {
    recordings: sampleRecordings.filter(r => r.status === UploadStatus.Completed),
  }
};

export const WithFailedRecordings: Story = {
  args: {
    recordings: sampleRecordings.filter(r => r.status === UploadStatus.Failed),
  }
};

export const Disabled: Story = {
  args: {
    disabled: true,
    recordings: sampleRecordings,
  }
};

export const CustomConstraints: Story = {
  args: {
    constraints: {
      maxFileSize: 10 * 1024 * 1024, // 10 MB
      allowedFileTypes: ['audio/mp3', 'audio/wav'],
      maxFilesPerBatch: 5
    }
  }
};

export const WithCustomValidation: Story = {
  args: {
    validateFile: (file: File) => {
      // Only allow MP3 files
      if (file.type !== 'audio/mp3') {
        return {
          isValid: false,
          errorMessage: 'Only MP3 files are allowed in this example.'
        };
      }
      
      // Only allow files smaller than 5 MB
      if (file.size > 5 * 1024 * 1024) {
        return {
          isValid: false,
          errorMessage: 'File size exceeds 5 MB limit for this example.'
        };
      }
      
      return { isValid: true };
    }
  }
}; 
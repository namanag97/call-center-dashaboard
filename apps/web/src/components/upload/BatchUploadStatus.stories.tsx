import type { Meta, StoryObj } from '@storybook/react';
import { BatchUploadStatus } from './BatchUploadStatus';
import { UploadStatus } from '@conista/shared-types';

const meta: Meta<typeof BatchUploadStatus> = {
  component: BatchUploadStatus,
  title: 'Upload/BatchUploadStatus',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof BatchUploadStatus>;

// Base recordings for stories
const baseRecordings = [
  {
    id: 'file-1',
    fileName: 'call1.mp3',
    fileSize: 3 * 1024 * 1024,
    fileType: 'audio/mp3',
    status: UploadStatus.Queued,
    progress: 0,
    addedAt: new Date().toISOString(),
  },
  {
    id: 'file-2',
    fileName: 'call2.wav',
    fileSize: 5 * 1024 * 1024,
    fileType: 'audio/wav',
    status: UploadStatus.Queued,
    progress: 0,
    addedAt: new Date().toISOString(),
  },
  {
    id: 'file-3',
    fileName: 'call3.mp3',
    fileSize: 2.5 * 1024 * 1024,
    fileType: 'audio/mp3',
    status: UploadStatus.Queued,
    progress: 0,
    addedAt: new Date().toISOString(),
  }
];

export const Queued: Story = {
  args: {
    recordings: baseRecordings,
  },
};

export const InProgress: Story = {
  args: {
    recordings: [
      {
        ...baseRecordings[0],
        status: UploadStatus.Uploading,
        progress: 75,
      },
      {
        ...baseRecordings[1],
        status: UploadStatus.Completed,
        progress: 100,
      },
      {
        ...baseRecordings[2],
        status: UploadStatus.Queued,
        progress: 0,
      },
    ],
  },
};

export const Mixed: Story = {
  args: {
    recordings: [
      {
        ...baseRecordings[0],
        status: UploadStatus.Completed,
        progress: 100,
      },
      {
        ...baseRecordings[1],
        status: UploadStatus.Failed,
        progress: 35,
        errorMessage: 'Network error occurred during upload',
      },
      {
        ...baseRecordings[2],
        status: UploadStatus.Uploading,
        progress: 60,
      },
    ],
  },
};

export const AllCompleted: Story = {
  args: {
    recordings: baseRecordings.map(rec => ({
      ...rec,
      status: UploadStatus.Completed,
      progress: 100,
    })),
  },
};

export const AllFailed: Story = {
  args: {
    recordings: baseRecordings.map(rec => ({
      ...rec,
      status: UploadStatus.Failed,
      progress: Math.floor(Math.random() * 80),
      errorMessage: 'Upload failed',
    })),
  },
}; 
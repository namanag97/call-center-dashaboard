import type { Meta, StoryObj } from '@storybook/react';
import { FileItem } from './FileItem';
import { UploadStatus } from '@conista/shared-types';

const meta: Meta<typeof FileItem> = {
  component: FileItem,
  title: 'Upload/FileItem',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onRemove: { action: 'remove' },
    onRetry: { action: 'retry' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '500px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FileItem>;

// Base recording for all stories
const baseRecording = {
  id: 'file-1',
  fileName: 'recording-20230615.mp3',
  fileSize: 3 * 1024 * 1024, // 3 MB
  fileType: 'audio/mp3',
  progress: 0,
  addedAt: new Date().toISOString(),
};

export const Queued: Story = {
  args: {
    recording: {
      ...baseRecording,
      status: UploadStatus.Queued,
    },
  },
};

export const Uploading: Story = {
  args: {
    recording: {
      ...baseRecording,
      status: UploadStatus.Uploading,
      progress: 45,
    },
  },
};

export const Completed: Story = {
  args: {
    recording: {
      ...baseRecording,
      status: UploadStatus.Completed,
      progress: 100,
      completedAt: new Date().toISOString(),
    },
  },
};

export const Failed: Story = {
  args: {
    recording: {
      ...baseRecording,
      status: UploadStatus.Failed,
      progress: 68,
      errorMessage: 'Network error: Connection reset by peer',
    },
  },
};

export const Paused: Story = {
  args: {
    recording: {
      ...baseRecording,
      status: UploadStatus.Paused,
      progress: 32,
    },
  },
};

export const Cancelled: Story = {
  args: {
    recording: {
      ...baseRecording,
      status: UploadStatus.Cancelled,
      progress: 0,
    },
  },
};

export const WithLongFilename: Story = {
  args: {
    recording: {
      ...baseRecording,
      fileName: 'very-long-file-name-that-should-be-truncated-with-ellipsis-customer-call-2023-06-15-conversation-with-john-doe.mp3',
      status: UploadStatus.Queued,
    },
  },
};

export const Disabled: Story = {
  args: {
    recording: {
      ...baseRecording,
      status: UploadStatus.Queued,
    },
    disabled: true,
  },
}; 
import type { Meta, StoryObj } from '@storybook/react';
import { FileList } from './FileList';
import { UploadStatus } from '@conista/shared-types';

const meta: Meta<typeof FileList> = {
  component: FileList,
  title: 'Upload/FileList',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onRemoveFile: { action: 'removeFile' },
    onRetryFile: { action: 'retryFile' },
  },
  decorators: [
    (Story) => (
      <div style={{ width: '600px' }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof FileList>;

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

export const Empty: Story = {
  args: {
    recordings: [],
  },
};

export const EmptyWithCustomMessage: Story = {
  args: {
    recordings: [],
    emptyMessage: 'Drop or select files to begin uploading',
  },
};

export const WithMultipleFiles: Story = {
  args: {
    recordings: sampleRecordings,
  },
};

export const OnlyQueuedFiles: Story = {
  args: {
    recordings: sampleRecordings.filter(r => r.status === UploadStatus.Queued),
  },
};

export const OnlyUploadingFiles: Story = {
  args: {
    recordings: sampleRecordings.filter(r => r.status === UploadStatus.Uploading),
  },
};

export const OnlyCompletedFiles: Story = {
  args: {
    recordings: sampleRecordings.filter(r => r.status === UploadStatus.Completed),
  },
};

export const OnlyFailedFiles: Story = {
  args: {
    recordings: sampleRecordings.filter(r => r.status === UploadStatus.Failed),
  },
};

export const DisabledList: Story = {
  args: {
    recordings: sampleRecordings,
    disabled: true,
  },
}; 
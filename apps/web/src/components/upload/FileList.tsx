import React from 'react';
import { CallRecording } from '@conista/shared-types';
import { FileItem } from './FileItem';

/**
 * Props for the FileList component
 */
interface FileListProps {
  /**
   * Array of call recordings to display
   */
  recordings: CallRecording[];
  /**
   * Called when a file should be removed
   */
  onRemoveFile?: (id: string) => void;
  /**
   * Called when a file upload should be retried
   */
  onRetryFile?: (id: string) => void;
  /**
   * Whether the component is in a disabled state
   */
  disabled?: boolean;
  /**
   * Custom class name
   */
  className?: string;
  /**
   * Custom empty state message
   */
  emptyMessage?: string;
}

/**
 * Component to display a list of files in the upload queue
 */
export const FileList: React.FC<FileListProps> = ({
  recordings,
  onRemoveFile,
  onRetryFile,
  disabled = false,
  className = '',
  emptyMessage = 'No files selected',
}) => {
  if (recordings.length === 0) {
    return (
      <div 
        className={`
          p-4 text-center border rounded-lg bg-gray-50 text-gray-500 text-sm
          ${className}
        `}
        data-testid="file-list-empty"
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div 
      className={`space-y-3 ${className}`}
      data-testid="file-list"
    >
      {recordings.map((recording) => (
        <FileItem
          key={recording.id}
          recording={recording}
          onRemove={onRemoveFile}
          onRetry={onRetryFile}
          disabled={disabled}
        />
      ))}
    </div>
  );
}; 
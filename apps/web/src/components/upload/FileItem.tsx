import React from 'react';
import { CallRecording, UploadStatus } from 'shared-types';
import { Button } from '../ui';
import ProgressBar from '../ui/ProgressBar';

/**
 * Props for the FileItem component
 */
interface FileItemProps {
  /**
   * The file recording data
   */
  recording: CallRecording;
  /**
   * Called when the file should be removed
   */
  onRemove?: (id: string) => void;
  /**
   * Called when the file should be retried (after error)
   */
  onRetry?: (id: string) => void;
  /**
   * Whether the component is in a disabled state
   */
  disabled?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Formats file size for display (e.g., 1.5 MB, 900 KB)
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

/**
 * Component to display information about a file in the upload queue
 */
export const FileItem: React.FC<FileItemProps> = ({
  recording,
  onRemove,
  onRetry,
  disabled = false,
  className = '',
}) => {
  // Get icon and status text based on current status
  const getStatusInfo = () => {
    switch (recording.status) {
      case UploadStatus.Queued:
        return {
          icon: (
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          ),
          text: 'Queued',
          color: 'text-gray-500',
        };
      case UploadStatus.Uploading:
        return {
          icon: (
            <svg className="w-5 h-5 text-blue-500 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12" />
            </svg>
          ),
          text: 'Uploading',
          color: 'text-blue-500',
        };
      case UploadStatus.Completed:
        return {
          icon: (
            <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ),
          text: 'Completed',
          color: 'text-green-500',
        };
      case UploadStatus.Failed:
        return {
          icon: (
            <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          text: 'Failed',
          color: 'text-red-500',
        };
      case UploadStatus.Paused:
        return {
          icon: (
            <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ),
          text: 'Paused',
          color: 'text-yellow-500',
        };
      case UploadStatus.Cancelled:
        return {
          icon: (
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ),
          text: 'Cancelled',
          color: 'text-gray-500',
        };
      default:
        return {
          icon: null,
          text: 'Unknown',
          color: 'text-gray-500',
        };
    }
  };
  
  const { icon, text, color } = getStatusInfo();
  
  // Determine if we should show progress bar
  const showProgress = recording.status === UploadStatus.Uploading;
  
  // Determine if we should show remove button
  const showRemoveButton = 
    recording.status === UploadStatus.Queued || 
    recording.status === UploadStatus.Paused || 
    recording.status === UploadStatus.Completed || 
    recording.status === UploadStatus.Cancelled;
  
  // Determine if we should show retry button
  const showRetryButton = recording.status === UploadStatus.Failed;
  
  // Get file extension
  const getFileExtension = (fileName: string) => {
    return fileName.slice(((fileName.lastIndexOf(".") - 1) >>> 0) + 2).toUpperCase();
  };
  
  // File type icon based on extension
  const renderFileTypeIcon = () => {
    const extension = getFileExtension(recording.fileName);
    
    return (
      <div className="flex items-center justify-center w-10 h-10 bg-gray-100 rounded-md">
        <span className="text-xs font-medium text-gray-500">{extension}</span>
      </div>
    );
  };
  
  return (
    <div 
      className={`
        border rounded-lg p-4 flex flex-col gap-3 bg-white
        ${disabled ? 'opacity-60' : ''}
        ${className}
      `}
      data-testid="file-item"
    >
      <div className="flex items-center gap-3">
        {/* File type icon */}
        {renderFileTypeIcon()}
        
        {/* File details */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 truncate" title={recording.fileName}>
            {recording.fileName}
          </h4>
          <p className="text-xs text-gray-500 flex items-center gap-1">
            <span>{formatFileSize(recording.fileSize)}</span>
            <span>•</span>
            <span className={color}>{text}</span>
          </p>
        </div>
        
        {/* Status icon */}
        <div className="flex items-center">
          {icon}
        </div>
        
        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {showRetryButton && onRetry && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRetry(recording.id)}
              disabled={disabled}
              aria-label="Retry upload"
            >
              Retry
            </Button>
          )}
          
          {showRemoveButton && onRemove && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onRemove(recording.id)}
              disabled={disabled}
              aria-label="Remove file"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </Button>
          )}
        </div>
      </div>
      
      {/* Error message */}
      {recording.status === UploadStatus.Failed && recording.errorMessage && (
        <p className="text-xs text-red-500 mt-1">
          {recording.errorMessage}
        </p>
      )}
      
      {/* Progress bar */}
      {showProgress && (
        <ProgressBar 
          value={recording.progress} 
          max={100}
          size="sm"
          showValue
          className="mt-1"
        />
      )}
    </div>
  );
}; 
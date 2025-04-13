import React from 'react';
import { CallRecording, UploadStatus } from '@conista/shared-types';
import ProgressBar from '../ui/ProgressBar';

/**
 * Props for the BatchUploadStatus component
 */
interface BatchUploadStatusProps {
  /**
   * Array of recordings being uploaded
   */
  recordings: CallRecording[];
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Calculate batch statistics
 */
const calculateBatchStats = (recordings: CallRecording[]) => {
  const total = recordings.length;
  const completed = recordings.filter(rec => rec.status === UploadStatus.Completed).length;
  const failed = recordings.filter(rec => rec.status === UploadStatus.Failed).length;
  const inProgress = recordings.filter(rec => 
    rec.status === UploadStatus.Uploading || rec.status === UploadStatus.Queued
  ).length;
  
  // Calculate overall progress
  const totalProgress = recordings.reduce((sum, rec) => sum + rec.progress, 0);
  const overallProgress = Math.round(totalProgress / total);
  
  return {
    total,
    completed,
    failed,
    inProgress,
    overallProgress,
    allCompleted: completed === total,
    anyFailed: failed > 0
  };
};

/**
 * Component to display batch upload status and progress
 */
export const BatchUploadStatus: React.FC<BatchUploadStatusProps> = ({
  recordings,
  className = '',
}) => {
  // No recordings, nothing to show
  if (recordings.length === 0) return null;
  
  // Calculate batch statistics
  const stats = calculateBatchStats(recordings);
  
  // Get appropriate status message and color
  let statusMessage = '';
  let statusColor = '';
  
  if (stats.allCompleted) {
    statusMessage = 'All uploads completed successfully';
    statusColor = 'text-green-600';
  } else if (stats.anyFailed && stats.inProgress === 0) {
    statusMessage = 'Some uploads failed';
    statusColor = 'text-red-600';
  } else if (stats.inProgress > 0) {
    statusMessage = 'Uploading...';
    statusColor = 'text-blue-600';
  } else {
    statusMessage = 'Ready to upload';
    statusColor = 'text-gray-600';
  }
  
  return (
    <div className={`p-4 bg-white rounded-lg border ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <h3 className={`font-medium ${statusColor}`}>{statusMessage}</h3>
        <div className="text-sm text-gray-500">
          {stats.completed} of {stats.total} completed
          {stats.failed > 0 && ` (${stats.failed} failed)`}
        </div>
      </div>
      
      <ProgressBar 
        value={stats.overallProgress} 
        max={100}
        size="md"
        showValue
        className="mb-2"
      />
      
      <div className="flex justify-between text-xs text-gray-500 mt-1">
        <div>Files: {stats.total}</div>
        <div>Progress: {stats.overallProgress}%</div>
      </div>
    </div>
  );
};

export default BatchUploadStatus; 
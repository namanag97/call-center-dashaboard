import React, { useState, useCallback } from 'react';
import { CallRecording, UploadMetadata, UploadStatus } from '@conista/shared-types';
import { CallUploader } from './CallUploader';
import { MetadataForm } from './MetadataForm';
import { Button } from '../ui';
import { uploadService } from '../../services/uploadService';
import BatchUploadStatus from './BatchUploadStatus';

/**
 * Page for uploading call recordings
 */
const UploadPage: React.FC = () => {
  // State for selected recordings
  const [recordings, setRecordings] = useState<CallRecording[]>([]);
  
  // State for current step (files or metadata)
  const [step, setStep] = useState<'files' | 'metadata'>('files');
  
  // State for selected recording to add metadata to
  const [currentRecordingIndex, setCurrentRecordingIndex] = useState(0);
  
  // State for upload in progress
  const [isUploading, setIsUploading] = useState(false);
  
  // Sample agent options - would come from API in real implementation
  const agentOptions = [
    { id: '1', name: 'John Anderson' },
    { id: '2', name: 'Maria Rodriguez' },
    { id: '3', name: 'David Smith' },
  ];
  
  // Sample category options - would come from API in real implementation
  const categoryOptions = [
    'Sales', 'Support', 'Complaint', 'Inquiry', 'Follow-up'
  ];
  
  // Sample tag options - would come from API in real implementation
  const tagOptions = [
    'Important', 'Urgent', 'VIP', 'Escalated', 'Resolved', 'Pending'
  ];

  /**
   * Handle files selected
   */
  const handleFilesSelected = useCallback((newRecordings: CallRecording[]) => {
    setRecordings(prev => [...prev, ...newRecordings]);
  }, []);

  /**
   * Handle file removal
   */
  const handleRemoveFile = useCallback((id: string) => {
    setRecordings(prev => prev.filter(rec => rec.id !== id));
  }, []);

  /**
   * Handle file retry
   */
  const handleRetryFile = useCallback((id: string) => {
    setRecordings(prev => 
      prev.map(rec => 
        rec.id === id 
          ? { ...rec, status: UploadStatus.Queued, progress: 0, errorMessage: undefined } 
          : rec
      )
    );
  }, []);

  /**
   * Get current recording
   */
  const currentRecording = recordings[currentRecordingIndex];

  /**
   * Handle metadata submission
   */
  const handleMetadataSubmit = useCallback((metadata: UploadMetadata) => {
    // Update the current recording with metadata
    setRecordings(prev => 
      prev.map((rec, index) => 
        index === currentRecordingIndex 
          ? { ...rec, metadata } 
          : rec
      )
    );
    
    // Move to next recording or back to files if all done
    if (currentRecordingIndex < recordings.length - 1) {
      setCurrentRecordingIndex(prev => prev + 1);
    } else {
      // All recordings have metadata, start upload
      setStep('files');
      startUpload();
    }
  }, [currentRecordingIndex, recordings]);

  /**
   * Handle cancel metadata
   */
  const handleCancelMetadata = useCallback(() => {
    setStep('files');
  }, []);

  /**
   * Start metadata entry
   */
  const handleStartMetadata = useCallback(() => {
    if (recordings.length > 0) {
      setCurrentRecordingIndex(0);
      setStep('metadata');
    }
  }, [recordings]);

  /**
   * Handle status change for a file
   */
  const handleStatusChange = useCallback((id: string, status: UploadStatus, error?: string) => {
    setRecordings(prev => 
      prev.map(rec => 
        rec.id === id 
          ? { 
              ...rec, 
              status, 
              errorMessage: error,
              completedAt: status === UploadStatus.Completed ? new Date().toISOString() : rec.completedAt
            } 
          : rec
      )
    );
  }, []);

  /**
   * Handle progress update for a file
   */
  const handleProgressUpdate = useCallback((id: string, progress: number) => {
    setRecordings(prev => 
      prev.map(rec => 
        rec.id === id ? { ...rec, progress } : rec
      )
    );
  }, []);

  /**
   * Start uploading files
   */
  const startUpload = useCallback(() => {
    if (recordings.length === 0) return;
    
    // Find recordings with metadata that aren't already completed
    const recordingsToUpload = recordings.filter(
      rec => rec.metadata && rec.status !== UploadStatus.Completed
    );
    
    if (recordingsToUpload.length === 0) return;
    
    setIsUploading(true);
    
    // Mark selected recordings as queued
    setRecordings(prev => 
      prev.map(rec => 
        recordingsToUpload.some(r => r.id === rec.id) ? {
          ...rec,
          status: UploadStatus.Queued,
          progress: 0
        } : rec
      )
    );
    
    // Start the upload
    uploadService.uploadFiles(
      recordingsToUpload,
      handleStatusChange,
      handleProgressUpdate,
      () => {
        setIsUploading(false);
      }
    ).catch(error => {
      console.error('Error uploading files:', error);
      setIsUploading(false);
    });
  }, [recordings, handleStatusChange, handleProgressUpdate]);

  // Calculate overall progress
  const overallProgress = React.useMemo(() => {
    if (recordings.length === 0) return 0;
    
    const totalProgress = recordings.reduce((sum, rec) => sum + rec.progress, 0);
    return Math.round(totalProgress / recordings.length);
  }, [recordings]);

  // Determine if all recordings have been processed
  const allCompleted = React.useMemo(() => {
    return recordings.length > 0 && recordings.every(rec => rec.status === UploadStatus.Completed);
  }, [recordings]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Upload Call Recordings</h1>
      
      {step === 'files' ? (
        <>
          <CallUploader 
            onFilesSelected={handleFilesSelected}
            recordings={recordings}
            onRemoveFile={handleRemoveFile}
            onRetryFile={handleRetryFile}
            disabled={isUploading}
          />
          
          {recordings.length > 0 && !recordings.every(r => r.metadata) && !isUploading && (
            <div className="mt-4 flex justify-end">
              <Button 
                variant="primary" 
                onClick={handleStartMetadata}
              >
                Add Metadata
              </Button>
            </div>
          )}
          
          {!isUploading && recordings.length > 0 && recordings.some(r => r.metadata && r.status !== UploadStatus.Completed) && (
            <div className="mt-4 flex justify-end">
              <Button 
                variant="primary" 
                onClick={startUpload}
                isLoading={isUploading}
              >
                {isUploading ? `Uploading (${overallProgress}%)` : 'Start Upload'}
              </Button>
            </div>
          )}
          
          {recordings.length > 0 && (
            <BatchUploadStatus 
              recordings={recordings}
              className="mt-4"
            />
          )}
          
          {allCompleted && (
            <div className="mt-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200">
              <p className="font-medium">All uploads completed successfully!</p>
              <p className="text-sm mt-1">Your call recordings are now being processed and will be available in the calls list shortly.</p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white p-6 rounded-lg border">
          <h2 className="text-lg font-semibold mb-4">
            Enter Metadata for {currentRecording?.fileName}
          </h2>
          
          <MetadataForm
            initialValues={currentRecording?.metadata}
            onSubmit={handleMetadataSubmit}
            onCancel={handleCancelMetadata}
            agentOptions={agentOptions}
            categoryOptions={categoryOptions}
            tagOptions={tagOptions}
          />
        </div>
      )}
    </div>
  );
};

export default UploadPage; 
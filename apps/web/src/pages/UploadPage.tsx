import React, { useState } from 'react';
import { useUploadStore } from '../store';
import { Alert, Button } from '../components/ui';
import { CallUploader } from '../components/upload/CallUploader';

// Define the interface to match what CallUploader expects
interface CallRecording {
  id: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  status: string;
  progress: number;
  addedAt: string;
  file: File;
}

// Define the interface for the files in our store
interface UploadFile {
  id?: string;
  name: string;
  size: number;
  type: string;
  status?: string;
  progress?: number;
  addedAt?: string;
}

/**
 * Upload page for audio files
 */
const UploadPage: React.FC = () => {
  const { 
    files, 
    overallStatus, 
    error, 
    addFiles,
    startUpload,
    clearCompleted
  } = useUploadStore();
  
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  // Handle file selection
  const handleFilesSelected = (recordings: CallRecording[]) => {
    // Convert CallRecording objects to File objects if needed for the store
    const selectedFiles = recordings.map(recording => recording.file);
    addFiles(selectedFiles);
    setUploadSuccess(false);
  };

  // Start the upload process
  const handleUpload = async () => {
    try {
      await startUpload(files);
      setUploadSuccess(true);
    } catch (err) {
      // Error is handled by the store
      setUploadSuccess(false);
    }
  };

  // Clear completed uploads
  const handleClearCompleted = () => {
    clearCompleted();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Upload Calls</h1>
        <p className="text-gray-600">Upload audio files for transcription and analysis</p>
      </div>

      {error && (
        <Alert status="error" className="mb-4">
          {error}
        </Alert>
      )}

      {uploadSuccess && (
        <Alert status="success" className="mb-4">
          Files uploaded successfully!
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden p-6">
        <CallUploader 
          onFilesSelected={handleFilesSelected}
          recordings={files.map((file: UploadFile) => ({
            id: file.id || `file-${file.name}`,
            fileName: file.name,
            fileSize: file.size,
            fileType: file.type,
            status: file.status || 'queued',
            progress: file.progress || 0,
            addedAt: file.addedAt || new Date().toISOString(),
            file: file as unknown as File
          }))}
          disabled={overallStatus === 'uploading'}
        />
        
        <div className="mt-6 flex flex-wrap gap-4">
          <Button 
            onClick={handleUpload}
            disabled={files.length === 0 || overallStatus === 'uploading'}
            isLoading={overallStatus === 'uploading'}
          >
            Upload Files
          </Button>
          
          <Button 
            variant="secondary"
            onClick={handleClearCompleted}
            disabled={files.length === 0 || overallStatus === 'uploading'}
          >
            Clear Completed
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UploadPage; 
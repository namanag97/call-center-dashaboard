import { 
  CallRecording, 
  UploadStatus, 
  UploadMetadata, 
  UploadInitiateResponse, 
  UploadCompleteResponse
} from '@conista/shared-types';

/**
 * Progress callback function type
 */
type ProgressCallback = (id: string, progress: number) => void;

/**
 * Status callback function type
 */
type StatusCallback = (id: string, status: UploadStatus, error?: string) => void;

/**
 * Upload service for handling file uploads
 */
class UploadService {
  private readonly baseUrl: string;
  
  constructor(baseUrl = '/api') {
    this.baseUrl = baseUrl;
  }
  
  /**
   * Get upload constraints from the server
   */
  async getConstraints() {
    const response = await fetch(`${this.baseUrl}/uploads/constraints`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch upload constraints');
    }
    
    const data = await response.json();
    return data.data;
  }
  
  /**
   * Initiate an upload for a file
   */
  private async initiateUpload(fileName: string, fileSize: number, fileType: string): Promise<UploadInitiateResponse> {
    const response = await fetch(`${this.baseUrl}/uploads/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName,
        fileSize,
        fileType
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to initiate upload');
    }
    
    return await response.json();
  }
  
  /**
   * Complete an upload with metadata
   */
  private async completeUpload(uploadId: string, metadata: UploadMetadata): Promise<UploadCompleteResponse> {
    const response = await fetch(`${this.baseUrl}/uploads/complete`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        uploadId,
        metadata
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Failed to complete upload');
    }
    
    return await response.json();
  }
  
  /**
   * Upload a file to the storage service
   */
  private async uploadFileToStorage(
    uploadUrl: string, 
    file: File, 
    expectedHeaders: Record<string, string>,
    onProgress: (progress: number) => void
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      
      // Track upload progress
      xhr.upload.addEventListener('progress', (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          onProgress(progress);
        }
      });
      
      // Handle completion
      xhr.addEventListener('load', () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve();
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      });
      
      // Handle errors
      xhr.addEventListener('error', () => {
        reject(new Error('Network error during upload'));
      });
      
      xhr.addEventListener('abort', () => {
        reject(new Error('Upload was aborted'));
      });
      
      // Open connection and set headers
      xhr.open('PUT', uploadUrl);
      
      // Set headers from expected headers
      Object.entries(expectedHeaders).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
      
      // Send the file
      xhr.send(file);
    });
  }
  
  /**
   * Upload a single file with metadata
   */
  async uploadFile(
    recording: CallRecording,
    onStatusChange: StatusCallback,
    onProgressUpdate: ProgressCallback
  ): Promise<string> {
    const { id, fileName, fileSize, fileType, metadata } = recording;
    
    // Validate required data
    if (!metadata) {
      throw new Error('Metadata is required for upload');
    }
    
    // Get original file from recording
    // @ts-expect-error - We added this in the CallUploader component
    const file = recording.file as File;
    if (!file) {
      throw new Error('Original file not found in recording');
    }
    
    try {
      // Update status to uploading
      onStatusChange(id, UploadStatus.Uploading);
      
      // Step 1: Initiate the upload to get pre-signed URL
      const initResponse = await this.initiateUpload(fileName, fileSize, fileType);
      
      // Step 2: Upload the file to storage with progress tracking
      await this.uploadFileToStorage(
        initResponse.uploadUrl, 
        file, 
        initResponse.expectedHeaders || {},
        (progress) => onProgressUpdate(id, progress)
      );
      
      // Step 3: Complete the upload with metadata
      const completeResponse = await this.completeUpload(initResponse.uploadId, metadata);
      
      // Update status to completed
      onStatusChange(id, UploadStatus.Completed);
      
      // Return the new call ID
      return completeResponse.callId;
    } catch (error) {
      // Update status to failed
      onStatusChange(id, UploadStatus.Failed, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }
  
  /**
   * Upload multiple files in sequence
   */
  async uploadFiles(
    recordings: CallRecording[],
    onStatusChange: StatusCallback,
    onProgressUpdate: ProgressCallback,
    onComplete?: (callIds: string[]) => void
  ): Promise<string[]> {
    const callIds: string[] = [];
    
    // Process each file in sequence
    for (const recording of recordings) {
      try {
        const callId = await this.uploadFile(recording, onStatusChange, onProgressUpdate);
        callIds.push(callId);
      } catch (error) {
        console.error('Error uploading file:', recording.fileName, error);
        // Continue with next file
      }
    }
    
    // Call complete callback if provided
    if (onComplete) {
      onComplete(callIds);
    }
    
    return callIds;
  }
}

// Export singleton instance
export const uploadService = new UploadService();

// Also export the class for testing or custom instances
export default UploadService; 
/**
 * Type definitions for call upload functionality
 */

/**
 * Status of an upload
 */
export enum UploadStatus {
  /**
   * File is queued for upload
   */
  Queued = 'queued',
  /**
   * File is currently uploading
   */
  Uploading = 'uploading',
  /**
   * File upload is paused
   */
  Paused = 'paused',
  /**
   * File upload has completed successfully
   */
  Completed = 'completed',
  /**
   * File upload has failed
   */
  Failed = 'failed',
  /**
   * File has been cancelled from upload queue
   */
  Cancelled = 'cancelled'
}

/**
 * Metadata for call recording
 */
export interface UploadMetadata {
  /**
   * Call title
   */
  title: string;
  /**
   * Date of the call
   */
  date: string;
  /**
   * Agent ID
   */
  agentId: string;
  /**
   * Customer ID (optional)
   */
  customerId?: string;
  /**
   * Customer name (optional)
   */
  customerName?: string;
  /**
   * Call categories (optional)
   */
  categories?: string[];
  /**
   * Call tags (optional)
   */
  tags?: string[];
  /**
   * Additional notes (optional)
   */
  notes?: string;
}

/**
 * Information about a call recording file to be uploaded
 */
export interface CallRecording {
  /**
   * Unique identifier for the upload (client-generated)
   */
  id: string;
  /**
   * Original file name
   */
  fileName: string;
  /**
   * File size in bytes
   */
  fileSize: number;
  /**
   * File MIME type
   */
  fileType: string;
  /**
   * Current upload status
   */
  status: UploadStatus;
  /**
   * Upload progress percentage (0-100)
   */
  progress: number;
  /**
   * Error message if upload failed
   */
  errorMessage?: string;
  /**
   * When the file was added to the upload queue
   */
  addedAt: string;
  /**
   * When the file upload completed (if applicable)
   */
  completedAt?: string;
  /**
   * Call metadata
   */
  metadata?: UploadMetadata;
}

/**
 * Response from upload initiation endpoint
 */
export interface UploadInitiateResponse {
  /**
   * Upload ID from server
   */
  uploadId: string;
  /**
   * Pre-signed URL for uploading
   */
  uploadUrl: string;
  /**
   * Metadata for the expected request
   */
  expectedHeaders?: Record<string, string>;
  /**
   * Time when the upload URL expires
   */
  expiresAt?: string;
}

/**
 * Response after upload is complete
 */
export interface UploadCompleteResponse {
  /**
   * Call ID of the newly created call
   */
  callId: string;
  /**
   * Status of the call
   */
  status: string;
  /**
   * Expected time for processing to complete
   */
  processingEstimate?: string;
}

/**
 * Batch upload status
 */
export interface BatchUploadStatus {
  /**
   * Total number of files being uploaded
   */
  total: number;
  /**
   * Number of files successfully uploaded
   */
  completed: number;
  /**
   * Number of files with failed uploads
   */
  failed: number;
  /**
   * Overall progress percentage
   */
  overallProgress: number;
}

/**
 * File validation result
 */
export interface FileValidationResult {
  /**
   * Whether the file is valid
   */
  isValid: boolean;
  /**
   * Error message if file is invalid
   */
  errorMessage?: string;
}

/**
 * Constraints for file uploads
 */
export interface UploadConstraints {
  /**
   * Maximum file size in bytes
   */
  maxFileSize: number;
  /**
   * Allowed file types (MIME types)
   */
  allowedFileTypes: string[];
  /**
   * Maximum number of files in a batch upload
   */
  maxFilesPerBatch: number;
} 
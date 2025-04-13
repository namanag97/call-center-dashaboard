import React, { useState, useRef, useCallback } from 'react';
import { 
  CallRecord, 
  UploadStatus, 
  FileValidationResult, 
  UploadConstraints 
} from 'shared-types';
import { Button } from '../ui';
import { FileList } from './FileList';

// Default upload constraints
const DEFAULT_CONSTRAINTS: UploadConstraints = {
  maxFileSize: 50 * 1024 * 1024, // 50 MB
  allowedFileTypes: ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg'],
  maxFilesPerBatch: 10
};

/**
 * Props for the CallUploader component
 */
interface CallUploaderProps {
  /**
   * Called when files are selected
   */
  onFilesSelected: (recordings: CallRecord[]) => void;
  /**
   * Current list of recordings
   */
  recordings?: CallRecord[];
  /**
   * Called when a file should be removed
   */
  onRemoveFile?: (id: string) => void;
  /**
   * Called when a file upload should be retried
   */
  onRetryFile?: (id: string) => void;
  /**
   * Custom file validation function
   */
  validateFile?: (file: File) => FileValidationResult;
  /**
   * Upload constraints
   */
  constraints?: Partial<UploadConstraints>;
  /**
   * Whether the uploader is disabled
   */
  disabled?: boolean;
  /**
   * Custom class name
   */
  className?: string;
}

/**
 * Component for selecting and uploading call recordings
 */
export const CallUploader: React.FC<CallUploaderProps> = ({
  onFilesSelected,
  recordings = [],
  onRemoveFile,
  onRetryFile,
  validateFile,
  constraints: customConstraints,
  disabled = false,
  className = '',
}) => {
  // Merge default constraints with custom constraints
  const constraints = {
    ...DEFAULT_CONSTRAINTS,
    ...customConstraints,
  };

  // File input reference
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State for drag-and-drop
  const [isDragging, setIsDragging] = useState(false);
  
  /**
   * Default file validation function
   */
  const defaultValidateFile = (file: File): FileValidationResult => {
    // Check file size
    if (file.size > constraints.maxFileSize) {
      return {
        isValid: false,
        errorMessage: `File is too large. Maximum size is ${Math.round(constraints.maxFileSize / (1024 * 1024))} MB.`
      };
    }
    
    // Check file type
    if (!constraints.allowedFileTypes.includes(file.type)) {
      return {
        isValid: false,
        errorMessage: `Invalid file type. Allowed types: ${constraints.allowedFileTypes.map((type: string) => type.replace('audio/', '')).join(', ')}`
      };
    }
    
    return { isValid: true };
  };
  
  /**
   * Process files selected by the user
   */
  const processFiles = useCallback((files: FileList | File[]) => {
    if (disabled) return;
    
    const fileArray = Array.from(files);
    
    // Enforce max files per batch
    if (fileArray.length > constraints.maxFilesPerBatch) {
      alert(`You can only upload ${constraints.maxFilesPerBatch} files at once.`);
      return;
    }
    
    // Convert files to CallRecording objects and validate
    const newRecordings: CallRecord[] = [];
    const invalidFiles: { file: File, error: string }[] = [];
    
    fileArray.forEach((file) => {
      // Validate file
      const validationResult = validateFile ? validateFile(file) : defaultValidateFile(file);
      
      if (!validationResult.isValid) {
        invalidFiles.push({ file, error: validationResult.errorMessage || 'Invalid file' });
        return;
      }
      
      // Create CallRecording object
      const recording: CallRecord = {
        id: `recording-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        status: UploadStatus.Queued,
        progress: 0,
        addedAt: new Date().toISOString(),
        // Original file isn't part of the type, but we need it for uploading
        // @ts-expect-error
        file
      };
      
      newRecordings.push(recording);
    });
    
    // Alert about invalid files
    if (invalidFiles.length > 0) {
      const messages = invalidFiles.map((item) => `${item.file.name}: ${item.error}`);
      alert(`Some files could not be added:\n${messages.join('\n')}`);
    }
    
    // Call the callback with valid recordings
    if (newRecordings.length > 0) {
      onFilesSelected(newRecordings);
    }
  }, [onFilesSelected, validateFile, defaultValidateFile, constraints.maxFilesPerBatch, disabled]);
  
  /**
   * Handle file input change
   */
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      processFiles(event.target.files);
      // Reset the input value so the same file can be selected again
      event.target.value = '';
    }
  }, [processFiles]);
  
  /**
   * Handle click on the uploader area
   */
  const handleClick = useCallback(() => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, [disabled]);
  
  /**
   * Handle drag events
   */
  const handleDrag = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled) return;
    
    if (event.type === 'dragenter' || event.type === 'dragover') {
      setIsDragging(true);
    } else if (event.type === 'dragleave' || event.type === 'drop') {
      setIsDragging(false);
    }
  }, [disabled]);
  
  /**
   * Handle drop event
   */
  const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    
    if (disabled) return;
    
    setIsDragging(false);
    
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      processFiles(event.dataTransfer.files);
    }
  }, [processFiles, disabled]);
  
  /**
   * Create a formatted string of allowed file extensions
   */
  const formattedAllowedTypes = constraints.allowedFileTypes
    .map((type: string) => type.replace('audio/', '.'))
    .join(', ');
  
  return (
    <div className={`space-y-4 ${className}`}>
      <div 
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}
        `}
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        data-testid="call-uploader"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={constraints.allowedFileTypes.join(',')}
          onChange={handleFileChange}
          multiple
          className="hidden"
          disabled={disabled}
          data-testid="file-input"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {/* Upload icon */}
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3-3m0 0l3 3m-3-3v12"
            />
          </svg>
          
          <h3 className="text-lg font-medium text-gray-700">
            Drag and drop audio files here
          </h3>
          
          <p className="text-sm text-gray-500">
            {`or click to select files (${formattedAllowedTypes})`}
          </p>
          
          <p className="text-xs text-gray-400">
            {`Maximum file size: ${Math.round(constraints.maxFileSize / (1024 * 1024))} MB`}
          </p>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleClick}
            disabled={disabled}
          >
            Select Files
          </Button>
        </div>
      </div>
      
      {/* File list */}
      {recordings.length > 0 && (
        <FileList
          recordings={recordings}
          onRemoveFile={onRemoveFile}
          onRetryFile={onRetryFile}
          disabled={disabled}
        />
      )}
    </div>
  );
}; 
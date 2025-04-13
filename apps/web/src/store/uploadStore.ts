import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CallRecording, UploadStatus, UploadInitiateResponse, UploadCompleteResponse } from 'shared-types';

// API endpoint
const API_URL = '/api/uploads';

// Define upload file state interface
export interface UploadFileState extends CallRecording {
  file?: File;
}

// Define upload store state interface
interface UploadStore {
  // State
  files: UploadFileState[];
  overallStatus: UploadStatus;
  error: string | null;
  isUploading: boolean;
  
  // Actions
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  updateFileMetadata: (id: string, metadata: Partial<UploadFileState>) => void;
  startUpload: () => Promise<void>;
  updateFileProgress: (id: string, progress: number) => void;
  updateFileStatus: (id: string, status: UploadStatus, errorMessage?: string) => void;
  clearCompleted: () => void;
  resetStore: () => void;
}

// Helper function to create a file entry
const createFileEntry = (file: File): UploadFileState => ({
  id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
  fileName: file.name,
  fileSize: file.size,
  fileType: file.type,
  status: UploadStatus.Queued,
  progress: 0,
  addedAt: new Date().toISOString(),
  file,
});

// Helper function to calculate overall upload status
const calculateOverallStatus = (files: UploadFileState[]): UploadStatus => {
  if (files.length === 0) return UploadStatus.Completed;
  
  if (files.some(file => file.status === UploadStatus.Uploading)) {
    return UploadStatus.Uploading;
  }
  
  if (files.some(file => file.status === UploadStatus.Failed)) {
    return UploadStatus.Failed;
  }
  
  if (files.every(file => file.status === UploadStatus.Completed)) {
    return UploadStatus.Completed;
  }
  
  if (files.some(file => file.status === UploadStatus.Paused)) {
    return UploadStatus.Paused;
  }
  
  return UploadStatus.Queued;
};

// Create the upload store
export const useUploadStore = create<UploadStore>()(
  devtools(
    (set, get) => ({
      // Initial state
      files: [],
      overallStatus: UploadStatus.Completed,
      error: null,
      isUploading: false,
      
      // Actions
      addFiles: (files: File[]) => {
        const fileEntries = files.map(createFileEntry);
        
        set(state => {
          const updatedFiles = [...state.files, ...fileEntries];
          return {
            files: updatedFiles,
            overallStatus: calculateOverallStatus(updatedFiles),
            error: null,
          };
        });
      },
      
      removeFile: (id: string) => {
        set(state => {
          const updatedFiles = state.files.filter(file => file.id !== id);
          return {
            files: updatedFiles,
            overallStatus: calculateOverallStatus(updatedFiles),
          };
        });
      },
      
      updateFileMetadata: (id: string, metadata: Partial<UploadFileState>) => {
        set(state => {
          const updatedFiles = state.files.map(file => 
            file.id === id ? { ...file, ...metadata } : file
          );
          return {
            files: updatedFiles,
          };
        });
      },
      
      startUpload: async () => {
        const { files } = get();
        const queuedFiles = files.filter(file => 
          file.status === UploadStatus.Queued || file.status === UploadStatus.Failed
        );
        
        if (queuedFiles.length === 0 || get().isUploading) {
          return;
        }
        
        set({ isUploading: true, error: null });
        
        // Process each file
        for (const fileState of queuedFiles) {
          if (!fileState.file) continue;
          
          try {
            // Start file upload
            get().updateFileStatus(fileState.id, UploadStatus.Uploading);
            
            // 1. Initiate upload
            const initiateResponse = await fetch(`${API_URL}/initiate`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fileName: fileState.fileName,
                fileSize: fileState.fileSize,
                fileType: fileState.fileType,
                metadata: fileState.metadata,
              }),
            });
            
            if (!initiateResponse.ok) {
              const errorData = await initiateResponse.json();
              throw new Error(errorData?.error?.message || 'Failed to initiate upload');
            }
            
            const initData: UploadInitiateResponse = await initiateResponse.json();
            
            // 2. Upload file with progress tracking
            await uploadFileWithProgress(
              fileState.file,
              initData.uploadUrl,
              initData.expectedHeaders || {},
              (progress) => get().updateFileProgress(fileState.id, progress)
            );
            
            // 3. Complete upload
            const completeResponse = await fetch(`${API_URL}/complete`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                uploadId: initData.uploadId,
                metadata: fileState.metadata,
              }),
            });
            
            if (!completeResponse.ok) {
              const errorData = await completeResponse.json();
              throw new Error(errorData?.error?.message || 'Failed to complete upload');
            }
            
            const completeData: UploadCompleteResponse = await completeResponse.json();
            
            // Update file status to completed
            get().updateFileStatus(fileState.id, UploadStatus.Completed);
            
            // Update file metadata with call ID
            get().updateFileMetadata(fileState.id, {
              metadata: {
                ...fileState.metadata,
                callId: completeData.callId,
              },
              completedAt: new Date().toISOString(),
            });
            
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Upload failed';
            get().updateFileStatus(fileState.id, UploadStatus.Failed, errorMessage);
          }
        }
        
        set(state => ({
          isUploading: false,
          overallStatus: calculateOverallStatus(state.files),
        }));
      },
      
      updateFileProgress: (id: string, progress: number) => {
        set(state => {
          const updatedFiles = state.files.map(file => 
            file.id === id ? { ...file, progress: Math.min(Math.max(0, progress), 100) } : file
          );
          return {
            files: updatedFiles,
          };
        });
      },
      
      updateFileStatus: (id: string, status: UploadStatus, errorMessage?: string) => {
        set(state => {
          const updatedFiles = state.files.map(file => 
            file.id === id 
              ? { 
                  ...file, 
                  status, 
                  errorMessage: status === UploadStatus.Failed ? (errorMessage || file.errorMessage) : undefined,
                  completedAt: status === UploadStatus.Completed ? new Date().toISOString() : file.completedAt,
                } 
              : file
          );
          
          return {
            files: updatedFiles,
            overallStatus: calculateOverallStatus(updatedFiles),
          };
        });
      },
      
      clearCompleted: () => {
        set(state => {
          const updatedFiles = state.files.filter(file => file.status !== UploadStatus.Completed);
          return {
            files: updatedFiles,
            overallStatus: calculateOverallStatus(updatedFiles),
          };
        });
      },
      
      resetStore: () => {
        set({
          files: [],
          overallStatus: UploadStatus.Completed,
          error: null,
          isUploading: false,
        });
      },
    }),
    {
      name: 'upload-store',
    }
  )
);

// Helper function to upload a file with progress tracking
async function uploadFileWithProgress(
  file: File,
  uploadUrl: string,
  headers: Record<string, string>,
  onProgress: (progress: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    
    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        onProgress(progress);
      }
    });
    
    xhr.addEventListener('load', () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        onProgress(100);
        resolve();
      } else {
        reject(new Error(`Upload failed with status ${xhr.status}`));
      }
    });
    
    xhr.addEventListener('error', () => {
      reject(new Error('Upload failed due to network error'));
    });
    
    xhr.addEventListener('abort', () => {
      reject(new Error('Upload was aborted'));
    });
    
    xhr.open('PUT', uploadUrl);
    
    // Set custom headers if provided
    for (const [key, value] of Object.entries(headers)) {
      xhr.setRequestHeader(key, value);
    }
    
    xhr.send(file);
  });
}

export default useUploadStore; 
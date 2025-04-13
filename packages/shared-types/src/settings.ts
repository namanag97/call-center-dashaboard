/**
 * Type definitions for settings functionality
 */

/**
 * API provider type
 */
export enum ProviderType {
  /**
   * Transcription provider
   */
  Transcription = 'transcription',
  /**
   * Analysis provider
   */
  Analysis = 'analysis',
  /**
   * Storage provider
   */
  Storage = 'storage'
}

/**
 * Provider configuration
 */
export interface Provider {
  /**
   * Unique identifier
   */
  id: string;
  /**
   * Display name
   */
  name: string;
  /**
   * Provider type
   */
  type: ProviderType;
  /**
   * Whether the provider is enabled
   */
  enabled: boolean;
  /**
   * API key or authentication token
   */
  apiKey?: string;
  /**
   * Additional configuration options
   */
  config?: Record<string, any>;
  /**
   * Last modified timestamp
   */
  updatedAt: string;
  /**
   * Created timestamp
   */
  createdAt: string;
  /**
   * Version for concurrency control
   */
  version: number;
}

/**
 * Analysis category
 */
export interface Category {
  /**
   * Unique identifier
   */
  id: string;
  /**
   * Display name
   */
  name: string;
  /**
   * Category description
   */
  description?: string;
  /**
   * Display order (for UI sorting)
   */
  order: number;
  /**
   * Whether the category is enabled
   */
  enabled: boolean;
  /**
   * Parent category ID (if nested)
   */
  parentId?: string;
  /**
   * Keywords for this category (for AI classification)
   */
  keywords?: string[];
  /**
   * Last modified timestamp
   */
  updatedAt: string;
  /**
   * Created timestamp
   */
  createdAt: string;
  /**
   * Version for concurrency control
   */
  version: number;
}

/**
 * System settings
 */
export interface SystemSettings {
  /**
   * Default transcription provider ID
   */
  defaultTranscriptionProviderId?: string;
  /**
   * Default analysis provider ID
   */
  defaultAnalysisProviderId?: string;
  /**
   * Default storage provider ID
   */
  defaultStorageProviderId?: string;
  /**
   * Maximum file size for uploads (in bytes)
   */
  maxUploadSize: number;
  /**
   * Allowed file types for uploads
   */
  allowedFileTypes: string[];
  /**
   * Maximum files per batch upload
   */
  maxFilesPerBatch: number;
  /**
   * Retention period for recordings (in days)
   */
  retentionPeriodDays: number;
  /**
   * Whether to enable automatic transcription
   */
  autoTranscribe: boolean;
  /**
   * Whether to enable automatic analysis
   */
  autoAnalyze: boolean;
  /**
   * Last modified timestamp
   */
  updatedAt: string;
  /**
   * Version for concurrency control
   */
  version: number;
}

/**
 * Settings update response
 */
export interface SettingsUpdateResponse {
  /**
   * Updated resource
   */
  data: Provider | Category | SystemSettings;
  /**
   * New version number
   */
  version: number;
}

/**
 * Concurrency error
 */
export interface ConcurrencyError {
  /**
   * Error code
   */
  code: 'VERSION_CONFLICT';
  /**
   * Error message
   */
  message: string;
  /**
   * Current server version
   */
  currentVersion: number;
  /**
   * Submitted version
   */
  submittedVersion: number;
  /**
   * Current data on server
   */
  currentData: Provider | Category | SystemSettings;
} 
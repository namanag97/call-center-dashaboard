/**
 * Provider type
 */
export type ProviderType = 'transcription' | 'analysis' | 'storage';

/**
 * Provider interface
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
   * API key
   */
  apiKey: string;
  /**
   * Custom API endpoint (optional)
   */
  apiEndpoint?: string;
  /**
   * Whether the provider is enabled
   */
  enabled: boolean;
}

/**
 * System settings interface
 */
export interface SystemSettings {
  /**
   * Maximum upload size in bytes
   */
  maxUploadSize: number;
  /**
   * Maximum files per batch
   */
  maxFilesPerBatch: number;
  /**
   * Allowed file types
   */
  allowedFileTypes: string[];
  /**
   * Default storage provider ID
   */
  defaultStorageProviderId?: string;
  /**
   * Default transcription provider ID
   */
  defaultTranscriptionProviderId?: string;
  /**
   * Default analysis provider ID
   */
  defaultAnalysisProviderId?: string;
}

/**
 * Settings service for managing application settings
 */
class SettingsService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = '/api/settings';
  }

  /**
   * Get system settings
   */
  async getSystemSettings(): Promise<SystemSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/system`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch system settings');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  }

  /**
   * Update system settings
   */
  async updateSystemSettings(settings: SystemSettings): Promise<SystemSettings> {
    try {
      const response = await fetch(`${this.baseUrl}/system`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: settings }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update system settings');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }

  /**
   * Get all providers
   */
  async getProviders(): Promise<Provider[]> {
    try {
      const response = await fetch(`${this.baseUrl}/providers`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch providers');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching providers:', error);
      throw error;
    }
  }

  /**
   * Get a provider by ID
   */
  async getProvider(id: string): Promise<Provider> {
    try {
      const response = await fetch(`${this.baseUrl}/providers/${id}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch provider with ID ${id}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error fetching provider with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Create a new provider
   */
  async createProvider(provider: Omit<Provider, 'id'>): Promise<Provider> {
    try {
      const response = await fetch(`${this.baseUrl}/providers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: provider }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create provider');
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error creating provider:', error);
      throw error;
    }
  }

  /**
   * Update a provider
   */
  async updateProvider(id: string, provider: Omit<Provider, 'id'>): Promise<Provider> {
    try {
      const response = await fetch(`${this.baseUrl}/providers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: provider }),
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update provider with ID ${id}`);
      }
      
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error(`Error updating provider with ID ${id}:`, error);
      throw error;
    }
  }

  /**
   * Delete a provider
   */
  async deleteProvider(id: string): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/providers/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete provider with ID ${id}`);
      }
    } catch (error) {
      console.error(`Error deleting provider with ID ${id}:`, error);
      throw error;
    }
  }
}

// Export a singleton instance
export const settingsService = new SettingsService();

/**
 * Convert bytes to human readable format
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};

/**
 * Convert human readable format to bytes
 */
export const parseBytes = (input: string): number => {
  const units: Record<string, number> = {
    'b': 1,
    'bytes': 1,
    'kb': 1024,
    'mb': 1024 * 1024,
    'gb': 1024 * 1024 * 1024,
    'tb': 1024 * 1024 * 1024 * 1024,
  };

  const match = input.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)$/);
  if (!match) return 0;
  
  const value = parseFloat(match[1]);
  const unit = match[2];
  
  if (units[unit]) {
    return value * units[unit];
  }
  
  return value;
}; 
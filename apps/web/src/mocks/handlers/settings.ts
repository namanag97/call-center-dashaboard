import { http, HttpResponse, delay } from 'msw';
import { 
  Provider, 
  ProviderType, 
  Category, 
  SystemSettings,
  ConcurrencyError
} from 'shared-types';

// Mock data
const mockProviders: Provider[] = [
  {
    id: 'provider-1',
    name: 'OpenAI',
    type: ProviderType.Analysis,
    enabled: true,
    apiKey: 'sk-mock-key-1',
    config: {
      model: 'gpt-4',
      temperature: 0.1
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1
  },
  {
    id: 'provider-2',
    name: 'Amazon Transcribe',
    type: ProviderType.Transcription,
    enabled: true,
    apiKey: 'mock-aws-key',
    config: {
      region: 'us-east-1',
      language: 'en-US'
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    version: 2
  },
  {
    id: 'provider-3',
    name: 'Amazon S3',
    type: ProviderType.Storage,
    enabled: true,
    config: {
      bucket: 'call-recordings',
      region: 'us-west-2'
    },
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1
  }
];

const mockCategories: Category[] = [
  {
    id: 'category-1',
    name: 'Compliance',
    description: 'Regulatory compliance topics',
    order: 1,
    enabled: true,
    keywords: ['compliance', 'regulation', 'policy', 'legal'],
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    version: 1
  },
  {
    id: 'category-2',
    name: 'Product Knowledge',
    description: 'Agent knowledge of products and services',
    order: 2,
    enabled: true,
    keywords: ['product', 'features', 'specifications', 'pricing'],
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    version: 3
  },
  {
    id: 'category-3',
    name: 'Customer Service',
    description: 'Quality of customer service and interaction',
    order: 3,
    enabled: true,
    keywords: ['service', 'satisfaction', 'experience', 'friendly', 'helpful'],
    updatedAt: new Date().toISOString(),
    createdAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
    version: 2
  }
];

const mockSystemSettings: SystemSettings = {
  defaultTranscriptionProviderId: 'provider-2',
  defaultAnalysisProviderId: 'provider-1',
  defaultStorageProviderId: 'provider-3',
  maxUploadSize: 50 * 1024 * 1024, // 50 MB
  allowedFileTypes: ['audio/mp3', 'audio/wav', 'audio/mpeg', 'audio/ogg'],
  maxFilesPerBatch: 10,
  retentionPeriodDays: 90,
  autoTranscribe: true,
  autoAnalyze: true,
  updatedAt: new Date().toISOString(),
  version: 4
};

// Helper function to check for version conflicts
const checkVersion = <T extends { version: number }>(current: T, submitted: { version: number }) => {
  if (current.version !== submitted.version) {
    return {
      isConflict: true,
      error: {
        code: 'VERSION_CONFLICT',
        message: 'The resource has been modified by another user',
        currentVersion: current.version,
        submittedVersion: submitted.version,
        currentData: current
      } as ConcurrencyError
    };
  }
  return { isConflict: false };
};

/**
 * Settings API handlers
 */
export const settingsHandlers = [
  // Get all providers
  http.get('/api/settings/providers', async () => {
    await delay(300);
    return HttpResponse.json({ data: mockProviders });
  }),

  // Get provider by ID
  http.get('/api/settings/providers/:id', async ({ params }) => {
    await delay(300);
    const { id } = params;
    const provider = mockProviders.find(p => p.id === id);
    
    if (!provider) {
      return new HttpResponse(JSON.stringify({ 
        error: { 
          code: 'NOT_FOUND',
          message: 'Provider not found' 
        } 
      }), { status: 404 });
    }
    
    return HttpResponse.json({ data: provider });
  }),

  // Create provider
  http.post('/api/settings/providers', async ({ request }) => {
    await delay(500);
    
    try {
      const data = await request.json() as Omit<Provider, 'id' | 'createdAt' | 'updatedAt' | 'version'>;
      
      // Validate required fields
      if (!data.name || !data.type) {
        return new HttpResponse(JSON.stringify({ 
          error: { 
            code: 'INVALID_INPUT',
            message: 'Name and type are required' 
          } 
        }), { status: 400 });
      }
      
      // Create new provider
      const newProvider: Provider = {
        ...data,
        id: `provider-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };
      
      // Add to mock data (in a real API this would be a database write)
      mockProviders.push(newProvider);
      
      return HttpResponse.json({ 
        data: newProvider,
        version: 1
      }, { status: 201 });
    } catch (error) {
      return new HttpResponse(JSON.stringify({ 
        error: { 
          code: 'SERVER_ERROR',
          message: 'Failed to process request' 
        } 
      }), { status: 500 });
    }
  }),

  // Update provider
  http.put('/api/settings/providers/:id', async ({ params, request }) => {
    await delay(500);
    
    try {
      const { id } = params;
      const data = await request.json() as Partial<Provider> & { version: number };
      
      // Find provider
      const providerIndex = mockProviders.findIndex(p => p.id === id);
      if (providerIndex === -1) {
        return new HttpResponse(JSON.stringify({ 
          error: { 
            code: 'NOT_FOUND',
            message: 'Provider not found' 
          } 
        }), { status: 404 });
      }
      
      const currentProvider = mockProviders[providerIndex];
      
      // Check version
      const versionCheck = checkVersion(currentProvider, data);
      if (versionCheck.isConflict) {
        return new HttpResponse(JSON.stringify({ 
          error: versionCheck.error
        }), { status: 409 });
      }
      
      // Update provider
      const updatedProvider: Provider = {
        ...currentProvider,
        ...data,
        id: currentProvider.id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
        version: currentProvider.version + 1
      };
      
      mockProviders[providerIndex] = updatedProvider;
      
      return HttpResponse.json({ 
        data: updatedProvider,
        version: updatedProvider.version
      });
    } catch (error) {
      return new HttpResponse(JSON.stringify({ 
        error: { 
          code: 'SERVER_ERROR',
          message: 'Failed to process request' 
        } 
      }), { status: 500 });
    }
  }),

  // Delete provider
  http.delete('/api/settings/providers/:id', async ({ params, request }) => {
    await delay(500);
    
    const { id } = params;
    const url = new URL(request.url);
    const version = Number(url.searchParams.get('version'));
    
    // Find provider
    const providerIndex = mockProviders.findIndex(p => p.id === id);
    if (providerIndex === -1) {
      return new HttpResponse(JSON.stringify({ 
        error: { 
          code: 'NOT_FOUND',
          message: 'Provider not found' 
        } 
      }), { status: 404 });
    }
    
    const currentProvider = mockProviders[providerIndex];
    
    // Check version if provided
    if (version && currentProvider.version !== version) {
      return new HttpResponse(JSON.stringify({ 
        error: {
          code: 'VERSION_CONFLICT',
          message: 'The resource has been modified by another user',
          currentVersion: currentProvider.version,
          submittedVersion: version,
          currentData: currentProvider
        }
      }), { status: 409 });
    }
    
    // Remove from mock data
    mockProviders.splice(providerIndex, 1);
    
    return new HttpResponse(null, { status: 204 });
  }),

  // Get all categories
  http.get('/api/settings/categories', async () => {
    await delay(300);
    return HttpResponse.json({ data: mockCategories });
  }),

  // Get category by ID
  http.get('/api/settings/categories/:id', async ({ params }) => {
    await delay(300);
    const { id } = params;
    const category = mockCategories.find(c => c.id === id);
    
    if (!category) {
      return new HttpResponse(JSON.stringify({ 
        error: { 
          code: 'NOT_FOUND',
          message: 'Category not found' 
        } 
      }), { status: 404 });
    }
    
    return HttpResponse.json({ data: category });
  }),

  // Create category
  http.post('/api/settings/categories', async ({ request }) => {
    await delay(500);
    
    try {
      const data = await request.json() as Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'version'>;
      
      // Validate required fields
      if (!data.name) {
        return new HttpResponse(JSON.stringify({ 
          error: { 
            code: 'INVALID_INPUT',
            message: 'Name is required' 
          } 
        }), { status: 400 });
      }
      
      // Create new category
      const newCategory: Category = {
        ...data,
        id: `category-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        version: 1
      };
      
      // Add to mock data
      mockCategories.push(newCategory);
      
      return HttpResponse.json({ 
        data: newCategory,
        version: 1
      }, { status: 201 });
    } catch (error) {
      return new HttpResponse(JSON.stringify({ 
        error: { 
          code: 'SERVER_ERROR',
          message: 'Failed to process request' 
        } 
      }), { status: 500 });
    }
  }),

  // Update category
  http.put('/api/settings/categories/:id', async ({ params, request }) => {
    await delay(500);
    
    try {
      const { id } = params;
      const data = await request.json() as Partial<Category> & { version: number };
      
      // Find category
      const categoryIndex = mockCategories.findIndex(c => c.id === id);
      if (categoryIndex === -1) {
        return new HttpResponse(JSON.stringify({ 
          error: { 
            code: 'NOT_FOUND',
            message: 'Category not found' 
          } 
        }), { status: 404 });
      }
      
      const currentCategory = mockCategories[categoryIndex];
      
      // Check version
      const versionCheck = checkVersion(currentCategory, data);
      if (versionCheck.isConflict) {
        return new HttpResponse(JSON.stringify({ 
          error: versionCheck.error
        }), { status: 409 });
      }
      
      // Update category
      const updatedCategory: Category = {
        ...currentCategory,
        ...data,
        id: currentCategory.id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString(),
        version: currentCategory.version + 1
      };
      
      mockCategories[categoryIndex] = updatedCategory;
      
      return HttpResponse.json({ 
        data: updatedCategory,
        version: updatedCategory.version
      });
    } catch (error) {
      return new HttpResponse(JSON.stringify({ 
        error: { 
          code: 'SERVER_ERROR',
          message: 'Failed to process request' 
        } 
      }), { status: 500 });
    }
  }),

  // Delete category
  http.delete('/api/settings/categories/:id', async ({ params, request }) => {
    await delay(500);
    
    const { id } = params;
    const url = new URL(request.url);
    const version = Number(url.searchParams.get('version'));
    
    // Find category
    const categoryIndex = mockCategories.findIndex(c => c.id === id);
    if (categoryIndex === -1) {
      return new HttpResponse(JSON.stringify({ 
        error: { 
          code: 'NOT_FOUND',
          message: 'Category not found' 
        } 
      }), { status: 404 });
    }
    
    const currentCategory = mockCategories[categoryIndex];
    
    // Check version if provided
    if (version && currentCategory.version !== version) {
      return new HttpResponse(JSON.stringify({ 
        error: {
          code: 'VERSION_CONFLICT',
          message: 'The resource has been modified by another user',
          currentVersion: currentCategory.version,
          submittedVersion: version,
          currentData: currentCategory
        }
      }), { status: 409 });
    }
    
    // Remove from mock data
    mockCategories.splice(categoryIndex, 1);
    
    return new HttpResponse(null, { status: 204 });
  }),

  // Get system settings
  http.get('/api/settings/system', async () => {
    await delay(300);
    return HttpResponse.json({ data: mockSystemSettings });
  }),

  // Update system settings
  http.put('/api/settings/system', async ({ request }) => {
    await delay(500);
    
    try {
      const data = await request.json() as Partial<SystemSettings> & { version: number };
      
      // Check version
      const versionCheck = checkVersion(mockSystemSettings, data);
      if (versionCheck.isConflict) {
        return new HttpResponse(JSON.stringify({ 
          error: versionCheck.error
        }), { status: 409 });
      }
      
      // Update settings
      const updatedSettings: SystemSettings = {
        ...mockSystemSettings,
        ...data,
        updatedAt: new Date().toISOString(),
        version: mockSystemSettings.version + 1
      };
      
      // Update mock data
      Object.assign(mockSystemSettings, updatedSettings);
      
      return HttpResponse.json({ 
        data: updatedSettings,
        version: updatedSettings.version
      });
    } catch (error) {
      return new HttpResponse(JSON.stringify({ 
        error: { 
          code: 'SERVER_ERROR',
          message: 'Failed to process request' 
        } 
      }), { status: 500 });
    }
  }),

  // Batch update categories (for reordering)
  http.put('/api/settings/categories/batch', async ({ request }) => {
    await delay(500);
    
    try {
      const data = await request.json() as { categories: Pick<Category, 'id' | 'order'>[], version: number };
      
      // Check if we have a valid batch update
      if (!data.categories || !Array.isArray(data.categories)) {
        return new HttpResponse(JSON.stringify({ 
          error: { 
            code: 'INVALID_INPUT',
            message: 'Invalid categories array' 
          } 
        }), { status: 400 });
      }
      
      // Process each category update
      const updatedCategories: Category[] = [];
      
      for (const update of data.categories) {
        const categoryIndex = mockCategories.findIndex(c => c.id === update.id);
        if (categoryIndex !== -1) {
          const category = mockCategories[categoryIndex];
          mockCategories[categoryIndex] = {
            ...category,
            order: update.order,
            updatedAt: new Date().toISOString(),
            version: category.version + 1
          };
          updatedCategories.push(mockCategories[categoryIndex]);
        }
      }
      
      return HttpResponse.json({ 
        data: updatedCategories 
      });
    } catch (error) {
      return new HttpResponse(JSON.stringify({ 
        error: { 
          code: 'SERVER_ERROR',
          message: 'Failed to process request' 
        } 
      }), { status: 500 });
    }
  }),
]; 
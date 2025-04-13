import React from 'react'
import Button from '../ui/Button'
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/24/solid'
import { Provider } from 'shared-types'

export interface ProviderListProps {
  providers: Provider[]
  isLoading?: boolean
  error?: string | null
  onAddProvider?: () => void
  onEditProvider?: (provider: Provider) => void
  onDeleteProvider?: (provider: Provider) => void
}

// Helper function to group providers by type
const groupProvidersByType = (providers: Provider[]) => {
  const grouped: Record<string, Provider[]> = {}
  
  providers.forEach(provider => {
    if (!grouped[provider.type]) {
      grouped[provider.type] = []
    }
    grouped[provider.type].push(provider)
  })
  
  return grouped
}

// Map of provider types to display names
const providerTypeDisplayNames: Record<string, string> = {
  transcription: 'Transcription Providers',
  analysis: 'Analysis Providers',
  storage: 'Storage Providers'
}

export const ProviderList: React.FC<ProviderListProps> = ({
  providers,
  isLoading = false,
  error = null,
  onAddProvider,
  onEditProvider,
  onDeleteProvider
}) => {
  const groupedProviders = groupProvidersByType(providers)
  
  // Helper function to render a group of providers
  const renderProviderGroup = (type: string, providers: Provider[]) => {
    const displayName = providerTypeDisplayNames[type] || type
    
    return (
      <div key={type} className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">{displayName}</h3>
        <div className="bg-white rounded-md shadow overflow-hidden">
          {providers.length === 0 ? (
            <div className="p-4 text-gray-500 italic">No providers configured</div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {providers.map(provider => (
                <li key={provider.id} className="px-4 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{provider.name}</h4>
                      {provider.apiKey && (
                        <div className="text-sm text-gray-500 mt-1">
                          API Key: <span className="font-mono">•••••••••••{provider.apiKey.slice(-4)}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      {onEditProvider && (
                        <button
                          onClick={() => onEditProvider(provider)}
                          className="p-1 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                          disabled={isLoading}
                        >
                          <PencilIcon className="h-5 w-5" />
                          <span className="sr-only">Edit</span>
                        </button>
                      )}
                      {onDeleteProvider && (
                        <button
                          onClick={() => onDeleteProvider(provider)}
                          className="p-1 rounded-md text-gray-400 hover:text-red-500 hover:bg-gray-100"
                          disabled={isLoading}
                        >
                          <TrashIcon className="h-5 w-5" />
                          <span className="sr-only">Delete</span>
                        </button>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-4">
        <p>Failed to load providers: {error}</p>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">API Providers</h2>
        {onAddProvider && (
          <Button
            onClick={onAddProvider}
            variant="outline"
            disabled={isLoading}
            className="flex items-center space-x-1"
          >
            <PlusIcon className="h-5 w-5" />
            <span>Add Provider</span>
          </Button>
        )}
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <span className="ml-3 text-gray-500">Loading providers...</span>
        </div>
      ) : providers.length === 0 ? (
        <div className="bg-white rounded-md shadow p-6 text-center">
          <p className="text-gray-500 mb-4">No API providers configured yet</p>
          {onAddProvider && (
            <Button
              onClick={onAddProvider}
              variant="primary"
              className="inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-1" />
              <span>Add Your First Provider</span>
            </Button>
          )}
        </div>
      ) : (
        <div>
          {Object.keys(groupedProviders).map(type => 
            renderProviderGroup(type, groupedProviders[type])
          )}
        </div>
      )}
    </div>
  )
}

export default ProviderList 
import React, { useState, useEffect } from 'react';
import { Button, Text, Alert, Spinner } from '../components/ui';
import { ProviderForm } from '../components/settings/ProviderForm';
import { CategorySettings } from '../components/settings/CategorySettings';
import { useSettingsStore } from '../store';
import { Provider, ProviderType } from '../components/settings/ProviderForm';
import { Category } from '../components/settings/CategorySettings';

/**
 * Settings page component for managing application settings
 */
const SettingsPage: React.FC = () => {
  // Get state and actions from settings store
  const { 
    providers,
    categories,
    systemSettings,
    isLoading,
    error,
    fetchProviders,
    addProvider,
    updateProvider,
    deleteProvider,
    fetchCategories,
    fetchSystemSettings,
    updateCategories
  } = useSettingsStore();

  // Local state
  const [activeTab, setActiveTab] = useState<string>('providers');
  const [isAddingProvider, setIsAddingProvider] = useState<boolean>(false);
  const [editProvider, setEditProvider] = useState<Provider | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Fetch data on mount and tab change
  useEffect(() => {
    if (activeTab === 'providers') {
      fetchProviders();
    } else if (activeTab === 'categories') {
      fetchCategories();
    } else if (activeTab === 'system') {
      fetchSystemSettings();
    }
  }, [activeTab, fetchProviders, fetchCategories, fetchSystemSettings]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timeout = setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [successMessage]);

  // Handle provider form submission
  const handleProviderSubmit = async (providerData: Partial<Provider>) => {
    try {
      if (editProvider) {
        await updateProvider(editProvider.id, providerData);
        setSuccessMessage('Provider updated successfully');
      } else {
        await addProvider(providerData);
        setSuccessMessage('Provider added successfully');
      }
      setIsAddingProvider(false);
      setEditProvider(null);
    } catch (err) {
      // Error is handled by the store and will be displayed via the error state
    }
  };

  // Handle provider deletion
  const handleDeleteProvider = async (providerId: string) => {
    if (window.confirm('Are you sure you want to delete this provider?')) {
      try {
        await deleteProvider(providerId);
        setSuccessMessage('Provider deleted successfully');
      } catch (err) {
        // Error is handled by the store
      }
    }
  };

  // Render provider list
  const renderProviderList = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center p-10">
          <Spinner size="lg" />
        </div>
      );
    }

    if (error) {
      return (
        <Alert status="error" className="mb-4">
          {error}
        </Alert>
      );
    }

    if (!providers?.length) {
      return (
        <div className="text-center p-8 bg-gray-50 rounded-md">
          <Text>No providers configured yet.</Text>
          <Button 
            onClick={() => setIsAddingProvider(true)} 
            className="mt-4"
          >
            Add Provider
          </Button>
        </div>
      );
    }

    return (
      <>
        <div className="mb-4 flex justify-end">
          <Button onClick={() => setIsAddingProvider(true)}>
            Add Provider
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {providers.map((provider: Provider) => (
                <tr key={provider.id}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{provider.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-500">{provider.type}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span
                      className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                        provider.enabled
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {provider.enabled ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditProvider(provider)}
                      className="text-indigo-600 hover:text-indigo-800 mr-2"
                    >
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProvider(provider.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    );
  };

  // Render categories tab content (placeholder)
  const renderCategoriesTab = () => {
    return (
      <div className="p-4 bg-white rounded-md">
        <CategorySettings
          categories={categories || []}
          isLoading={isLoading}
          error={error}
          onSaveCategories={updateCategories}
        />
      </div>
    );
  };

  // Render system settings tab content (placeholder)
  const renderSystemSettingsTab = () => {
    return (
      <div className="p-4 bg-white rounded-md">
        <Text>System settings will be implemented in a future update.</Text>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-gray-600">Manage application settings and integrations</p>
      </div>

      {successMessage && (
        <Alert status="success" className="mb-4">
          {successMessage}
        </Alert>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'providers'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('providers')}
            >
              API Providers
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'categories'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('categories')}
            >
              Categories
            </button>
            <button
              className={`px-4 py-3 text-sm font-medium ${
                activeTab === 'system'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('system')}
            >
              System Settings
            </button>
          </nav>
        </div>
        
        <div className="p-4">
          {activeTab === 'providers' && (
            <>
              {isAddingProvider || editProvider ? (
                <div className="bg-gray-50 p-4 rounded-md">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-medium">
                      {editProvider ? 'Edit Provider' : 'Add Provider'}
                    </h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsAddingProvider(false);
                        setEditProvider(null);
                      }}
                    >
                      Cancel
                    </Button>
                  </div>
                  <ProviderForm
                    provider={editProvider || undefined}
                    onSubmit={handleProviderSubmit}
                    onCancel={() => {
                      setIsAddingProvider(false);
                      setEditProvider(null);
                    }}
                    isLoading={isLoading}
                    error={error}
                  />
                </div>
              ) : (
                renderProviderList()
              )}
            </>
          )}
          
          {activeTab === 'categories' && renderCategoriesTab()}
          
          {activeTab === 'system' && renderSystemSettingsTab()}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage; 
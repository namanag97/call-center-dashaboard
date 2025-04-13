import React, { useEffect, useState } from 'react';
import { GeneralSettingsForm } from './GeneralSettingsForm';
import { fetchSystemSettings, updateSystemSettings, fetchProviders } from '../../services/settingsService';
import { SystemSettings, Provider } from '../../services/settingsService';
import Alert from '../ui/Alert';

/**
 * Container component for general settings that handles data fetching and updates
 */
export const GeneralSettingsContainer: React.FC = () => {
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    status: 'success' | 'error' | 'info';
    visible: boolean;
  } | null>(null);

  // Fetch settings and providers on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch settings and providers in parallel
        const [fetchedSettings, fetchedProviders] = await Promise.all([
          fetchSystemSettings(),
          fetchProviders()
        ]);
        
        setSettings(fetchedSettings);
        setProviders(fetchedProviders);
      } catch (err) {
        console.error('Error fetching settings data:', err);
        setError('Failed to load settings. Please try again later.');
        setNotification({
          message: 'Failed to load settings',
          status: 'error',
          visible: true
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle form submission
  const handleSubmit = async (updatedSettings: SystemSettings): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Update settings
      const result = await updateSystemSettings(updatedSettings);
      
      // Update local state with the result
      setSettings(result);
      
      // Show success message
      setNotification({
        message: 'Settings saved successfully',
        status: 'success',
        visible: true
      });
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to save settings. Please try again later.');
      setNotification({
        message: 'Failed to save settings',
        status: 'error',
        visible: true
      });
      throw err; // Re-throw to let the form know there was an error
    } finally {
      setIsLoading(false);
    }
  };

  // Handle notification close
  const handleCloseNotification = () => {
    setNotification(prev => prev ? { ...prev, visible: false } : null);
  };

  if (error && !settings) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
        <p className="font-medium">Error loading settings</p>
        <p className="text-sm mt-1">{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-800 rounded-md text-sm"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 rounded-full border-4 border-t-blue-500 border-r-blue-500 border-blue-200 animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      {notification && notification.visible && (
        <div className="mb-4">
          <Alert 
            status={notification.status} 
            onClose={handleCloseNotification}
          >
            {notification.message}
          </Alert>
        </div>
      )}
      
      <GeneralSettingsForm
        settings={settings}
        providers={providers}
        onSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default GeneralSettingsContainer; 